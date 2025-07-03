<template>
    <UModal
        title="图片预览"
        :ui="{ body: 'p-0 sm:p-0 h-[60dvh] aspect-square' }"
    >
        <template #body>
            <!-- <ImageCropper :src="props.src" /> -->
            <ImagePreviewGrid :imageFiles="props.imageFiles" />
        </template>
        <template #footer>
            <div class="flex flex-1 justify-end gap-2">
                <UTooltip text="添加更多图片">
                    <UButton
                        v-if="imageCount < 9"
                        icon="i-lucide-plus"
                        size="sm"
                        variant="outline"
                        @click="handleAddImage"
                    ></UButton>
                </UTooltip>
                <UTooltip text="识别图片中的文字并导入">
                    <UButton
                        icon="i-custom-scan-text"
                        size="sm"
                        :ui="{
                            leadingIcon: 'text-white',
                        }"
                    >
                        文字识别
                    </UButton>
                </UTooltip>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    imageFiles: File[];
}>();

const emit = defineEmits(["add-image"]);

const handleAddImage = () => {
    emit("add-image");
};

const imageCount = computed(() => props.imageFiles.length);
</script>
