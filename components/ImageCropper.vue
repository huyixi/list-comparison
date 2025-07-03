<template>
    <cropper-canvas
        ref="canvasRef"
        v-if="internalSrc"
        class="h-[50dvh] w-[29dvw]"
        background
    >
        <cropper-image ref="imageRef" :src="internalSrc" translatable />
        <cropper-shade hidden></cropper-shade>
        <cropper-handle action="select" plain></cropper-handle>
        <cropper-selection
            ref="selectionRef"
            id="cropperSelection"
            image
            initial-coverage="0.6"
            movable
            resizable
        >
            <cropper-grid role="grid" covered></cropper-grid>
            <cropper-crosshair centered></cropper-crosshair>
            <cropper-handle
                action="move"
                theme-color="rgba(255, 255, 255, 0.35)"
            ></cropper-handle>
            <cropper-handle action="n-resize"></cropper-handle>
            <cropper-handle action="e-resize"></cropper-handle>
            <cropper-handle action="s-resize"></cropper-handle>
            <cropper-handle action="w-resize"></cropper-handle>
            <cropper-handle action="ne-resize"></cropper-handle>
            <cropper-handle action="nw-resize"></cropper-handle>
            <cropper-handle action="se-resize"></cropper-handle>
            <cropper-handle action="sw-resize"></cropper-handle>
        </cropper-selection>
    </cropper-canvas>

    <!-- <cropper-viewer
            selection="#cropperSelection"
            style="width: 1000px; height: 600px; border: 1px solid #ccc"
        /> -->

    <!-- <button @click="downloadCroppedImage" class="btn">导出</button> -->
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string | null;
}>();

const canvasRef = ref<HTMLElement | null>(null);
const selectionRef = ref<CropperSelection | null>(null);
const internalSrc = ref<string | null>(props.src || null);
const imageRef = ref<any>(null);

const downloadCroppedImage = async () => {
    const canvas = await selectionRef.value?.$toCanvas();
    console.log("canvas", canvas);

    const link = document.createElement("a");
    link.href = canvas?.toDataURL("image/png");
    link.download = "cropped-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (canvas instanceof HTMLCanvasElement) {
        console.log("canvas2", canvas);
    }
};

onMounted(() => {
    imageRef.value?.$ready(() => {
        onImageReady();
    });
});

const onImageReady = () => {
    imageRef.value?.fit?.({ position: "top center" });

    requestAnimationFrame(() => {
        const imageEl = imageRef.value;
        const canvasEl = canvasRef.value;

        if (!imageEl || !canvasEl) return;

        const imageWidth = imageEl.getBoundingClientRect().width;
        if (imageWidth > 0) {
            canvasEl.style.width = `${imageWidth}px`;
            canvasEl.classList.remove("w-full");
        }
    });
};
</script>
