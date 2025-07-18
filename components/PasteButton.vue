<script setup lang="ts">
const emit = defineEmits(["request-focus"]);
const isPasted = ref(false);

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});
const clipboard = useClipboard();
const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText");

const handlePaste = async () => {
    emit("request-focus");

    const text = await clipboard.readText();
    if (text?.trim()) {
        appendText(props.target, text.trim());

        isPasted.value = true;

        setTimeout(() => (isPasted.value = false), 500);
    }
};
</script>

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
