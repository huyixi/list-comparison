<template>
    <UModal
        title="图片预览"
        :ui="{
            content: 'max-w-full',
            body: 'max-w-full',
            wrapper: 'max-w-full',
        }"
    >
        <template #body>
            <ImageCropper :src="props.src" />
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
