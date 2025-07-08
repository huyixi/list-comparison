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
                <div class="flex items-center justify-center h-full">
                    <div
                        class="px-6 py-3 hover:bg-white/60 rounded-3xl hover:backdrop-blur h-11"
                    >
                        <UIcon name="i-lucide-eye" class="size-5 text-white" />
                    </div>
                </div>

                <div
                    class="absolute top-0 right-0 p-2"
                    @click.stop="handleDelete(i)"
                >
                    <button
                        class="hover:bg-red-600 hover:cursor-pointer rounded-md text-white p-2 transition w-8 h-8 flex items-center justify-center"
                    >
                        <UIcon name="i-lucide-trash" class="size-5" />
                    </button>
                </div>
            </div>

            <ImagePreview
                v-model:open="previewOpen"
                :selectedImageUrl="selectedImageUrl"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ imageFiles: File[] }>();
const emit = defineEmits(["delete-image"]);

const previewOpen = ref(false);
const selectedImageUrl = ref("");

const getUrl = (file: File) => URL.createObjectURL(file);
const urls = computed(() => {
    return props.imageFiles.map(getUrl);
});
onUnmounted(() => {
    props.imageFiles.forEach((f) => URL.revokeObjectURL(getUrl(f)));
});

const handleDelete = (index: number) => {
    console.log("delete image grid preview", index);
    emit("delete-image", index);
};

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
