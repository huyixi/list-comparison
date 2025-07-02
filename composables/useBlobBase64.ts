// composables/useBlobBase64.ts
export function useBlobBase64() {
  /**
   * 将 base64 字符串转换为 Blob
   */
  function base64ToBlob(base64: string): Blob {
    const [meta, content] = base64.split(",");
    const mimeMatch = meta.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const byteString = atob(content);
    const array = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      array[i] = byteString.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  }

  /**
   * 将 Blob 转为 base64 字符串（dataURL）
   */
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return {
    base64ToBlob,
    blobToBase64,
  };
}
