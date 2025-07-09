<template>
    <UModal
        :ui="{
            content:
                'bg-elevated/75 rounded-none border-none shadow-none ring-0',
        }"
    >
        <template #content>
            <!-- <img
                :src="props.selectedImageUrl"
                alt="preview"
                class="max-w-[20svh] max-h-[20svh] object-contain"
            /> -->
            <!-- <ImageCropper
                :src="props.selectedImageUrl"
                class="w-[50svh] h-[50svh] object-contain"
            /> -->
            <!-- <ImageCropperJS
                :src="props.selectedImageUrl"
                class="w-[50svh] h-[50svh] object-contain"
            /> -->

            <!-- <img id="image" :src="props.selectedImageUrl" alt="Picture" /> -->
            <!-- <ClientOnly>
                <ImageEditor :src="props.selectedImageUrl"></ImageEditor>
            </ClientOnly> -->
            <ClientOnly>
                <ImageEditor
                    v-if="props.selectedImageUrl"
                    :src="props.selectedImageUrl"
                    @update:cropped="onCropped"
                    @close="selectedImageUrl = null"
                />
            </ClientOnly>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
    selectedImageUrl: {
        type: String,
        required: true,
    },
});

const imageEl = ref<HTMLImageElement | null>(null);
let cropper: Cropper | null = null;

const onCropped = (base64) => {
    console.log("裁剪后的图像:", base64);
};
</script>
