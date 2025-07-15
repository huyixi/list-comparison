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
            @click="openFilePicker"
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
        v-model:open="isXlsxModalOpen"
        :workbook-data="workbookData"
        @import-data="handleImportedData"
    />

    <ImageImportModal
        v-model:open="isImageModalOpen"
        :imageFiles="imageFiles"
        @add-image="openImageFilePicker"
        @delete-image="handleImageDelete"
    />
</template>

<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import { useFileHandler } from "~/composables/useFileHandler";

const toast = useToast();
const { parseFile, getFileType } = useFileHandler();

const emit = defineEmits<{
    (e: "import-data", data: Sheet[]): void;
    (e: "file-upload", data: Sheet[] | string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isXlsxModalOpen = ref(false);
const isImageModalOpen = ref(false);
const imageFiles = ref<File[]>([]);
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

const openFilePicker = () => {
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
    existingImages: File[] = [],
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
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const fileTypes = fileArray.map(getFileType).filter(Boolean) as string[];
    const uniqueTypes = Array.from(new Set(fileTypes));
    const resetInput = () => (input.value = "");

    const error = checkFileUploadConstraints(fileArray, imageFiles.value);
    if (error) {
        toast.add({ title: error, color: "warning" });
        return resetInput();
    }

    try {
        if (uniqueTypes[0] === "spreadsheet") {
            const parsedSheets = await parseFile(fileArray[0]);
            workbookData.value = parsedSheets as Sheet[];
            isXlsxModalOpen.value = true;
        } else if (uniqueTypes[0] === "image") {
            imageFiles.value = [...imageFiles.value, ...fileArray];
            isImageModalOpen.value = true;
        } else if (uniqueTypes[0] === "text") {
            for (const file of fileArray) {
                const content = await parseFile(file);
                emit("file-upload", content as string);
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

const handleImportedData = (data: string) => {
    emit("file-upload", data);
    isXlsxModalOpen.value = false;
    isImageModalOpen.value = false;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

watch(isImageModalOpen, () => {
    if (!isImageModalOpen.value) {
        imageFiles.value = [];
    }
});

const handleImageDelete = (index: number) => {
    console.log("handleImageDelete", index);
    imageFiles.value.splice(index, 1);
    if (imageFiles.value.length === 0) {
        isImageModalOpen.value = false;
    }
};
</script>
