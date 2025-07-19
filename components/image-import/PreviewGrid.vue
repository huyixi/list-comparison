<!-- components/image-import/ImagePreviewGrid.vue -->
<script setup lang="ts">
import { useImage } from "~/composables/useImage";

const { imageItems, editorOpen } = useImage();

const gridTemplate = computed(() => {
    const count = imageItems.value.length;
    if (count <= 1) return "grid-cols-1 grid-rows-1";
    if (count <= 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-3 grid-rows-3";
});

const layoutList = computed(() =>
    imageItems.value.map((_, i) => getImageLayout(i, imageItems.value.length)),
);
</script>

<template>
    <div class="grid gap-1 w-full h-full" :class="gridTemplate">
        <ImageImportPreviewItem
            v-for="(img, i) in imageItems"
            :key="`${i}-${img.file.name}`"
            :img="img"
            :index="i"
            :layout="layoutList[i]"
        />
    </div>

    <ImageImportEditor v-model:open="editorOpen" />
</template>
