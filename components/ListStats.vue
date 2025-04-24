<template>
    <UPopover v-if="count > 0">
        <p class="flex items-center hover:cursor-pointer">
            <span :class="['w-2 h-2 rounded-full mr-1', dotColor]"></span>
            <span class="text-gray-700">{{ count }}</span>
        </p>

        <template #content>
            <div class="max-w-sm max-h-72 overflow-y-auto text-xs">
                <div
                    class="p-2 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                >
                    <p class="font-medium">
                        <span :class="textColor" class="font-semibold">{{
                            count
                        }}</span>
                        {{ title }}
                    </p>
                    <UButton
                        v-if="showClean"
                        icon="ph:broom-fill"
                        size="2xs"
                        color="neutral"
                        variant="link"
                        @click="$emit('clean')"
                    >
                        移除
                    </UButton>
                </div>

                <ul class="space-y-0.5">
                    <li
                        v-for="(item, index) in items"
                        :key="index"
                        class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                        <span
                            :class="[
                                'w-2 h-2 rounded-full mr-1 inline-block',
                                dotColor,
                            ]"
                        ></span>
                        <span>{{ displayFormatter(item) }}</span>
                    </li>
                </ul>
            </div>
        </template>
    </UPopover>
</template>

<script setup>
defineProps({
    title: String,
    count: Number,
    items: Array,
    dotColor: String,
    textColor: String,
    showClean: Boolean,
    displayFormatter: {
        type: Function,
        default: (item) => item,
    },
});

defineEmits(["clean"]);
</script>
