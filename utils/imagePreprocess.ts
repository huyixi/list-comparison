// utils/imagePreprocess.ts

export function convertToGrayscale(imageData: ImageData): ImageData {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  return imageData;
}

export function binarizeImage(
  imageData: ImageData,
  threshold = 180,
): ImageData {
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

export function preprocessImageData(
  imageData: ImageData,
  {
    grayscale = true,
    contrast = 1.2,
    binarize = true,
    binarizeThreshold = 180,
  }: {
    grayscale?: boolean;
    contrast?: number;
    binarize?: boolean;
    binarizeThreshold?: number;
    blur?: boolean;
  } = {},
): ImageData {
  if (grayscale) {
    imageData = convertToGrayscale(imageData);
  }

  if (contrast !== 1) {
    imageData = enhanceContrast(imageData, contrast);
  }

  if (binarize) {
    imageData = binarizeImage(imageData, binarizeThreshold);
  }

  return imageData;
}
