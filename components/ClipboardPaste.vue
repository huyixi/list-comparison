<template>
    <UButton
        :icon="isPasting ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
        size="xs"
        color="neutral"
        variant="outline"
        class="hover:cursor-pointer"
        @click="handlePaste"
        aria-label="从剪贴板粘贴"
        :disabled="isPasting"
    >
    </UButton>
</template>

<script setup>
const toast = useToast();
// const props = defineProps({
//     targetList: {
//         type: String,
//         required: true,
//         validator: (value) => ["A", "B"].includes(value),
//     },
// });

const emit = defineEmits(["paste"]);
const { $clipboard } = useNuxtApp();
const isPasting = ref(false);

const handlePaste = async () => {
    try {
        const text = await $clipboard.readText();
        if (text && text.trim()) {
            emit("paste", text);
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
};
</script>
