<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col"
    >
        <div
            class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
        >
            <h2 class="text-base font-medium text-gray-700">{{ title }}</h2>
            <div class="flex items-center gap-2">
                <ClipboardPaste
                    @request-focus="focusTextarea"
                    @clipboard-paste="
                        (content) => $emit('clipboard-paste', content)
                    "
                />
                <FileUploader @file-upload="handleFileUpload" />
<<<<<<< Updated upstream
                <CustomSeperator />
=======
                <SeperatorPopover />
>>>>>>> Stashed changes
            </div>
        </div>

        <textarea
            :value="modelValue"
            ref="textareaRef"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
            :placeholder="placeholder"
        ></textarea>

        <div
            class="flex justify-between items-center border-t border-gray-200 bg-gray-50 text-xs"
        >
            <span class="text-gray-700 p-2">检测到 {{ totalCount }} 项</span>
            <div class="flex items-center justify-end gap-3 p-2">
                <slot name="stats"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
const textareaRef = ref(null);

defineProps({
    title: String,
    modelValue: String,
    placeholder: {
        type: String,
        default: "输入名单，每项可用逗号、分号、制表符或换行分隔。",
    },
    totalCount: Number,
});

const emit = defineEmits([
    "update:modelValue",
    "clipboard-paste",
    "file-upload",
]);

const handleFileUpload = (files) => {
    emit("file-upload", files);
};

const focusTextarea = () => {
    textareaRef.value?.focus();
};
defineExpose({
    focusTextarea,
});
</script>
