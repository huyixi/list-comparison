<template>
    <UTooltip text="从剪贴板粘贴">
        <UButton
            :icon="isPasted ? 'i-lucide-check' : 'i-lucide-clipboard'"
            size="md"
            color="neutral"
            variant="ghost"
            class="hover:cursor-pointer"
            @click="handlePaste"
            aria-label="从剪贴板粘贴"
            :ui="{
                base: 'gap-0.5 pe-1 py-3',
            }"
        >
            {{ isPasted ? "已粘贴" : "粘贴" }}
        </UButton>
    </UTooltip>
</template>

<script setup>
const emit = defineEmits(["clipboard-paste", "request-focus"]);
const isPasted = ref(false);
const clipboard = useClipboard();

const handlePaste = async () => {
    emit("request-focus");

    isPasted.value = true;
    const text = await clipboard.readText();
    if (text?.trim()) {
        emit("clipboard-paste", text.trim());
    }
    setTimeout(() => (isPasted.value = false), 500);
};
</script>
