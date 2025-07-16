<!-- components/ImagePreviewGrid.vue -->
<template>
    <div
        class="grid gap-0.5 w-full h-full"
        :class="getGridTemplate(imageItems.length)"
    >
        <div
            v-for="(img, i) in imageItems"
            :key="img.file.name || i"
            class="relative group overflow-hidden hover:cursor-pointer"
            :class="{
                'flash-ocr': img.__flashOCR,
            }"
            :style="{
                gridColumn: `span ${imageLayout[i].colSpan} / span ${imageLayout[i].colSpan}`,
                gridRow: `span ${imageLayout[i].rowSpan} / span ${imageLayout[i].rowSpan}`,
            }"
            @click="openPreview(i)"
        >
            <img
                :src="img.croppedBase64 || img.base64"
                alt="preview"
                class="w-full h-full object-cover"
            />

            <div
                class="absolute flex items-center justify-center inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <div class="flex items-center justify-center h-full">
                    <div
                        class="px-6 py-3 hover:bg-white/60 rounded-3xl hover:backdrop-blur h-11"
                    >
                        <UIcon name="i-lucide-eye" class="size-5 text-white" />
                    </div>
                </div>

                <div
                    class="absolute top-0 right-0 p-2"
                    @click.stop="deleteImageAt(i)"
                >
                    <button
                        class="hover:bg-red-600 hover:cursor-pointer rounded-md text-white p-2 transition w-8 h-8 flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-trash" class="size-5" />
                    </button>
                </div>
            </div>
            <div
                class="absolute bottom-0 left-0 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-tr"
            >
                <UIcon
                    v-if="img.ocrStatus === 'pending'"
                    name="i-lucide-loader"
                    class="animate-spin size-3"
                />
                <UIcon
                    v-else-if="img.ocrStatus === 'success'"
                    name="i-lucide-check-circle"
                    class="text-green-400 size-3"
                />
                <UIcon
                    v-else-if="img.ocrStatus === 'error'"
                    name="i-lucide-alert-circle"
                    class="text-red-400 size-3"
                />
                <span>
                    {{
                        img.ocrStatus === "pending"
                            ? "识别中"
                            : img.ocrStatus === "success"
                              ? "完成"
                              : img.ocrStatus === "error"
                                ? "失败"
                                : "未识别"
                    }}
                </span>
            </div>
        </div>

        <ImagePreview v-model:open="previewOpen" @close="closePreview" />
    </div>
</template>

<script setup lang="ts">
import { useImage } from "~/composables/useImage";
const { imageItems, previewOpen, openPreview, closePreview, deleteImageAt } =
    useImage();

const getGridTemplate = (count: number) => {
    if (count <= 1) return "grid-cols-1 grid-rows-1";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
};

type GridLayoutItem = {
    colSpan: number;
    rowSpan: number;
};

const layoutMap: Record<number, GridLayoutItem[]> = {
    1: [{ colSpan: 1, rowSpan: 1 }],
    2: [
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 2 },
    ],
    3: [
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    4: [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    5: [
        { colSpan: 2, rowSpan: 2 },
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    6: [
        { colSpan: 2, rowSpan: 2 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    7: [
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    8: [
        { colSpan: 1, rowSpan: 2 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
    9: [
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
        { colSpan: 1, rowSpan: 1 },
    ],
};

const imageLayout = computed(() => {
    return layoutMap[imageItems.value.length] || layoutMap[9];
});

const flashIndex = ref<number | null>(null);

function triggerFlash(index: number) {
    flashIndex.value = index;
    setTimeout(() => {
        flashIndex.value = null;
    }, 1000); // 动画持续时间后清除
}
</script>
