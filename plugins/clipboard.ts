// plugins/clipboard.ts

export default defineNuxtPlugin(() => {
  const readTextFromClipboard = async () => {
    if (!process.client) {
      throw new Error("只能在客户端使用剪贴板API");
    }

    if (!navigator?.clipboard?.readText) {
      throw new Error("剪贴板API不可用");
    }

    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.error("读取剪贴板失败:", err);
      throw err;
    }
  };

  return {
    provide: {
      clipboard: {
        readText: readTextFromClipboard,
      },
    },
  };
});
