<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import type { ImageItem } from "~/types/file";
import { useFileHandler } from "~/composables/useFileHandler";
import { useImage } from "~/composables/useImage";

const { imageItems, addImages, deleteImageAt, editorOpen, clearImages } =
    useImage();
const { parseFile, getFileType } = useFileHandler();
const toast = useToast();

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});

const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText")!;

const fileInput = ref<HTMLInputElement | null>(null);
const inputAccept = ref("");
const inputMultiple = ref(true);
const isXlsxModalOpen = ref(false);
const isImageModalOpen = ref(false);
const isProcessingImage = ref(false);
const workbookData = ref<Sheet[]>([]);
const spreadsheetQueue = ref<File[]>([]);

const TOOLTIP_TEXT = "上传 txt / xlsx / 图片";
const ACCEPT_IMAGE_TYPES = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    "image/png",
    "image/jpeg",
    "image/webp",
].join(",");
const ACCEPT_FILE_TYPES = [
    ".txt",
    ".csv",
    ".xlsx",
    ...ACCEPT_IMAGE_TYPES.split(","),
    "text/plain",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
].join(",");

const openCommonFilePicker = (isImage = false) => {
    inputAccept.value = isImage ? ACCEPT_IMAGE_TYPES : ACCEPT_FILE_TYPES;
    inputMultiple.value = true;
    nextTick(() => fileInput.value?.click());
};

const closeOtherModals = async () => {
    isImageModalOpen.value = false;
    isXlsxModalOpen.value = false;
    await nextTick();
};

const checkImageLimit = (files: File[]) => {
    const newImages = files.filter((file) => getFileType(file) === "image");
    const total = imageItems.value.length + newImages.length;
    return total > AppConfig.MAX_IMAGE_COUNT
        ? `最多上传 ${AppConfig.MAX_IMAGE_COUNT} 张图片`
        : null;
};

const classifyFiles = (files: File[]) => {
    const images: File[] = [];
    const spreadsheets: File[] = [];
    const texts: File[] = [];

    for (const file of files) {
        const type = getFileType(file);
        if (type === "image") images.push(file);
        else if (type === "spreadsheet") spreadsheets.push(file);
        else if (type === "text") texts.push(file);
    }
    return { images, spreadsheets, texts };
};

const handleFileInput = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = "";

    if (files.length === 0) {
        toast.add({ title: "请选择文件", color: "warning" });
        return;
    }

    const limitError = checkImageLimit(files);
    if (limitError) {
        toast.add({ title: limitError, color: "warning" });
        return;
    }

    const { images, spreadsheets, texts } = classifyFiles(files);

    try {
        if (images.length > 0) {
            if (!isImageModalOpen.value) {
                await closeOtherModals();
            }
            isProcessingImage.value = true;
            await addImages(images);
            isImageModalOpen.value = true;
        }

        if (spreadsheets.length > 0) {
            spreadsheetQueue.value = [...spreadsheets];
            processNextXlsxFile();
        }

        for (const file of texts) {
            const content = await parseFile(file);
            appendText(props.target, content as string);
        }

        if (
            images.length === 0 &&
            spreadsheets.length === 0 &&
            texts.length === 0
        ) {
            toast.add({
                title: "不支持的文件类型",
                description: "请上传 TXT、CSV、XLSX、JPG、PNG 等文件",
                color: "warning",
            });
        }
    } catch (err) {
        console.error("文件处理失败", err);
        toast.add({ title: "文件解析失败", color: "error" });
    }
};

const handleImages = async (files: File[]) => {
    try {
        const newItems: ImageItem[] = await Promise.all(
            files.map(async (file) => ({
                file,
                base64: await imageFileToBase64(file),
                croppedBase64: "",
                ocrText: "",
                ocrStatus: "idle",
            })),
        );
        addImages(newItems);
    } catch (err) {
        console.error("图片处理失败", err);
        toast.add({ title: "图片解析失败", color: "error" });
    }
};

const processNextXlsxFile = async () => {
    if (spreadsheetQueue.value.length === 0) return;
    const file = spreadsheetQueue.value.shift()!;
    const parsedSheets = await parseFile(file);
    workbookData.value = parsedSheets as Sheet[];
    isXlsxModalOpen.value = true;
};

watch([isImageModalOpen, isXlsxModalOpen], async ([imgOpen, xlsxOpen]) => {
    if (!imgOpen && isProcessingImage.value) {
        isProcessingImage.value = false;
        if (spreadsheetQueue.value.length > 0) {
            await closeOtherModals();
            await processNextXlsxFile();
        }
    }
});

watch(isXlsxModalOpen, async (val) => {
    if (!val && spreadsheetQueue.value.length > 0 && !isProcessingImage.value) {
        await closeOtherModals();
        await processNextXlsxFile();
    }
});

watch(isImageModalOpen, async (val) => {
    if (!val) {
        clearImages();
    }
});

provide("deleteImage", deleteImageAt);
provide("closeImageModal", () => {
    isImageModalOpen.value = false;
});

const closeImageModal = () => {
    stopOCR();
    console.log(ocrAbort.value);
};
</script>

<template>
    <UTooltip :text="TOOLTIP_TEXT">
        <UButton
            type="button"
            icon="i-lucide-file-up"
            size="md"
            color="neutral"
            variant="ghost"
            :aria-label="TOOLTIP_TEXT"
            class="hover:cursor-pointer"
            @click="openCommonFilePicker()"
            :ui="{
                base: 'gap-0.5 ps-1 pe-3 py-3',
                leadingIcon: 'size-4',
            }"
        >
            导入文件
        </UButton>
    </UTooltip>

    <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="inputAccept"
        :multiple="inputMultiple"
        @change="handleFileInput"
    />

    <XlsxImportModal
        :target="props.target"
        v-model:open="isXlsxModalOpen"
        :workbook-data="workbookData"
    />

    <ImageImportModal
        :target="props.target"
        :imageItems="imageItems"
        v-model:open="isImageModalOpen"
        @add-image="openCommonFilePicker(true)"
    />

    <ImageImportEditor v-model:open="editorOpen" />
</template>
