// utils/ocr.ts
function preprocessImageBase64(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = base64;
  });
}

export async function performOCR(base64: string): Promise<{
  success: boolean;
  text?: string;
  error?: unknown;
}> {
  if (process.server) {
    return { success: false, error: "Server side" };
  }

  try {
    const { createWorker } = await import("tesseract.js");

    const preprocessedBase64 = await preprocessImageBase64(base64);

    const worker = await createWorker(["chi_sim"], 1);
    await worker.setParameters({
      preserve_interword_spaces: "1",
      user_defined_dpi: "300",
    });

    const result = await worker.recognize(preprocessedBase64);
    await worker.terminate();
    return {
      success: true,
      text: result.data.text.trim(),
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}
