<template>
    <UTooltip text="从剪贴板粘贴">
        <UButton
            :icon="isPasted ? 'i-lucide-check' : 'i-lucide-clipboard'"
            size="sm"
            color="neutral"
            variant="ghost"
            class="hover:cursor-pointer"
            @click="handlePaste"
            aria-label="从剪贴板粘贴"
            :ui="{
                base: 'gap-0.5 px-0.5 py-1',
            }"
        >
            {{ isPasted ? "已粘贴" : "粘贴" }}
        </UButton>
    </UTooltip>
</template>

<script setup>
const toast = useToast();
const emit = defineEmits(["clipboard-paste"]);
const { $clipboard } = useNuxtApp();
const isPasted = ref(false);

const validPastePermission = async () => {
    const permission = await navigator.permissions.query({
        name: "clipboard-read",
    });
    if (permission.state === "denied") {
        toast.add({ title: "请允许剪贴板访问权限", color: "red" });
        return;
    }
};

const handlePaste = async () => {
    try {
        await validPastePermission();
        isPasted.value = true;
        const text = await $clipboard.readText();
        if (text && text.trim()) {
            emit("clipboard-paste", text);
        }
    } catch (error) {
        console.error("粘贴失败:", error);
    } finally {
        setTimeout(() => {
            isPasted.value = false;
        }, 500);
    }
};
</script>
