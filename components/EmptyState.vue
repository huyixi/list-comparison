<template>
    <div
        class="bg-white px-8 py-16 rounded-lg shadow-sm border border-gray-200 text-center"
    >
        <div class="flex flex-col items-center justify-center">
            <div
                class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
            >
                <UIcon :name="icon" class="text-gray-400 w-8 h-8" />
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">
                {{ title }}
            </h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
                {{ description }}
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    icon: {
        type: String,
        default: "i-heroicons-document-duplicate",
    },
    title: {
        type: String,
        default: "尚未生成比对结果",
    },
    description: {
        type: String,
        default: "在上方区域输入或上传名单以查看它们之间的差异和相同之处。",
    },
});
</script>
