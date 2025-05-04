<template>
    <UTooltip text="从剪贴板粘贴">
        <UButton
            :icon="isPasted ? 'i-lucide-check' : 'i-lucide-clipboard'"
            size="sm"
            color="neutral"
            variant="outline"
            class="hover:cursor-pointer"
            @click="handlePaste"
            aria-label="从剪贴板粘贴"
            :ui="{
                base: 'gap-0.5 py-1 px-1.5',
            }"
        >
            {{ isPasted ? "已粘贴" : "粘贴" }}
        </UButton>
    </UTooltip>
</template>

<script setup>
const toast = useToast();
const emit = defineEmits(["clipboard-paste", "request-focus"]);
const isPasted = ref(false);

const validPastePermission = async () => {
    try {
        await navigator.clipboard.readText();
        return true;
    } catch (error) {
        console.error("剪贴板访问权限错误", error);
        if (error.name === "NotAllowedError") {
            toast.add({ title: "请允许剪贴板访问权限", color: "warning" });
        }
        return false;
    }
};

const handlePaste = async () => {
    try {
        emit("request-focus");
        const permissionGranted = await validPastePermission();
        if (!permissionGranted) return;

        isPasted.value = true;
        const text = await navigator.clipboard.readText();
        if (text?.trim()) {
            emit("clipboard-paste", text.trim());
        }
    } catch (error) {
        console.error("粘贴失败，尝试使用回退方案:", error);
        await fallbackPaste();
    } finally {
        setTimeout(() => (isPasted.value = false), 500);
    }
};

const fallbackPaste = async () => {
    try {
        const activeElement = document.activeElement;
        if (!activeElement.isContentEditable) {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }

        const success = document.execCommand("paste");
        if (success) {
            const text = window.getSelection().toString();
            if (text?.trim()) {
                emit("clipboard-paste", text.trim());
            }
        }
    } catch (error) {
        toast.add({
            title: "粘贴失败",
            description: "请尝试手动粘贴 (Ctrl+V)",
            color: "red",
        });
    }
};
</script>
