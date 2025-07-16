// composable/useImage.ts

import type { Ref } from "vue";
import type { ImageItem } from "~/types";
import type { Cropper } from "vue-advanced-cropper";
import { performOCR } from "~/utils/ocr";

const imageItems = ref<ImageItem[]>([]);
const selectedIndex = ref<number | null>(null);
const previewOpen = ref(false);

const openPreview = (index: number) => {
  if (index < 0 || index >= imageItems.value.length) {
    console.warn("[useImage] openPreview: index 越界", index);
    selectedIndex.value = null;
    previewOpen.value = false;
    return;
  }
  selectedIndex.value = index;
  previewOpen.value = true;
  console.log("previewOpen", selectedIndex.value);
};

const closePreview = () => {
  previewOpen.value = false;
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
  };

  updateImageAt(index, newItem);

  closePreview();
};

const performAllOCR = async () => {
  for (let i = 0; i < imageItems.value.length; i++) {
    const item = imageItems.value[i];

    updateImageAt(i, { ...item, ocrStatus: "pending" });

    const updated = await performOCR(item);

    // 可加上 flash 标记
    updateImageAt(i, {
      ...updated,
      __flashOCR: true, // 可用于触发 CSS 动画
    });

    // 延迟移除 flash 标记
    setTimeout(() => {
      const current = imageItems.value[i];
      if (current) {
        const { __flashOCR, ...rest } = current;
        updateImageAt(i, rest);
      }
    }, 1000);
  }
};

export function useImage() {
  return {
    imageItems,
    previewOpen,
    selectedIndex,
    openPreview,
    closePreview,
    addImages,
    updateImageAt,
    deleteImageAt,
    clearImages,
    cropSelectedImage,
    performAllOCR,
  };
}
