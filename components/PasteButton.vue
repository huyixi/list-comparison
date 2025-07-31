<script setup lang="ts">
const emit = defineEmits(["request-focus"]);
const pasteStatus = ref<PasteStatus>("idle");

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});
const { readText, readSuccess } = useClipboard();

const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText");

const handlePaste = async () => {
    emit("request-focus");

    const { success, text } = await readText();

    if (success && typeof text === "string" && text.trim()) {
        appendText?.(props.target, text.trim());
        pasteStatus.value = "success";
        setTimeout(() => {
            pasteStatus.value = "idle";
        }, 500);
    } else {
        pasteStatus.value = "fail";
        setTimeout(() => {
            pasteStatus.value = "idle";
        }, 500);
    }
};

const pasteText = computed(() => {
    switch (pasteStatus.value) {
        case "success":
            return "已粘贴";
        case "fail":
            return "粘贴失败";
        default:
            return "粘贴";
    }
});

const pasteIcon = computed(() => {
    switch (pasteStatus.value) {
        case "success":
            return "i-lucide-check";
        case "fail":
            return "i-lucide-x";
        default:
            return "i-lucide-clipboard";
    }
});
</script>

<template>
    <UTooltip text="从剪贴板粘贴">
        <UButton
            :icon="pasteIcon"
            size="md"
            color="neutral"
            variant="ghost"
            class="hover:cursor-pointer"
            @click="handlePaste"
            aria-label="从剪贴板粘贴"
            :ui="{
                base: 'gap-0.5 pe-1 py-3',
                leadingIcon: 'size-4',
            }"
        >
            {{ pasteText }}
        </UButton>
    </UTooltip>
</template>
