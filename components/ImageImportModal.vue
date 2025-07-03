<template>
    <UModal
        title="图片预览"
        :ui="{ body: 'p-0 sm:p-0', content: 'h-[60dvh] aspect-square' }"
    >
        <template #body>
            <!-- <ImageCropper :src="props.src" /> -->
            <ImagePreviewGrid :imageFiles="props.imageFiles" />
        </template>
        <template #footer>
            <div class="flex flex-1 justify-end gap-2">
                <UButton
                    v-if="imageCount < 8"
                    icon="i-lucide-plus"
                    size="md"
                    variant="outline"
                    @click="handleAddImage"
                ></UButton>
                <UTooltip text="识别图片中的文字并导入">
                    <UButton icon="i-lucide-scan-text">识别文字</UButton>
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
