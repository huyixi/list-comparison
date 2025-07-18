<!-- ./components/image-import/Modal.vue -->
<template>
    <UModal
        title="图文识别"
        :ui="{ body: 'p-0 sm:p-0 h-[60dvh] aspect-square' }"
        :dismissible="false"
    >
        <template #body>
            <ImageImportPreviewGrid />
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
                        @click="handleOcrAllImages"
                    >
                        {{ allOcrDone ? "导入文字" : "文字识别" }}
                    </UButton>
                </UTooltip>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useImage } from "~/composables/useImage";
const { imageItems, performAllOCR, allOcrDone } = useImage();
const imageCount = computed(() => imageItems.value.length);

const emit = defineEmits(["ocr-finished", "add-image"]);

const handleAddImage = () => {
    emit("add-image");
};

const handleOcrAllImages = async () => {
    await performAllOCR();
    const results = imageItems.value
        .filter((item) => item.ocrStatus === "success" && item.ocrText?.trim())
        .map((item) => ({
            text: item.ocrText!,
        }));

    emit("ocr-finished", results);
};
</script>
