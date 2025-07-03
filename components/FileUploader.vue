<template>
    <UTooltip :text="TOOLTIP_TEXT">
        <UButton
            type="button"
            icon="i-lucide-file-up"
            size="sm"
            color="neutral"
            variant="ghost"
            :aria-label="TOOLTIP_TEXT"
            class="hover:cursor-pointer"
            @click="openFilePicker"
            :ui="{
                base: 'gap-0.5 p-0',
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

    <ImageImportModal v-model:open="isImageModalOpen" :src="imageUrl" />
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
const imageUrl = ref<string | null>(null);
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
const inputAccept = ref("");
const inputMultiple = ref(true);

const openFilePicker = () => {
    inputAccept.value = ACCEPT_FILE_TYPES;
    inputMultiple.value = true;

    nextTick(() => {
        fileInput.value?.click();
    });
};

const processSelectedFiles = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const fileTypes = fileArray.map(getFileType).filter(Boolean) as string[];
    const uniqueTypes = Array.from(new Set(fileTypes));

    if (fileArray.length > 1) {
        if (uniqueTypes.includes("spreadsheet")) {
            toast.add({
                title: "一次仅支持上传一个 .xlsx 文件",
                color: "warning",
            });
            input.value = "";
            return;
        }
        if (uniqueTypes.includes("image") && uniqueTypes.includes("text")) {
            toast.add({
                title: "不能同时上传图片和文本",
                color: "warning",
            });
            input.value = "";
            return;
        }
    }

    try {
        if (uniqueTypes[0] === "spreadsheet") {
            const parsedSheets = await parseFile(fileArray[0]);
            workbookData.value = parsedSheets as Sheet[];
            isXlsxModalOpen.value = true;
        } else if (uniqueTypes[0] === "image") {
            const file = fileArray[0];
            const reader = new FileReader();
            reader.onload = () => {
                imageUrl.value = reader.result as string;
                isImageModalOpen.value = true;
            };
            reader.readAsDataURL(file);
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
</script>
