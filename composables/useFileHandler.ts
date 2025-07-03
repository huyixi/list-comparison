// composables/useFileHandler.ts
import * as XLSX from "xlsx";
import type { WorkBook } from "xlsx";
import type { Sheet } from "~/types/sheet";

type FileCategory = "text" | "spreadsheet" | "image";

const validFileTypes: Record<
  FileCategory,
  { exts: string[]; mimes: string[] }
> = {
  text: {
    exts: ["txt", "csv"],
    mimes: ["text/plain", "text/csv"],
  },
  spreadsheet: {
    exts: ["xlsx"],
    mimes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  image: {
    exts: ["jpg", "jpeg", "png"],
    mimes: ["image/jpeg", "image/png"],
  },
};

/**
 * 文件处理工具组合
 */
export const useFileHandler = () => {
  /**
   * 提取文件扩展名
   */
  const getFileExtension = (file: File): string =>
    file.name.toLowerCase().split(".").pop() || "";

  /**
   *
   */
  const getFileType = (file: File): FileCategory | null => {
    const ext = getFileExtension(file);
    for (const [category, { exts }] of Object.entries(validFileTypes)) {
      if (exts.includes(ext)) return category as FileCategory;
    }
    return null;
  };

  /**
   * 校验文件类型是否合法
   */
  const isValidFileType = (file: File): boolean => {
    const ext = getFileExtension(file);
    const mime = file.type;
    return Object.values(validFileTypes).some(
      ({ exts, mimes }) =>
        exts.includes(ext) && (mimes.includes(mime) || mime === ""),
    );
  };

  /**
   * 解析 Workbook 为 Sheet 数据结构
   */
  const parseWorkbook = (workbook: WorkBook): Sheet[] => {
    return workbook.SheetNames.map((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        blankrows: false,
        defval: "",
        raw: false,
      });

      if (!jsonData.length) {
        console.warn(`Sheet "${sheetName}" is empty.`);
        return {
          name: sheetName,
          label: sheetName,
          columns: [],
          data: [],
        };
      }

      const [headerRow, ...rows] = jsonData;
      const columns = (headerRow as any[]).map((col) =>
        (col ?? "").toString().trim(),
      );

      return {
        name: sheetName,
        label: sheetName,
        columns,
        data: rows as string[][],
      };
    });
  };

  /**
   * 解析上传文件，返回内容或 Sheet 数据
   */
  const parseFile = async (file: File): Promise<string | Sheet[]> => {
    const ext = getFileExtension(file);
    const reader = new FileReader();

    const result = await new Promise<string | ArrayBuffer>(
      (resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result!);
        ext === "xlsx"
          ? reader.readAsArrayBuffer(file)
          : reader.readAsText(file);
      },
    );

    if (ext === "txt" || ext === "csv") {
      return result as string;
    }

    if (ext === "xlsx") {
      const workbook = XLSX.read(new Uint8Array(result as ArrayBuffer), {
        type: "array",
      });
      return parseWorkbook(workbook);
    }

    throw new Error("Unsupported file format");
  };

  return {
    isValidFileType,
    parseFile,
    parseWorkbook,
    getFileExtension,
    getFileType,
  };
};
