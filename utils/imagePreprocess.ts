// utils/imagePreprocess.ts

export function grayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  return imageData;
}

export function binarize(imageData: ImageData, threshold = 180): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i];
    const value = gray < threshold ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = value;
  }
  return imageData;
}

export function enhanceContrast(imageData: ImageData, factor = 1.2): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let val = data[i] * factor;
    val = Math.max(0, Math.min(255, val));
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  return imageData;
}

export function invert(imageData: ImageData): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  return imageData;
}

export function resizeImage(
  image: HTMLImageElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, width, height);
  return canvas;
}

export async function preprocessImage(base64: string): Promise<ImageData> {
  const img = new Image();
  img.src = base64;

  return new Promise<ImageData>((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      imageData = grayscale(imageData);
      // imageData = binarize(imageData, 128);
      // imageData = invert(imageData);
      // imageData = enhanceContrast(imageData, 1.2);

      resolve(imageData);
    };
  });
}
