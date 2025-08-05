<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import { useFileHandler } from "~/composables/useFileHandler";
import { useImage } from "~/composables/useImage";
import { useModalQueue } from "~/composables/useModalQueue";

const { imageItems, addImages, editorOpen, clearImages } = useImage();
const { parseFile, getFileType } = useFileHandler();
const { queueModal } = useModalQueue();
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
const workbookData = ref<Sheet[]>([]);

const TOOLTIP_TEXT = "上传 txt / xlsx / 图片";

const openCommonFilePicker = (isImage = false) => {
    inputAccept.value = isImage
        ? AppConfig.ACCEPT_IMAGE_TYPES
        : AppConfig.ACCEPT_FILE_TYPES;
    inputMultiple.value = true;
    nextTick(() => fileInput.value?.click());
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
        toast.add({ title: "请选择文件上传", color: "warning" });
        return;
    }

    const limitError = checkImageLimit(files);
    if (limitError) {
        toast.add({ title: limitError, color: "warning" });
        return;
    }

    const { images, spreadsheets, texts } = classifyFiles(files);

    try {
        if (texts.length > 0) {
            for (const file of texts) {
                const content = await parseFile(file);
                appendText(props.target, content as string);
            }
        }

        if (isImageModalOpen.value && images.length > 0) {
            await addImages(images);
        } else if (!isImageModalOpen.value && images.length > 0) {
            queueModal(() => {
                return new Promise<void>(async (resolve) => {
                    await addImages(images);
                    isImageModalOpen.value = true;

                    const stop = watch(isImageModalOpen, (val) => {
                        if (!val) {
                            stop();
                            clearImages();
                            resolve();
                        }
                    });
                });
            });
        }

        if (spreadsheets.length > 0) {
            for (const file of spreadsheets) {
                queueModal(() => {
                    return new Promise<void>(async (resolve) => {
                        const sheets = await parseFile(file);
                        workbookData.value = sheets as Sheet[];
                        isXlsxModalOpen.value = true;

                        const stop = watch(isXlsxModalOpen, (val) => {
                            if (!val) {
                                stop();
                                resolve();
                            }
                        });
                    });
                });
            }
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

provide("closeImageModal", () => {
    clearImages();
    isImageModalOpen.value = false;
});
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
