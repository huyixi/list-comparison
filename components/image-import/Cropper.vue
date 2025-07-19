<!-- ./components/image-import/Editor.vue -->
<template>
    <ClientOnly>
        <Cropper
            ref="cropperRef"
            class="object-contain"
            :src="getCropperSrc"
            :default-size="defaultSize"
            :stencil-props="{
                handlers: {},
            }"
        />
    </ClientOnly>
    <div class="flex justify-between mt-4">
        <UButton size="md" variant="outline" @click="closeEditor">取消</UButton>
        <UTooltip text="裁切图片">
            <UButton
                size="md"
                :ui="{
                    base: 'text-white',
                    leadingIcon: 'text-white',
                }"
                @click="handleCrop"
            >
                确定
            </UButton>
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
import { useImage } from "~/composables/useImage";
const { imageItems, selectedIndex, closeEditor, cropSelectedImage } =
    useImage();

import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);

const getCropperSrc = computed(() => {
    const index = selectedIndex.value;
    if (index === null || index < 0 || index >= imageItems.value.length)
        return "";
    const item = imageItems.value[index];
    return item.croppedBase64 || item.base64;
});

const defaultSize = () => {
    return {
        width: 300,
        height: 300,
    };
};

const handleCrop = () => {
    cropSelectedImage(cropperRef);
    closeEditor();
};
</script>
