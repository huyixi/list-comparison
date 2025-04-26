<template>
    <UButton
        :icon="isPasted ? 'i-lucide-check' : 'i-lucide-clipboard'"
        size="xs"
        color="neutral"
        variant="outline"
        class="hover:cursor-pointer"
        @click="handlePaste"
        aria-label="从剪贴板粘贴"
        :disabled="isPasted"
    >
    </UButton>
</template>

<script setup>
const toast = useToast();
const emit = defineEmits(["paste"]);
const { $clipboard } = useNuxtApp();
const isPasted = ref(false);

const handlePaste = async () => {
    try {
        isPasted.value = true;
        const text = await $clipboard.readText();
        if (text && text.trim()) {
            emit("paste", text);
        }
    } catch (error) {
        console.error("粘贴失败:", error);
        toast.add({
            title: "无法访问剪贴板",
            color: "red",
            icon: "i-lucide-circle-check",
            timeout: 3000,
        });
    } finally {
        setTimeout(() => {
            isPasted.value = false;
        }, 200);
    }
};
</script>
