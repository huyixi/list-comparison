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
</template>

<script setup lang="ts">
import type { Sheet } from "~/types/sheet";
import { useFileHandler } from "~/composables/useFileHandler";
const toast = useToast();

const { isValidFileType, parseFile } = useFileHandler();

const emit = defineEmits<{
    (e: "import-data", data: Sheet[]): void;
    (e: "file-upload", data: Sheet[] | string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const isModalOpen = ref(false);
const workbookData = ref<Sheet[]>([]);
const TOOLTIPTEXT = "上传 txt,xlsx 文件";
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

    if (!isValidFileType(file)) {
        target.value = "";
        toast.add({
            title: "不支持该文件类型",
            description: "请上传 txt / csv / xlsx 格式文件",
            color: "warning",
        });
        return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
        const fileContent = await parseFile(file);
        if (ext === "xlsx") {
            workbookData.value = fileContent as Sheet[];
            isModalOpen.value = true;
        } else if (ext === "csv") {
            workbookData.value = fileContent as Sheet[];
            isModalOpen.value = true;
        } else {
            emit("file-upload", fileContent as string);
            target.value = "";
        }
    } catch (error) {
        console.error("Error parsing file:", error);
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
</script>
