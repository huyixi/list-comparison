<template>
    <div>
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
    </div>
</template>

<script setup>
const props = defineProps({
    accept: String,
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

const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length) {
        emit("file-upload", files);
        e.target.value = null;
    }
};
</script>
