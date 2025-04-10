<template>
    <UButton
        icon="i-heroicons-clipboard"
        size="xs"
        color="neutral"
        variant="outline"
        class="hover:cursor-pointer"
        @click="pasteFromClipboard"
        aria-label="从剪贴板粘贴"
        :disabled="isPasting"
    >
    </UButton>
</template>

<script setup>
const toast = useToast();
const props = defineProps({
    targetList: {
        type: String,
        required: true,
        validator: (value) => ["A", "B"].includes(value),
    },
});

const emit = defineEmits(["paste"]);
const { $clipboard } = useNuxtApp();
const isPasting = ref(false);

async function pasteFromClipboard() {
    if (isPasting.value) return;

    isPasting.value = true;

    try {
        const text = await $clipboard.readText();

        // 只有当文本非空时才触发粘贴事件
        if (text && text.trim()) {
            emit("paste", {
                targetList: props.targetList,
                content: text,
            });
        }
    } catch (error) {
        console.error("粘贴失败:", error);

        toast.add({
            title: "无法访问剪贴板",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
            timeout: 3000,
        });
    } finally {
        isPasting.value = false;
    }
}
</script>
