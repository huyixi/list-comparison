<script setup>
import { ref, watch } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["update:cropped", "close"]);

const cropper = ref();
const cropImg = ref("");
const imageSrc = ref(props.src);

watch(
    () => props.src,
    (val) => {
        imageSrc.value = val;
        if (val && cropper.value) {
            cropper.value.replace(val);
        }
    },
);

const cropImage = () => {
    const canvas = cropper.value.getCroppedCanvas();
    if (canvas) {
        cropImg.value = canvas.toDataURL();
        emit("update:cropped", cropImg.value); // 把裁剪后的 base64 图像抛出
    }
};

const reset = () => {
    cropper.value?.reset();
};

const rotate = (deg) => {
    cropper.value?.rotate(deg);
};
</script>

<template>
    <div class="image-editor">
        <vue-cropper
            ref="cropper"
            :src="imageSrc"
            :background="false"
            :viewMode="1"
            preview=".preview"
            :guides="true"
        />

        <div class="actions">
            <button @click="rotate(90)">Rotate +90°</button>
            <button @click="rotate(-90)">Rotate -90°</button>
            <button @click="reset">Reset</button>
            <button @click="cropImage">Crop</button>
            <button @click="$emit('close')">Close</button>
        </div>

        <div v-if="cropImg" class="mt-4">
            <p>Cropped Image:</p>
            <img :src="cropImg" class="w-full" />
        </div>
    </div>
</template>

<style scoped>
.image-editor {
    max-width: 800px;
    margin: auto;
}
.actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}
.actions button {
    padding: 0.4rem 0.75rem;
    background-color: #0062cc;
    color: white;
    border: none;
    border-radius: 4px;
}
</style>
