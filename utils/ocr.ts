// utils/ocr.ts
import { createWorker } from "tesseract.js";
import type { ImageItem } from "~/types/file";

export async function performOCR(item: ImageItem): Promise<ImageItem> {
  if (process.server) {
    return item;
  }

  const { createWorker } = await import("tesseract.js");

  item.ocrStatus = "pending";
  const worker = await createWorker(["eng", "chi_sim"], 1);
  try {
    const result = await worker.recognize(item.croppedBase64 || item.base64);
    item.ocrText = result.data.text.trim();
    item.ocrStatus = "success";
  } catch (error) {
    item.ocrStatus = "error";
    item.ocrText = "";
    console.error("[OCR] Failed to recognize:", error);
  } finally {
    await worker.terminate();
  }

  return item;
}
