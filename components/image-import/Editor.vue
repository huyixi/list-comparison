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
});

const handleCropperReset = () => {
    cropperRef.value?.reset();
};

const containerClass = computed(() => {
    const width = coordinates.value?.width;
    if (width && width > 0) {
        return `sm:w-[${width}px]`;
    }
    return "";
});

const handleFlip = () => {
    cropperRef.value?.flip(true);
};

type CropperResult = {
    coordinates: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    imageTransforms: {
        flip: {
            horizontal: boolean;
            vertical: boolean;
        };
        rotate: number;
    };
    visibleArea: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
};

const isImageChange = ref(false);

const initImage = ref<CropperResult>({
    coordinates: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    },
    imageTransforms: {
        flip: {
            horizontal: false,
            vertical: false,
        },
        rotate: 0,
    },
    visibleArea: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    },
});

const handleCropperReady = () => {
    const result = cropperRef.value?.getResult?.();
    if (result) {
        Object.assign(initImage, result);
    }
    isImageChange.value = false;
};

const handleCropperChange = (result: CropperResult) => {
    isImageChange.value = !compareInitImage(result);
};

function isApproxEqual(a: number, b: number, tolerance = 1): boolean {
    return Math.abs(a - b) <= tolerance;
}

const compareInitImage = (current: CropperResult): boolean => {
    const init = toRaw(initImage);

    const coordsEqual =
        isApproxEqual(current.coordinates.left, init.coordinates.left) &&
        isApproxEqual(current.coordinates.top, init.coordinates.top) &&
        isApproxEqual(current.coordinates.width, init.coordinates.width) &&
        isApproxEqual(current.coordinates.height, init.coordinates.height);

    const visibleEqual =
        isApproxEqual(current.visibleArea.left, init.visibleArea.left) &&
        isApproxEqual(current.visibleArea.top, init.visibleArea.top) &&
        isApproxEqual(current.visibleArea.width, init.visibleArea.width) &&
        isApproxEqual(current.visibleArea.height, init.visibleArea.height);

    const transformEqual =
        current.imageTransforms.rotate === init.imageTransforms.rotate &&
        current.imageTransforms.flip.horizontal ===
            init.imageTransforms.flip.horizontal &&
        current.imageTransforms.flip.vertical ===
            init.imageTransforms.flip.vertical;

    return coordsEqual && visibleEqual && transformEqual;
};
</script>
<template>
    <UModal
        fullscreen
        :ui="{
            body: 'p-0 sm:p-0 bg-white',
            footer: 'justify-between',
            content: 'flex flex-col items-center w-svw h-dvh p-4 bg-white',
        }"
    >
        <template #content>
            <div
                class="flex-1 flex flex-col items-center w-full h-dvh border-none"
            >
                <div
                    class="flex items-center w-full max-w-[600px]"
                    :class="containerClass"
                >
                    <div class="flex-1">
                        <UButton
                            size="md"
                            variant="ghost"
                            @click="closeEditor"
                            class="text-black text-md font-normal"
                        >
                            取消
                        </UButton>
                    </div>

                    <div>
                        <UButton
                            size="md"
                            variant="ghost"
                            @click="handleCropperReset"
                            class="text-black text-md font-normal"
                            :class="{ 'opacity-0': !isImageChange }"
                        >
                            重置
                        </UButton>
                        <!-- <UButton
                            size="md"
                            variant="ghost"
                            @click="getResult"
                            class="text-black text-md font-normal"
                        >
                            Get Result
                        </UButton> -->
                    </div>

                    <div class="flex-1 flex justify-end">
                        <UTooltip text="水平翻转">
                            <UButton
                                size="md"
                                icon="i-lucide-flip-horizontal"
                                variant="ghost"
                                @click="handleFlip"
                                :ui="{
                                    base: 'flex items-center justify-center',
                                    leadingIcon: 'size-5 text-black',
                                }"
                            >
                            </UButton>
                        </UTooltip>
                        <UTooltip text="顺时针旋转">
                            <UButton
                                size="md"
                                icon="i-lucide-rotate-cw-square"
                                variant="ghost"
                                @click="handleRotate"
                                :ui="{
                                    base: 'flex items-center justify-center',
                                    leadingIcon: 'size-[22px] text-black',
                                }"
                            >
                            </UButton>
                        </UTooltip>
                        <UButton size="md" @click="handleCrop" class="ms-2">
                            确定
                        </UButton>
                    </div>
                </div>
                <div
                    class="h-[86svh] w-[80vw] p-4 mt-4 border-none flex justify-center items-center"
                >
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
                            @ready="handleCropperReady"
                            @change="handleCropperChange"
                        />
                    </ClientOnly>
                </div>
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
    width: 68px;
    height: 4px;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
}
.handler--south {
    width: 68px;
    height: 4px;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
}
.handler--west {
    width: 4px;
    height: 68px;
    border-radius: 0%;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
}
.handler--east {
    width: 4px;
    height: 68px;
    border-radius: 0%;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
}

.corner--handler {
    width: 44px;
    height: 44px;
    box-sizing: border-box;
    position: absolute;
}

/* 左上 */
.handler--west-north {
    top: 0;
    left: 0;
    border-left: 4px solid black;
    border-top: 4px solid black;
    transform: translate(12px, 12px);
}

/* 右上 */
.handler--east-north {
    top: 0;
    right: 0;
    border-right: 4px solid black;
    border-top: 4px solid black;
    transform: translate(-12px, 12px);
}

/* 左下 */
.handler--west-south {
    bottom: 0;
    left: 0;
    border-left: 4px solid black;
    border-bottom: 4px solid black;
    transform: translate(12px, -12px);
}

/* 右下 */
.handler--east-south {
    bottom: 0;
    right: 0;
    border-right: 4px solid black;
    border-bottom: 4px solid black;
    transform: translate(-12px, -12px);
}
</style>
