<template>
    <UModal title="图片预览">
        <template #body>
            <img ref="imageRef" v-if="src" :src="src" @load="onImageLoad" />
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

const imageRef = ref<HTMLImageElement | null>(null);
const Cropper = useCropper();

let cropperInstance: InstanceType<typeof Cropper> | null = null;

const onImageLoad = () => {
    if (imageRef.value && Cropper) {
        cropperInstance = new Cropper(imageRef.value);
    }
};
</script>
