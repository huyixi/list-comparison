<template>
    <UTooltip :text="TOOLTIPTEXT">
        <UButton
            type="button"
            icon="i-lucide-file-up"
            size="sm"
            color="neutral"
            variant="ghost"
            :aria-label="TOOLTIPTEXT"
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
        :accept="ACCEPTFILETYPE"
        @change="handleFileChange"
    />

    <XlsxImportModal
        v-if="isModalOpen"
        :workbook-data="workbookData"
        @import-data="handleImportedData"
        @close="closeXlsxImportModal"
    />

    <ImageImportModal v-model:open="isImageModalOpen" :src="imagePreviewUrl" />
</template>

<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import { useFileHandler } from "~/composables/useFileHandler";

const toast = useToast();
const { parseFile, getFileCategory } = useFileHandler();

const emit = defineEmits<{
    (e: "import-data", data: Sheet[]): void;
    (e: "file-upload", data: Sheet[] | string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isModalOpen = ref(false);
const isImageModalOpen = ref(false);
const workbookData = ref<Sheet[]>([]);
const imagePreviewUrl = ref<string | null>(null);
const TOOLTIPTEXT = "上传 txt / xlsx / 图片";
const ACCEPTFILETYPE =
    ".txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp," +
    "text/plain,text/csv," +
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
    "image/png,image/jpeg,image/webp";

const openFilePicker = () => {
    fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const category = getFileCategory(file);

    if (!category) {
        target.value = "";
        toast.add({
            title: "不支持该文件类型",
            description: "请上传 txt / csv / xlsx / 图片格式文件",
            color: "warning",
        });
        return;
    }

    try {
        if (category === "spreadsheet") {
            const fileContent = await parseFile(file);
            workbookData.value = fileContent as Sheet[];
            isModalOpen.value = true;
        } else if (category === "image") {
            const reader = new FileReader();
            reader.onload = () => {
                imagePreviewUrl.value = reader.result as string;
                isImageModalOpen.value = true;
            };
            reader.readAsDataURL(file);
        } else if (category === "text") {
            const fileContent = await parseFile(file);
            emit("file-upload", fileContent as string);
            target.value = "";
        }
    } catch (error) {
        console.error("Error parsing file:", error);
        toast.add({
            title: "文件解析失败",
            color: "error",
        });
    }
};

const handleImportedData = (data: string) => {
    emit("file-upload", data);
    isModalOpen.value = false;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};
const closeXlsxImportModal = () => {
    isModalOpen.value = false;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};
const closeImageModal = () => {
    isImageModalOpen.value = false;
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};
</script>
