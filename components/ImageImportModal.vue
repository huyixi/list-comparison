<template>
    <UModal
        title="图片预览"
        :ui="{ body: 'p-0 sm:p-0 h-[60dvh] aspect-square' }"
    >
        <template #body>
            <!-- <ImageCropper :src="props.src" /> -->
            <ImagePreviewGrid
                :imageFiles="props.imageFiles"
                @delete-image="handleDeleteImage"
            />
        </template>
        <template #footer>
            <div class="flex flex-1 justify-end gap-3">
                <UTooltip text="添加更多图片">
                    <UButton
                        v-if="imageCount < 9"
                        icon="i-lucide-plus"
                        size="md"
                        variant="outline"
                        @click="handleAddImage"
                    ></UButton>
                </UTooltip>
                <UTooltip text="识别图片中的文字并导入">
                    <UButton
                        icon="i-lucide-scan-text"
                        size="md"
                        :ui="{
                            base: 'text-white',
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

const emit = defineEmits(["add-image", "delete-image"]);

const handleAddImage = () => {
    emit("add-image");
};

const handleDeleteImage = (index: number) => {
    emit("delete-image", index);
};

const imageCount = computed(() => props.imageFiles.length);
</script>
