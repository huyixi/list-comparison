<template>
    <div
        class="grid gap-0.5 w-full h-full"
        :class="getGridTemplate(imageFiles.length)"
    >
        <div
            v-for="(img, i) in imageFiles"
            :key="i"
            class="relative group overflow-hidden hover:cursor-pointer"
            :style="{
                gridColumn: `span ${imageLayout[i].colSpan} / span ${imageLayout[i].colSpan}`,
                gridRow: `span ${imageLayout[i].rowSpan} / span ${imageLayout[i].rowSpan}`,
            }"
            @click="openPreview(i)"
        >
            <img
                :src="urls[i]"
                alt="preview"
                class="w-full h-full object-cover"
            />
            <div
                class="absolute flex items-center justify-center inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <UIcon name="i-lucide-eye" class="size-5 text-white" />
            </div>

            <ImagePreview
                v-model:open="previewOpen"
                :selectedImageUrl="urls[i]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ imageFiles: File[] }>();

const previewOpen = ref(false);
const selectedImageUrl = ref("");

const getUrl = (file: File) => URL.createObjectURL(file);
const urls = computed(() => {
    return props.imageFiles.map(getUrl);
});
onUnmounted(() => {
    props.imageFiles.forEach((f) => URL.revokeObjectURL(getUrl(f)));
});

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
    return layoutMap[props.imageFiles.length] || layoutMap[9];
});

const openPreview = (index: number) => {
    console.log("Open preview for image at index:", index);

    selectedImageUrl.value = getUrl(props.imageFiles[index]);

    previewOpen.value = true;

    // Open the image preview modal with the selected image
};
</script>
