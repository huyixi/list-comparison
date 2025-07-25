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
</script>
<template>
    <UModal
        fullscreen
        :ui="{
            body: 'p-0 sm:p-0',
            footer: 'justify-between',
            content: 'flex flex-col items-center w-svw h-svh p-4',
        }"
    >
        <template #content>
            <div class="flex-1 flex flex-col items-center w-full border-none">
                <div
                    class="flex items-center w-full max-w-[600px]"
                    :class="containerClass"
                >
                    <div class="flex-1">
                        <UTooltip text="取消图片">
                            <UButton
                                size="md"
                                variant="ghost"
                                @click="closeEditor"
                                class="text-black text-md font-normal"
                            >
                                取消
                            </UButton>
                        </UTooltip>
                    </div>

                    <div>
                        <UButton
                            size="md"
                            variant="ghost"
                            @click="handleCropperReset"
                            class="text-black text-md font-normal"
                        >
                            重置
                        </UButton>
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
                        <UTooltip text="确定修改">
                            <UButton size="md" @click="handleCrop" class="ms-2">
                                确定
                            </UButton>
                        </UTooltip>
                    </div>
                </div>
                <div
                    class="h-[86svh] w-[80vw] p-4 border-none flex justify-center items-center"
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
