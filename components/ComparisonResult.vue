<script setup lang="ts">
const toast = useToast();

const props = defineProps({
    title: String,
    items: Array,
    emptyText: String,
    suffix: String,
});

const clipboard = useClipboard();
const { writeText } = clipboard;

type CopyStatus = "idle" | "success" | "fail";
const copyStatus = ref<CopyStatus>("idle");

const copyIcon = computed(() => {
    switch (copyStatus.value) {
        case "success":
            return "i-lucide-check";
        case "fail":
            return "i-lucide-x";
        default:
            return "i-lucide-copy";
    }
});

const copyText = computed(() => {
    switch (copyStatus.value) {
        case "success":
            return "已复制";
        case "fail":
            return "复制失败";
        default:
            return "复制";
    }
});

const handleCopy = (text: string) => {
    writeText(text, { showSuccessToast: true, showFailToast: true });
};

const handleListCopy = async (items: string[]) => {
    const textToCopy = items.join("\n");
    const result = await writeText(textToCopy);
    if (result.success) {
        copyStatus.value = "success";
        setTimeout(() => {
            copyStatus.value = "idle";
        }, 2000);
    } else {
        copyStatus.value = "fail";
        setTimeout(() => {
            copyStatus.value = "idle";
        }, 2000);
    }
};
</script>

<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
    >
        <div
            class="flex items-center justify-between border-b border-gray-200 bg-gray-50"
        >
            <h2 class="font-medium text-gray-700 ps-3">{{ title }}</h2>
            <UTooltip :text="items?.length ? '复制该列内容' : '无可复制内容'">
                <UButton
                    :icon="copyIcon"
                    color="neutral"
                    size="md"
                    variant="ghost"
                    @click="handleListCopy(items)"
                    :aria-label="`复制${title}`"
                    class="hover:cursor-pointer"
                    :ui="{
                        base: 'gap-0.5 py-3 px-2.5 ',
                        leadingIcon: 'size-4',
                    }"
                >
                    {{ copyText }}
                </UButton>
            </UTooltip>
        </div>
        <div class="min-h-64 max-h-64 overflow-y-auto">
            <ul class="text-sm divide-y divide-gray-100">
                <li
                    v-for="(item, index) in items"
                    :key="index"
                    class="px-3 py-1.5 hover:bg-gray-50 hover:cursor-pointer truncate"
                    @click="handleCopy(item)"
                >
                    {{ item }}
                </li>
                <li
                    v-if="!items.length"
                    class="px-3 py-4 text-center text-gray-400 text-xs divide-y-0"
                >
                    {{ emptyText }}
                </li>
            </ul>
        </div>
        <div
            class="py-2 px-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500"
        >
            {{ items.length }} 条{{ suffix }}
        </div>
    </div>
</template>
