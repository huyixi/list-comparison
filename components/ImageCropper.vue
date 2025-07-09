<template>
    <cropper-canvas ref="canvasRef" v-if="internalSrc">
        <cropper-image
            ref="imageRef"
            :src="internalSrc"
            rotatable
            scalable
            skewable
            translatable
        />
        <cropper-shade hidden></cropper-shade>
        <cropper-handle action="select" plain></cropper-handle>
        <cropper-selection
            ref="selectionRef"
            id="cropperSelection"
            image
            initial-coverage="0.2"
            movable
            resizable
            limit-boundaries="image"
        >
            <cropper-handle
                action="move"
                theme-color="rgba(255, 255, 255, 0.35)"
            ></cropper-handle>
            <cropper-handle
                action="ne-resize"
                class="cropper-handle"
            ></cropper-handle>
            <cropper-handle
                action="nw-resize"
                class="cropper-handle"
            ></cropper-handle>
            <cropper-handle
                action="se-resize"
                class="cropper-handle"
            ></cropper-handle>
            <cropper-handle
                action="sw-resize"
                class="cropper-handle"
            ></cropper-handle>
        </cropper-selection>
    </cropper-canvas>

    <!-- <cropper-viewer
            selection="#cropperSelection"
            style="width: 1000px; height: 600px; border: 1px solid #ccc"
        /> -->
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string | null;
}>();

const canvasRef = ref<HTMLElement | null>(null);
const selectionRef = ref<CropperSelection | null>(null);
const internalSrc = ref<string | null>(props.src || null);
const imageRef = ref<any>(null);
</script>

<style scoped></style>
