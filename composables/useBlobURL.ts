// composables/useBlobURL.ts
export const useBlobURL = () => {
  const blobUrl = ref<string | null>(null);

  const setBlob = (blob: Blob) => {
    if (blobUrl.value) {
      URL.revokeObjectURL(blobUrl.value);
      blobUrl.value = null;
    }
    if (blob) {
      blobUrl.value = URL.createObjectURL(blob);
    }
  };

  onUnmounted(() => {
    if (blobUrl.value) {
      URL.revokeObjectURL(blobUrl.value);
      blobUrl.value = null;
    }
  });

  return { blobUrl, setBlob };
};
