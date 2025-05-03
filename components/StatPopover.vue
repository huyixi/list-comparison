<template>
    <UPopover v-if="count > 0">
        <p class="flex items-center hover:cursor-pointer">
            <span
                class="w-2 h-2 rounded-full mr-1"
                :style="{ backgroundColor: statusColor }"
            ></span>
            <span class="text-gray-700">{{ count }}</span>
        </p>

        <template #content>
            <div
                class="max-w-sm max-h-72 overflow-y-auto text-xs w-48 overflow-x-hidden"
            >
                <div
                    class="gap-4 p-2 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                >
                    <p class="font-medium">
                        <span
                            :style="{ color: statusColor }"
                            class="font-semibold"
                            >{{ count }}</span
                        >
                        {{ title }}
                    </p>
                    <UButton
                        v-if="showClean"
                        icon="i-heroicons-trash"
                        size="2xs"
                        color="neutral"
                        variant="ghost"
                        class="hover:cursor-pointer p-1"
                        @click="$emit('clean')"
                    >
                        清除
                    </UButton>
                </div>

                <ul class="space-y-0.5">
                    <li
                        v-for="(item, index) in items"
                        :key="index"
                        class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 hover:cursor-pointer"
                        @click="handleCopy(item.name || item)"
                    >
                        <span
                            class="w-2 h-2 rounded-full mr-1 inline-block"
                            :style="{ backgroundColor: statusColor }"
                        ></span>
                        <span>{{ displayFormatter(item) }}</span>
                    </li>
                </ul>
            </div>
        </template>
    </UPopover>
</template>

<script setup>
const { handleCopy } = useCopy();

const props = defineProps({
    title: String,
    count: Number,
    items: Array,
    status: {
        type: String,
        default: "green",
        validator: (value) => ["red", "yellow", "green"].includes(value),
    },
    showClean: Boolean,
    displayFormatter: {
        type: Function,
        default: (item) => item,
    },
});

const statusColor = computed(() => {
    const colors = {
        red: "#FF5F56",
        yellow: "#FFBD2E",
        green: "#27C93F",
    };
    return colors[props.status] || colors.green;
});

defineEmits(["clean"]);
</script>
