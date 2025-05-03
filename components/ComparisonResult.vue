<template>
    <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
    >
        <div
            class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
        >
            <h2 class="text-base font-medium text-gray-700">{{ title }}</h2>
            <UButton
                :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                color="neutral"
                size="sm"
                variant="ghost"
                @click="handleListCopy(items)"
                :aria-label="`复制${title}`"
                class="hover:cursor-pointer"
                :ui="{
                    base: 'gap-0.5 px-0.5 py-1',
                }"
            >
                {{ copied ? "已复制" : "复制" }}
            </UButton>
        </div>
        <div class="min-h-64 max-h-64 overflow-y-auto">
            <ul class="text-sm">
                <li
                    v-for="(name, index) in items"
                    :key="index"
                    class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:cursor-pointer"
                    @click="handleCopy(name)"
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
const { handleCopy } = useCopy();

const props = defineProps({
    title: String,
    items: Array,
    emptyText: String,
    suffix: String,
});

const copied = ref(false);

const handleListCopy = async (items) => {
    const textToCopy = items.join("\n");
    const result = await handleCopy(textToCopy);
    if (result) {
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }
};
</script>
