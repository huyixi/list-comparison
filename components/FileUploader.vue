<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import type { ImageItem } from "~/types/file";
import { useFileHandler } from "~/composables/useFileHandler";
import { useImage } from "~/composables/useImage";

const { imageItems, imageItemCount, deleteImageAt, clearImages } = useImage();

const toast = useToast();
const { parseFile, getFileType } = useFileHandler();

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});

const fileInput = ref<HTMLInputElement | null>(null);
const isXlsxModalOpen = ref(false);
const isImageModalOpen = ref(false);
const workbookData = ref<Sheet[]>([]);
const TOOLTIP_TEXT = "上传 txt / xlsx / 图片";
const ACCEPT_FILE_TYPES = [
    ".txt",
    ".csv",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    "text/plain",
    "text/csv",
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
].join(",");
const ACCEPT_IMAGE_TYPES = [
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    "image/png",
    "image/jpeg",
    "image/webp",
].join(",");
const MAX_FILE_COUNT = 9;

const inputAccept = ref("");
const inputMultiple = ref(true);

const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText")!;

const openCommonFilePicker = () => {
    inputAccept.value = ACCEPT_FILE_TYPES;
    inputMultiple.value = true;

    nextTick(() => {
        fileInput.value?.click();
    });
};

const openImageFilePicker = () => {
    inputAccept.value = ACCEPT_IMAGE_TYPES;
    inputMultiple.value = true;

    nextTick(() => {
        fileInput.value?.click();
    });
};

const checkFileUploadConstraints = (
    files: File[],
    existingImages: ImageItem[] = [],
): string | null => {
    const fileTypes = getFileType(files[0]);
    const uniqueTypes = [...new Set(fileTypes)];

    let totalCount = files.length;
    if (uniqueTypes.some((type) => type === "image")) {
        totalCount += existingImages.length;
    }

    if (totalCount > MAX_FILE_COUNT) {
        return `文件上传数量超出限制，最多上传 ${MAX_FILE_COUNT} 个文件`;
    }

    if (files.length > 1) {
        if (uniqueTypes.includes("spreadsheet")) {
            return "一次仅支持上传一个 .xlsx 文件";
        }
        if (uniqueTypes.includes("image") && uniqueTypes.includes("text")) {
            return "不能同时上传图片和文本";
        }
    }
    return null;
};

const processSelectedFiles = async (e: Event) => {
    console.log("processSelectedFiles");
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
        toast.add({ title: "请选择文件", color: "warning" });
        return;
    }

    const fileArray = Array.from(files);
    const fileTypes = fileArray.map(getFileType).filter(Boolean) as string[];
    const uniqueTypes = Array.from(new Set(fileTypes));
    const resetInput = () => (input.value = "");

    const error = checkFileUploadConstraints(fileArray, imageItems.value);
    if (error) {
        toast.add({ title: error, color: "warning" });
        return resetInput();
    }

    try {
        if (uniqueTypes[0] === "spreadsheet") {
            console.log("parseFile");
            const parsedSheets = await parseFile(fileArray[0]);
            workbookData.value = parsedSheets as Sheet[];
            isXlsxModalOpen.value = true;
        } else if (uniqueTypes[0] === "image") {
            await processImageFiles(fileArray);
            console.log("processImageFiles");
            isImageModalOpen.value = true;
        } else if (uniqueTypes[0] === "text") {
            for (const file of fileArray) {
                const content = await parseFile(file);
                appendText(props.target, content as string);
            }
        } else {
            toast.add({
                title: "不支持的文件类型",
                description: "请上传 .xlsx、.jpg、.png、.txt 等文件",
                color: "warning",
            });
        }
    } catch (error) {
        console.error("文件处理失败", error);
        toast.add({ title: "文件解析失败", color: "error" });
    } finally {
        input.value = "";
    }
};

const processImageFiles = async (files: File[]) => {
    try {
        const newItems: ImageItem[] = [];

        for (const file of files) {
            const base64 = await imageFileToBase64(file);
            newItems.push({
                file,
                base64,
                croppedBase64: "",
                ocrText: "",
                ocrStatus: "idle",
            });
        }
        imageItems.value.push(...newItems);
    } catch (error) {
        console.error("图片处理失败", error);
        toast.add({ title: "图片解析失败", color: "error" });
    } finally {
        if (fileInput.value) fileInput.value.value = "";
    }
};

watch([isImageModalOpen, isXlsxModalOpen], ([valImageOpen, valXlsxOpen]) => {
    if (!valImageOpen && !valXlsxOpen) {
        if (fileInput.value) {
            fileInput.value.value = "";
        }
        clearImages();
    }
});

watch(imageItemCount, () => {
    if (imageItems.value.length === 0) {
        isImageModalOpen.value = false;
        if (fileInput.value) fileInput.value.value = "";
    }
});

provide("deleteImage", deleteImageAt);
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
            @click="openCommonFilePicker"
            :ui="{
                base: 'gap-0.5 ps-1 py-3',
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
        @change="processSelectedFiles"
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
        @add-image="openImageFilePicker"
    />
</template>
