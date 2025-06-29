<template>
    <UModal
        title="图片预览"
        :ui="{
            body: 'overflow-auto max-h-[80vh] p-4',
        }"
    >
        <template #body>
            <img ref="imageRef" :src="src" v-if="src" @load="onImageLoad" />
            <img :src="src" v-if="src" />
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
        cropperInstance = new Cropper(imageRef.value, {
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            background: false,
        });
    }
};
</script>
