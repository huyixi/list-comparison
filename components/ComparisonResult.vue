<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
    >
        <div
            class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
        >
            <h2 class="text-base font-medium text-gray-700">{{ title }}</h2>
            <UButton
                :icon="
                    copied
                        ? 'i-heroicons-check-circle'
                        : 'i-heroicons-clipboard-document'
                "
                color="neutral"
                size="xs"
                variant="outline"
                @click="handleCopy(items, true)"
                :aria-label="`复制${title}`"
                class="hover:cursor-pointer"
            />
        </div>
        <div class="min-h-64 max-h-64 overflow-y-auto">
            <ul class="text-sm">
                <li
                    v-for="(name, index) in items"
                    :key="index"
                    class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:cursor-pointer"
                    @click="handleCopy(name, false)"
                >
                    {{ name }}
                </li>
                <li
                    v-if="!items.length"
                    class="px-3 py-4 text-center text-gray-400 text-xs"
                >
                    {{ emptyText }}
                </li>
            </ul>
        </div>
        <div
            class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
        >
            {{ items.length }} 条{{ suffix }}
        </div>
    </div>
</template>

<script setup>
const toast = useToast();
const props = defineProps({
    title: String,
    items: Array,
    emptyText: String,
    suffix: String,
});

const copied = ref(false);

const handleCopy = async (content, isCopyAll = false) => {
    let textToCopy;

    // 处理数组类型
    if (Array.isArray(content)) {
        if (content.length === 0) {
            toast.add({
                title: "无可复制内容",
                description: "该名单为空。",
                color: "blue",
                icon: "i-heroicons-information-circle",
            });
            return;
        }
        textToCopy = content.join("\n");
    }
    // 处理字符串类型
    else {
        if (typeof content !== "string" || content.trim() === "") {
            toast.add({
                title: "无可复制内容",
                description: "该条目内容为空。",
                color: "blue",
                icon: "i-heroicons-information-circle",
            });
            return;
        }
        textToCopy = content;
    }

    try {
        await navigator.clipboard.writeText(textToCopy);

        // 仅在全量复制时更新按钮状态
        if (isCopyAll) {
            copied.value = true;
            setTimeout(() => (copied.value = false), 2000);
        }
        // 单项复制显示成功提示
        else {
            toast.add({
                title: "复制成功",
                description: "内容已复制到剪贴板。",
                color: "green",
                icon: "i-heroicons-check-circle",
            });
        }
    } catch (error) {
        toast.add({
            title: "复制失败",
            description: "复制失败，请尝试手动复制。",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
        });
    }
};
</script>
