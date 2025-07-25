<script setup lang="ts">
const clipboard = useClipboard();

const handleCopy = (text: string) => {
    clipboard.writeText(text);
};

import type { DuplicateItem } from "@/types";

const props = defineProps({
    title: String,
    count: {
        type: Number,
        required: true,
    },
    items: {
        type: Array as PropType<string[] | DuplicateItem[]>,
        required: true,
    },
    status: {
        type: String as PropType<"red" | "yellow" | "green">,
        default: "green",
        validator: (value: string) =>
            ["red", "yellow", "green"].includes(value),
    },
    showClean: Boolean,
    showCopy: Boolean,
    displayFormatter: {
        type: Function,
        default: (item: string | DuplicateItem) => item,
    },
    copied: Boolean,
});

const colors: Record<"red" | "yellow" | "green", string> = {
    red: "#FF5F56",
    yellow: "#FFBD2E",
    green: "#27C93F",
};

const getStatusColor = (status: "red" | "yellow" | "green"): string => {
    return colors[status];
};

const statusColor = computed(() => getStatusColor(props.status));

defineEmits(["clean", "copy"]);

const getItemLabel = (item: string | DuplicateItem): string => {
    return typeof item === "string" ? item : item.label;
};
</script>

<template>
    <UPopover v-if="count > 0" :ui="{ content: 'overflow-hidden' }">
        <p class="flex items-center hover:cursor-pointer">
            <span
                class="w-2 h-2 rounded-full mr-1"
                :style="{ backgroundColor: statusColor }"
            ></span>
            <span class="text-gray-700">{{ count }}</span>
        </p>

        <template #content>
            <div class="flex flex-col max-h-72 text-xs w-40">
                <div
                    class="sticky top-0 z-10 p-1.5 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                >
                    <p class="font-medium">
                        <span class="font-semibold" :class="statusColor">{{
                            count
                        }}</span>
                        {{ title }}
                    </p>
                    <UButton
                        v-if="showCopy"
                        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        class="hover:cursor-pointer p-1"
                        @click="$emit('copy')"
                    >
                        复制
                    </UButton>
                    <UButton
                        v-if="showClean"
                        icon="i-heroicons-trash"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        class="hover:cursor-pointer p-1"
                        @click="$emit('clean')"
                    >
                        清除
                    </UButton>
                </div>
                <ul class="overflow-y-auto">
                    <li
                        v-for="(item, index) in items"
                        :key="index"
                        class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:cursor-pointer truncate"
                        @click="handleCopy(getItemLabel(item))"
                    >
                        {{ displayFormatter(item) }}
                    </li>
                </ul>
            </div>
        </template>
    </UPopover>
</template>
