<!-- components/image-import/PreviewItem.vue -->
<script setup lang="ts">
const { imageItems, deleteImageAt, openEditor, closeEditor } = useImage();

const props = defineProps<{
    img: any;
    index: number;
}>();

const getOcrIcon = (status: string) => {
    if (status === "pending")
        return {
            icon: "i-lucide-loader",
            class: "animate-spin size-3",
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

const ocr = computed(() => getOcrIcon(props.img.ocrStatus));
</script>

<template>
    <div
        class="relative overflow-hidden group hover:cursor-pointer"
        @click="openEditor(index)"
    >
        <img
            :src="img.croppedBase64 || img.base64"
            alt="preview"
            class="w-full h-full object-cover"
        />

        <!-- 删除按钮 -->
        <div
            class="absolute top-0 right-0 p-2"
            @click.stop="deleteImageAt(index)"
        >
            <button
                class="hover:cursor-pointer rounded-full overflow-hidden bg-slate-100/80 w-10 h-10 flex items-center justify-center md:hidden md:group-hover:flex"
            >
                <UIcon :name="'i-lucide-trash'" class="size-6 text-black-500" />
            </button>
        </div>

        <!-- OCR 状态 -->
        <div
            class="absolute bottom-0 left-0 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-tr"
        >
            <UIcon v-if="ocr.icon" :name="ocr.icon" :class="ocr.class" />
            <span>{{ ocr.label }}</span>
        </div>
    </div>
</template>
