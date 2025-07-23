<!-- components/image-import/PreviewGrid.vue -->
<script setup lang="ts">
import { useImage } from "~/composables/useImage";

const { imageItems, openEditor, deleteImageAt } = useImage();

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
    <div class="grid gap-0.5 w-full h-full" :class="gridTemplate">
        <div
            v-for="(img, i) in imageItems"
            :key="`${i}-${img.file.name}`"
            class="aspect-square w-full h-full relative overflow-hidden group hover:cursor-pointer"
            :class="
                layoutList[i] &&
                `col-span-${layoutList[i].colSpan} row-span-${layoutList[i].rowSpan}`
            "
        >
            <ImageImportPreviewItem :img="img" @click="openEditor(i)" />

            <!-- Delete Button -->
            <div
                class="absolute top-0 right-0 p-2"
                @click.stop="deleteImageAt(i)"
            >
                <button
                    class="hover:cursor-pointer rounded-full overflow-hidden bg-slate-100/80 w-10 h-10 flex items-center justify-center sm:hidden sm:group-hover:flex"
                >
                    <UIcon
                        name="i-lucide-trash"
                        class="size-6 text-black-500"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
