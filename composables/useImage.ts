// composable/useImage.ts

import type { Ref } from "vue";
import type { ImageItem } from "~/types";
import type { Cropper } from "vue-advanced-cropper";
// import { performOCR } from "~/utils/ocr";
import { initOCRWorker, performOCR } from "~/utils/ocrWorker";
import { fileToBase64 } from "~/utils/file";
import { enqueueOCR } from "~/utils/ocrWorker";

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

async function addImages(files: File[]) {
  const newItems: ImageItem[] = [];

  for (const file of files) {
    const base64 = await fileToBase64(file);

    newItems.push({
      file,
      base64,
      ocrStatus: "idle",
    });
  }

  imageItems.value.push(...newItems);

  triggerOCRQueue();
}

function updateImageAt(index: number, patch: Partial<ImageItem>) {
  const item = imageItems.value[index];
  if (!item) return;
  imageItems.value[index] = { ...item, ...patch };
}

async function runOCRForImage(index: number) {
  const item = imageItems.value[index];
  if (!item) return;

  updateImageAt(index, { ocrStatus: "pending" });

  const base64 = item.croppedBase64 || item.base64;
  enqueueOCR(base64, (result) => {
    if (!result.success) {
      updateImageAt(index, { ocrStatus: "error" });
    } else {
      updateImageAt(index, {
        ocrText: result.text,
        ocrStatus: "success",
      });
    }
  });
}

const triggerOCRQueue = () => {
  for (let i = 0; i < imageItems.value.length; i++) {
    if (imageItems.value[i].ocrStatus === "idle") {
      runOCRForImage(i);
    }
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
    ocrText: "",
    ocrStatus: "idle",
  };

  updateImageAt(index, newItem);
  triggerOCRQueue();
  closeEditor();
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
    allOcrDone,
    ocredCount,
  };
}
