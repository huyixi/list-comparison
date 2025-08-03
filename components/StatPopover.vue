<script setup lang="ts">
import type { DuplicateItem, CopyStatus } from "@/types";

const { writeText } = useClipboard();

const handleCopy = (text: string) => {
    writeText(text, { showSuccessToast: true, showFailToast: true });
};

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
    copyStatus: {
        type: String as PropType<CopyStatus>,
        required: false,
        validator: (value: string) =>
            ["idle", "success", "fail"].includes(value),
    },
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

const copyIcon = computed(() => {
    switch (props.copyStatus) {
        case "success":
            return "i-lucide-check";
        case "fail":
            return "i-lucide-x";
        default:
            return "i-lucide-copy";
    }
});

const copyText = computed(() => {
    switch (props.copyStatus) {
        case "success":
            return "已复制";
        case "fail":
            return "复制失败";
        default:
            return "复制";
    }
});
</script>

<template>
    <UPopover v-if="count > 0" :ui="{ content: 'overflow-hidden' }">
        <p class="flex items-center hover:cursor-pointer p-1 py-2">
            <span
                class="w-2 h-2 rounded-full mr-1"
                :style="{ backgroundColor: statusColor }"
            ></span>
            <span class="text-gray-700">{{ count }}</span>
        </p>

        <template #content>
            <div class="flex flex-col max-h-72 text-xs w-40">
                <div
                    class="sticky top-0 z-10 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                >
                    <p class="font-medium p-2">
                        <span class="font-semibold" :class="statusColor">{{
                            count
                        }}</span>
                        {{ title }}
                    </p>
                    <UButton
                        v-if="showCopy"
                        :icon="copyIcon"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        class="hover:cursor-pointer gap-0.5 flex-1 justify-end py-2 -my-2"
                        @click="$emit('copy')"
                    >
                        {{ copyText }}
                    </UButton>
                    <UButton
                        v-if="showClean"
                        icon="i-heroicons-trash"
                        size="xs"
                        color="neutral"
                        variant="ghost"
                        class="hover:cursor-pointer gap-0.5 flex-1 justify-end py-2 -my-2"
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
