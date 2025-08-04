<!-- ./components/image-import/Modal.vue -->
<script setup lang="ts">
import { useImage } from "~/composables/useImage";
const { imageItems, allOcrDone, clearImages, ocredCount } = useImage();
const toast = useToast();
const imageCount = computed(() => imageItems.value.length);

const emit = defineEmits(["add-image", "update:open"]);

const props = defineProps({
    target: {
        type: String as PropType<"A" | "B">,
        required: true,
    },
});

const appendText =
    inject<(target: "A" | "B", text: string) => void>("appendText")!;

const isRecognizing = ref(false);

const handleClick = async () => {
    const text = imageItems.value
        .filter((item) => item.ocrStatus === "success" && item.ocrText?.trim())
        .map((item) => item.ocrText!.trim())
        .join("\n");

    appendText(props.target, text);
    clearImages();
    emit("update:open", false);
    toast.add({
        title: `识别结果已添加到输入框 ${props.target}`,
        icon: "i-lucide-check",
    });
};

const isOpen = defineModel<boolean>("open");
</script>

<template>
    <UModal
        title="图文识别"
        :ui="{ body: 'p-0 sm:p-0 aspect-square overflow-hidden' }"
        v-model:open="isOpen"
    >
        <template #body>
            <ImageImportPreviewGrid />
        </template>
        <template #footer>
            <div class="flex flex-1 justify-between items-center gap-3">
                <p class="text-sm">
                    {{ ocredCount }} / {{ imageItems.length }}
                </p>
                <div class="flex gap-3">
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
                        :text="
                            allOcrDone
                                ? '导入图片中的文字'
                                : '正在识别文字中...'
                        "
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
                            :loading="!allOcrDone"
                            :disabled="!allOcrDone"
                            @click="handleClick"
                        >
                            {{ allOcrDone ? "添加文字" : "识别中..." }}
                        </UButton>
                    </UTooltip>
                </div>
            </div>
        </template>
    </UModal>
</template>
