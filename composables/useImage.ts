// composable/useImage.ts

import type { Ref } from "vue";
import type { ImageItem } from "~/types";
import type { Cropper } from "vue-advanced-cropper";
import { performOCR } from "~/utils/ocr";

const imageItems = ref<ImageItem[]>([]);
const selectedIndex = ref<number | null>(null);

const imageItemCount = computed(() => imageItems.value.length);

const editorOpen = ref(false);

const selectedImageSize = ref<{ width: number; height: number } | null>(null);

const cropCoordinates = ref<{
  left: number;
  top: number;
  width: number;
  height: number;
} | null>(null);

const openEditor = async (index: number) => {
  if (index < 0 || index >= imageItems.value.length) {
    selectedIndex.value = null;
    editorOpen.value = false;
    return;
  }

  selectedIndex.value = index;
  editorOpen.value = true;

  const image = new Image();
  image.src =
    imageItems.value[index].croppedBase64 || imageItems.value[index].base64;

  await new Promise((resolve) => {
    image.onload = resolve;
    image.onerror = () => {
      selectedImageSize.value = null;
      cropCoordinates.value = null;
      resolve(null);
    };
  });

  selectedImageSize.value = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  };

  cropCoordinates.value = {
    left: 0,
    top: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};

const closeEditor = () => {
  editorOpen.value = false;
  selectedIndex.value = null;
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
    ocrText: "",
    ocrStatus: "idle",
  };

  updateImageAt(index, newItem);

  closeEditor();
};

const performAllOCR = async () => {
  for (let i = 0; i < imageItems.value.length; i++) {
    const item = imageItems.value[i];
    if (item.ocrStatus === "success") continue;

    updateImageAt(i, { ...item, ocrStatus: "pending" });

    try {
      const updated = await performOCR(item);
      updateImageAt(i, updated);
    } catch (e) {
      updateImageAt(i, { ...item, ocrStatus: "error", ocrText: "" });
      console.error(`OCR failed for image ${i}:`, e);
    }
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
    imageItemCount,
    selectedIndex,
    editorOpen,
    selectedImageSize,
    cropCoordinates,
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
  };
}
