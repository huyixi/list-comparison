// utils/ocrWorker.ts
import type { Worker } from "tesseract.js";

let workerInstance: Worker | null = null;

const taskQueue: (() => Promise<void>)[] = [];
let isRunning = false;

export const initOCRWorker = async () => {
  if (workerInstance) return;

  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["chi_sim"], 1);

  await worker.setParameters({
    preserve_interword_spaces: "1",
    user_defined_dpi: "300",
  });

  workerInstance = worker;
};

const processQueue = async () => {
  if (isRunning || taskQueue.length === 0) return;

  isRunning = true;

  const task = taskQueue.shift()!;
  if (!task) {
    isRunning = false;
    return;
  }

  try {
    await task();
  } catch (error) {
    console.error("[OCR Queue] Task error:", error);
  } finally {
    isRunning = false;
    processQueue();
  }
};

type OCRResult = {
  success: boolean;
  text?: string;
  error?: unknown;
};

export const performOCR = async (base64: string): Promise<OCRResult> => {
  if (process.server) {
    return { success: false, error: new Error("Not available on server side") };
  }

  try {
    if (!workerInstance) {
      await initOCRWorker();
    }

    // const preprocessedBase64 = await preprocessImageBase64(base64);
    const result = await workerInstance!.recognize(base64);
    return { success: true, text: result.data.text };
  } catch (error) {
    return { success: false, error };
  }
};

export const enqueueOCR = (
  base64: string,
  callback: (result: OCRResult) => void,
) => {
  taskQueue.push(async () => {
    const result = await performOCR(base64);
    callback(result);
  });

  processQueue();
};
