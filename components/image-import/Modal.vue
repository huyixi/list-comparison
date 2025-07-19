<!-- ./components/image-import/Modal.vue -->
<script setup lang="ts">
import { useImage } from "~/composables/useImage";
const { imageItems, performAllOCR, allOcrDone, clearImages, closeImportModal } =
    useImage();
const imageCount = computed(() => imageItems.value.length);

const emit = defineEmits(["add-image"]);

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});

const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText");

const isRecognizing = ref(false);

const handleClick = async () => {
    if (!allOcrDone.value) {
        if (isRecognizing.value) return;

        isRecognizing.value = true;
        await performAllOCR();
        isRecognizing.value = false;
    } else {
        const text = imageItems.value
            .filter(
                (item) => item.ocrStatus === "success" && item.ocrText?.trim(),
            )
            .map((item) => item.ocrText!.trim())
            .join("\n");

        appendText(props.target, text);
        closeImportModal();
        clearImages();
    }
};
</script>

<template>
    <UModal
        title="图文识别"
        :ui="{ body: 'p-0 sm:p-0 aspect-square overflow-hidden' }"
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
                        @click="emit('add-image')"
                    ></UButton>
                </UTooltip>
                <UTooltip
                    :text="allOcrDone ? '导入图片中的文字' : '识别图片中的文字'"
                >
                    <UButton
                        :icon="
                            allOcrDone
                                ? 'i-lucide-circle-arrow-up'
                                : 'i-lucide-scan-text'
                        "
                        size="md"
                        :ui="{
                            base: 'text-white',
                            leadingIcon: 'text-white',
                        }"
                        :loading="isRecognizing"
                        :disabled="isRecognizing"
                        @click="handleClick"
                    >
                        {{ allOcrDone ? "导入文字" : "识别文字" }}
                    </UButton>
                </UTooltip>
            </div>
        </template>
    </UModal>
</template>
