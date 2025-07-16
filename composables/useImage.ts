// composable/useImage.ts

import type { Ref } from "vue";
import type { ImageItem } from "~/types";
import type { Cropper } from "vue-advanced-cropper";

const toast = useToast();
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
  toast.add({
    title: "裁剪成功",
    icon: "i-lucide-badge-check",
    color: "success",
  });
  closePreview();
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
  };
}
