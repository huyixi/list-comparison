import { ref } from "vue";

const useFileHandler = (options) => {
  const defaultOptions = {
    validTypes: ["text/plain", "text/csv"],
    validExtensions: [".txt", ".csv"],
  };
  const config = { ...defaultOptions, ...options };
  const error = ref(null);
  const isLoading = ref(false);
  const validateFile = (file) => {
    if (!file) return false;

    // 类型校验
    const typeValid = config.validTypes.includes(file.type);
    const extValid = config.validExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    return (typeValid || extValid) && sizeValid;
  };
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!config.autoRead) return resolve(file);

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  // 完整处理流程
  const processFile = async (file) => {
    try {
      isLoading.value = true;
      error.value = null;

      if (!validateFile(file)) {
        throw new Error("INVALID_FILE");
      }

      return await readFile(file);
    } catch (err) {
      error.value = handleError(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // 错误处理
  const handleError = (error) => {
    const messages = {
      INVALID_FILE: `支持的文件类型: ${config.validExtensions.join(", ")}，最大大小: ${config.maxSize / 1024 / 1024}MB`,
      DEFAULT: "文件处理失败，请重试",
    };

    return {
      code: error.message,
      message: messages[error.message] || messages.DEFAULT,
      raw: error,
    };
  };

  return {
    processFile,
    error,
    isLoading,
    validateFile,
  };
};

export default useFileHandler;
