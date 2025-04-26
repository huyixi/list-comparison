<template>
    <UTooltip :text="tooltip">
        <UButton
            :icon="icon"
            :size="size"
            :color="color"
            :variant="variant"
            @click="openFilePicker"
            :aria-label="tooltip"
            class="hover:cursor-pointer"
        />
    </UTooltip>
    <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileChange"
    />
</template>

<script setup>
const props = defineProps({
    accept: {
        type: String,
        default:
            ".txt,.csv,.xlsx,text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    multiple: Boolean,
    tooltip: {
        type: String,
        default: "上传文件",
    },
    icon: {
        type: String,
        default: "i-lucide-file-up",
    },
    size: {
        type: String,
        default: "xs",
    },
    color: {
        type: String,
        default: "neutral",
    },
    variant: {
        type: String,
        default: "outline",
    },
});

const emit = defineEmits(["file-upload"]);

const fileInput = ref(null);

const openFilePicker = () => {
    fileInput.value.click();
};

const handleFileChange = async (e) => {
    const files = e.target.files;
    const file = files?.[0];
    if (!isValidFileType(file)) {
        console.warn(`Unsupported file type: ${file.type || file.name}`);
        toast.add({
            title: "不支持的文件类型",
            description: "请上传 .txt 或 .csv 文件。",
            color: "orange",
            icon: "i-lucide-circle-alert",
        });
        return;
    }
    try {
        const content = await readFileContent(file);
        emit("file-upload", content);
    } catch (error) {
        console.error("File reading error:", error);
        toast.add({
            title: "读取文件出错",
            color: "red",
            icon: "i-lucide-circle-alert",
        });
    }
};

const isValidFileType = (file) => {
    const validTypes = ["text/plain", "text/csv"];
    const validExtensions = [".txt", ".csv"];

    return (
        validTypes.includes(file.type) ||
        validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
};

const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};
</script>
