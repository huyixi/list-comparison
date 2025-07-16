export interface ImageItem {
  file: File;
  base64: string;
  croppedBase64?: string;
  ocrText?: string;
  ocrStatus: "idle" | "pending" | "success" | "error";
}
