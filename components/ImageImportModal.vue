<template>
    <UModal title="图片预览" :ui="{ body: 'p-0 sm:p-0' }">
        <template #body>
            <div class="flex justify-center">
                <ImageCropper :src="props.src" />
            </div>
        </template>
        <template #footer>
            <div class="flex flex-1 justify-end">
                <UButton @click="$emit('update:open', false)">提取文字</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string | null;
}>();
</script>
