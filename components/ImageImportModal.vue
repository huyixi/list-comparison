<template>
    <UModal title="图片预览">
        <template #body>
            <img
                v-if="src"
                :src="src"
                class="max-w-full max-h-[60vh] mx-auto"
            />
            <p v-else class="text-center text-gray-500">无图片内容</p>
        </template>
        <template #footer>
            <div class="flex flex-1 justify-end">
                <UButton @click="$emit('update:open', false)">提取文字</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
defineProps<{
    src: string | null;
}>();
</script>
