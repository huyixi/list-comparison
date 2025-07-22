<!-- ./components/image-import/Editor.vue -->
<script setup lang="ts">
import { useImage } from "~/composables/useImage";
import { Cropper } from "vue-advanced-cropper";

const {
    imageItems,
    selectedIndex,
    closeEditor,
    selectedImageSize,
    cropSelectedImage,
} = useImage();

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null);

const getCropperSrc = computed(() => {
    const index = selectedIndex.value;
    if (index === null || index < 0 || index >= imageItems.value.length)
        return "";
    const item = imageItems.value[index];
    return item.croppedBase64 || item.base64;
});

const handleCrop = () => {
    cropSelectedImage(cropperRef);
};

const handleRotate = () => {
    cropperRef?.value?.rotate(90);
};

const coordinates = ref<{
    left: number;
    top: number;
    width: number;
    height: number;
} | null>(null);

watch(selectedImageSize, (size) => {
    if (size) {
        coordinates.value = {
            left: 0,
            top: 0,
            width: size.width,
            height: size.height,
        };
    }
    console.log("coordinates updated", size);
});

const isCropperChange = ref(false);
const lastCoordinates = ref<null | CropperCoordinates>(null);

type CropperCoordinates = {
    left: number;
    top: number;
    width: number;
    height: number;
};

function isEqualCoordinates(
    a: CropperCoordinates | null,
    b: CropperCoordinates | null,
) {
    if (!a || !b) return false;
    return (
        a.left === b.left &&
        a.top === b.top &&
        a.width === b.width &&
        a.height === b.height
    );
}
const handleCropperChange = (event: any) => {
    const current = event?.coordinates;

    if (!current) return;

    if (!lastCoordinates.value) {
        lastCoordinates.value = { ...current };
        return;
    }

    if (!isEqualCoordinates(current, lastCoordinates.value)) {
        isCropperChange.value = true;
    }
};

const handleCropperReset = () => {
    cropperRef.value?.reset();
};
</script>
<template>
    <UModal
        fullscreen
        :ui="{
            body: 'p-0 sm:p-0',
            footer: 'justify-between',
            content:
                'flex flex-col justify-between items-center w-svw h-svh p-8',
        }"
    >
        <template #content>
            <div class="w-full border-none flex justify-center">
                <button
                    class="px-2.5 py-1.5 text-sm gap-1.5 hover:cursor-pointer"
                    @click="handleRotate"
                >
                    <UIcon name="i-lucide-rotate-cw-square" class="size-6" />
                </button>
            </div>
            <div class="h-[80svh] border-none">
                <ClientOnly>
                    <Cropper
                        ref="cropperRef"
                        :src="getCropperSrc"
                        :coordinates="coordinates"
                        :default-size="coordinates"
                        :auto-zoom="true"
                        :stencil-props="{
                            handlersClasses: {
                                north: 'line--handler handler--north',
                                south: 'line--handler handler--south',
                                west: 'line--handler handler--west',
                                east: 'line--handler handler--east',
                                westNorth:
                                    'corner--handler handler--west-north',
                                westSouth:
                                    'corner--handler handler--west-south',
                                eastNorth:
                                    'corner--handler handler--east-north',
                                eastSouth:
                                    'corner--handler handler--east-south',
                            },
                        }"
                        @change="handleCropperChange"
                    />
                </ClientOnly>
            </div>
            <div class="w-full flex justify-between">
                <UTooltip text="取消图片">
                    <UButton
                        size="md"
                        variant="ghost"
                        @click="closeEditor"
                        class="text-black rounded-full"
                        >取消</UButton
                    >
                </UTooltip>
                <UButton
                    size="md"
                    variant="ghost"
                    v-if="isCropperChange"
                    @click="handleCropperReset"
                    class="bg-yellow-300 text-black rounded-full"
                >
                    重置
                </UButton>
                <UTooltip text="确定修改">
                    <UButton
                        size="md"
                        :ui="{
                            base: 'text-white',
                            leadingIcon: 'text-white',
                        }"
                        @click="handleCrop"
                    >
                        确定
                    </UButton>
                </UTooltip>
            </div>
        </template>
    </UModal>
</template>

<style>
.line--handler {
    background-color: black;
    border-radius: 0%;
    position: absolute;
}

.handler--north {
    width: 60px;
    height: 4px;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
}
.handler--south {
    width: 60px;
    height: 4px;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
}
.handler--west {
    width: 4px;
    height: 60px;
    border-radius: 0%;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
}
.handler--east {
    width: 4px;
    height: 60px;
    border-radius: 0%;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.corner--handler {
    width: 30px;
    height: 30px;
    border-left: 4px solid black;
    border-top: 4px solid black;
    box-sizing: border-box;
}
.handler--west-north {
    transform: translate(12px, 12px);
}
.handler--east-north {
    transform: rotate(90deg) translate(12px, 12px);
}
.handler--west-south {
    transform: rotate(270deg) translate(12px, 12px);
}
.handler--east-south {
    transform: rotate(180deg) translate(12px, 12px);
}
</style>
