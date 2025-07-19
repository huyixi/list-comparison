<!-- components/image-import/PreviewGrid.vue -->
<template>
    <div
        class="grid gap-1 w-full h-full"
        :class="getGridTemplate(imageItems.length)"
    >
        <div
            v-for="(img, i) in imageItems"
            :key="img.file.name || i"
            class="relative overflow-hidden group hover:cursor-pointer"
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
                class="absolute top-0 right-0 p-2"
                @click.stop="deleteImageAt(i)"
            >
                <button
                    class="hover:cursor-pointer rounded-full overflow-hidden bg-slate-100/80 w-10 h-10 flex items-center justify-center md:hidden"
                >
                    <UIcon
                        name="i-lucide-trash"
                        class="size-6 text-black-500"
                    />
                </button>
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

        <ImageImportPreview v-model:open="previewOpen" @close="closePreview" />
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
</script>
