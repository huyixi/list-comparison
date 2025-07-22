<!-- components/image-import/PreviewItem.vue -->
<script setup lang="ts">
const props = defineProps<{
    img: any;
}>();

const getOcrStatus = (status: string) => {
    if (status === "pending")
        return {
            icon: "i-lucide-loader-circle",
            class: "motion-safe:animate-[spin_2s_linear_infinite] size-3",
            label: "识别中",
        };
    if (status === "success")
        return {
            icon: "i-lucide-check-circle",
            class: "text-green-400 size-3",
            label: "完成",
        };
    if (status === "error")
        return {
            icon: "i-lucide-alert-circle",
            class: "text-red-400 size-3",
            label: "失败",
        };
    return { icon: "", class: "size-3", label: "未识别" };
};

const ocr = computed(() => getOcrStatus(props.img.ocrStatus));
</script>

<template>
    <div>
        <img
            :src="img.croppedBase64 || img.base64"
            alt="preview"
            class="w-full h-full object-cover"
        />

        <!-- OCR 状态 -->
        <div
            class="absolute bottom-0 left-0 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-tr"
        >
            <UIcon v-if="ocr.icon" :name="ocr.icon" :class="ocr.class" />
            <span>{{ ocr.label }}</span>
        </div>
    </div>
</template>
