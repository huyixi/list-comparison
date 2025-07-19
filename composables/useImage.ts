// composable/useImage.ts

import type { Ref } from "vue";
import type { ImageItem } from "~/types";
import type { Cropper } from "vue-advanced-cropper";
import { performOCR } from "~/utils/ocr";

const imageItems = ref<ImageItem[]>([]);
const selectedIndex = ref<number | null>(null);

const importModalOpen = ref(false);

const openImportModal = () => {
  importModalOpen.value = true;
};

const closeImportModal = () => {
  importModalOpen.value = false;
};

const editorOpen = ref(false);

const openEditor = (index: number) => {
  if (index < 0 || index >= imageItems.value.length) {
    console.warn("[useImage] openEditor: index 越界", index);
    selectedIndex.value = null;
    editorOpen.value = false;
    return;
  }
  selectedIndex.value = index;
  editorOpen.value = true;
  console.log("editorOpen", selectedIndex.value);
};

const closeEditor = () => {
  editorOpen.value = false;
  selectedIndex.value = null;
  console.log("previewClose", selectedIndex.value);
};

const addImages = (items: ImageItem[]) => {
  imageItems.value.push(...items);
};

const updateImageAt = (index: number, item: ImageItem) => {
  if (index >= 0 && index < imageItems.value.length) {
    imageItems.value.splice(index, 1, item);
  } else {
    console.warn("[useImage] updateImageAt: index 越界", index);
  }
};

const deleteImageAt = (index: number) => {
  if (index >= 0 && index < imageItems.value.length) {
    imageItems.value.splice(index, 1);
    console.log("deleteImageAt", index, imageItems.value, imageItems);
  }
};

const clearImages = () => {
  imageItems.value = [];
};

watch(
  () => imageItems.value.length,
  (newLength) => {
    if (newLength === 0) {
      closeImportModal();
    }
  },
);

const cropSelectedImage = (
  cropperRef: Ref<InstanceType<typeof Cropper> | null>,
) => {
  const index = selectedIndex.value;

  if (!cropperRef.value) {
    console.warn("[useImage] cropSelectedImage: cropperRef 为空");
    return;
  }

  if (index === null || index < 0 || index >= imageItems.value.length) {
    console.warn("[useImage] cropSelectedImage: selectedIndex 无效");
    return;
  }

  const result = cropperRef.value.getResult();
  const canvas = result?.canvas;

  if (!canvas) {
    console.warn("[useImage] cropSelectedImage: 未获取到 canvas");
    return;
  }

  const base64 = canvas.toDataURL();
  const originalItem = imageItems.value[index];

  const newItem: ImageItem = {
    ...originalItem,
    croppedBase64: base64,
  };

  updateImageAt(index, newItem);

  closeEditor();
};

const performAllOCR = async () => {
  for (let i = 0; i < imageItems.value.length; i++) {
    const item = imageItems.value[i];

    updateImageAt(i, { ...item, ocrStatus: "pending" });

    const updated = await performOCR(item);

    updateImageAt(i, updated);
  }
};

const allOcrDone = computed(() => {
  return imageItems.value.every((item) => item.ocrStatus === "success");
});

const ocredCount = computed(() => {
  return imageItems.value.filter((item) => item.ocrStatus === "success").length;
});

export function useImage() {
  return {
    imageItems,
    editorOpen,
    selectedIndex,
    openEditor,
    closeEditor,
    addImages,
    updateImageAt,
    deleteImageAt,
    clearImages,
    cropSelectedImage,
    performAllOCR,
    allOcrDone,
    ocredCount,
    importModalOpen,
    closeImportModal,
    openImportModal,
  };
}
