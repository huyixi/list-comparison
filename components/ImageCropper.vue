<template>
    <div class="flex gap-4">
        <cropper-canvas
            ref="canvasRef"
            background
            v-if="internalSrc"
            style="width: 100%; height: 600px"
        >
            <cropper-image
                :src="internalSrc"
                ref="imageRef"
                scalable
                translatable
                rotatable
            />
            <cropper-shade hidden></cropper-shade>
            <cropper-handle action="select" plain></cropper-handle>
            <cropper-selection
                ref="selectionRef"
                id="cropperSelection"
                previewable
                initial-coverage="0.5"
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

        <cropper-viewer
            selection="#cropperSelection"
            style="width: 1000px; height: 600px; border: 1px solid #ccc"
        />

        <button @click="downloadCroppedImage" class="btn">导出</button>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    src: string | null;
}>();

const canvasRef = ref<HTMLElement | null>(null);
const selectionRef = ref<CropperSelection | null>(null);
const internalSrc = ref<string | null>(props.src || null);
const imageRef = ref<any>(null);

onMounted(() => {
    console.log("mounted", internalSrc.value);
});

const exportCropped = async () => {
    console.log("exportCropped");
    await nextTick();

    const selection = canvasRef.value?.querySelector(
        "cropper-selection",
    ) as any;
    const canvas = selection?.preview?.(); // HTMLCanvasElement

    if (canvas instanceof HTMLCanvasElement) {
        const base64Data = canvas.toDataURL("image/png");
        previewUrl.value = base64Data; // 用来显示预览或上传
    }
};

const downloadCroppedImage = async () => {
    const canvas = await selectionRef.value?.$toCanvas();
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
</script>
