// plugins/clipboard.client.ts
export default defineNuxtPlugin(() => {
  const toast = useToast();

  const readText = async (): Promise<string> => {
    if (!process.client) throw new Error("仅支持客户端剪贴板读取");

    const fallback = async (): Promise<string> => {
      try {
        const success = document.execCommand("paste");
        if (success) {
          const text = window.getSelection()?.toString();
          if (text?.trim()) return text.trim();
        }
        throw new Error("回退读取失败");
      } catch (err) {
        toast.add({
          title: "读取失败",
          description: "请尝试手动粘贴（Ctrl+V）",
          color: "error",
        });
        throw err;
      }
    };

    try {
      if (!navigator?.clipboard?.readText) {
        throw new Error("浏览器不支持剪贴板 API");
      }

      const text = await navigator.clipboard.readText();
      return text;
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        toast.add({
          title: "无法访问剪贴板",
          description: "请允许浏览器访问剪贴板",
          color: "warning",
        });
      } else {
        toast.add({
          title: "读取剪贴板失败",
          description: "已尝试使用回退方案",
          color: "error",
        });
      }

      return await fallback();
    }
  };

  const writeText = async (text: string): Promise<void> => {
    if (!process.client) throw new Error("仅支持客户端剪贴板写入");

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("浏览器不支持剪贴板写入");
      }

      await navigator.clipboard.writeText(text);
      toast.add({ title: "复制成功" });
    } catch (err) {
      toast.add({
        title: "复制失败",
        description: "请尝试手动复制（Ctrl+C）",
        color: "error",
      });
      throw err;
    }
  };

  return {
    provide: {
      clipboard: {
        readText,
        writeText,
      },
    },
  };
});
