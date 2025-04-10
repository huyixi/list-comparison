export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      clipboard: {
        async readText() {
          if (process.client && navigator.clipboard) {
            try {
              return await navigator.clipboard.readText();
            } catch (error) {
              console.error("剪贴板读取失败:", error);
              throw error;
            }
          } else {
            throw new Error("剪贴板API不可用");
          }
        },
      },
    },
  };
});
