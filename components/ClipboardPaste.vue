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
        toast.add({ title: "请允许剪贴板访问权限", color: "warning" });
        return false;
    }
    return true;
};

const handlePaste = async () => {
    try {
        const permissionGranted = await validPastePermission();
        if (!permissionGranted) return;

        isPasted.value = true;

        const text = await $clipboard.readText();
        if (text && text.trim()) {
            emit("clipboard-paste", text);
        } else {
            fallbackPaste();
        }
    } catch (error) {
        console.error("粘贴失败:", error);
        toast.add({ title: "粘贴失败", color: "red" });
    } finally {
        setTimeout(() => {
            isPasted.value = false;
        }, 500);
    }
};

const fallbackPaste = () => {
    try {
        const text = document.execCommand("paste");
        if (text && text.trim()) {
            emit("clipboard-paste", text);
        }
    } catch (fallbackError) {
        console.error("回退到 `execCommand` 粘贴失败:", fallbackError);
        toast.add({ title: "粘贴失败", color: "red" });
    }
};
</script>
