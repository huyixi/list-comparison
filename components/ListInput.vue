<!-- components/ListInput.vue -->
<script setup lang="ts">
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const rawInput = defineModel<string>();

const props = defineProps({
    title: String,
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
    totalCount: Number,
    separators: {
        type: Array,
        default: () => [],
    },
});

const focusTextarea = () => {
    textareaRef.value?.focus();
};

defineExpose({
    focusTextarea,
});
</script>

<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden"
    >
        <div
            class="flex items-center justify-between border-b border-gray-200 bg-gray-50 ps-3"
        >
            <h2 class="text-lg font-medium text-gray-700">{{ props.title }}</h2>
            <div class="flex items-center gap-0">
                <PasteButton :target="target" @request-focus="focusTextarea" />
                <FileUploader :target="target" />
            </div>
        </div>

        <textarea
            ref="textareaRef"
            class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
            placeholder="输入名单，每项可用逗号、分号、制表符或换行分隔。"
            v-model="rawInput"
        ></textarea>

        <div
            class="flex justify-between items-center border-t border-gray-200 bg-gray-50 text-sm"
        >
            <SeperatorModal :totalCount="props.totalCount"></SeperatorModal>
            <div class="flex items-center justify-end gap-3 p-2">
                <slot name="stats"></slot>
            </div>
        </div>
    </div>
</template>
