// plugins/clipboard.client.ts
export default defineNuxtPlugin(() => {
  const toast = useToast();

  const readText = async (): Promise<string> => {
    if (!import.meta.client) throw new Error("仅支持客户端剪贴板读取");

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
          title: "粘贴失败",
          description: "请尝试手动粘贴（Ctrl+V）",
          color: "error",
          icon: "i-lucide-circle-alert",
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
          icon: "i-lucide-circle-alert",
        });
      } else {
        toast.add({
          title: "粘贴失败",
          description: "请尝试手动粘贴（Ctrl+V）",
          color: "warning",
          icon: "i-lucide-circle-alert",
        });
      }

      return await fallback();
    }
  };

  const writeText = async (text: string): Promise<void> => {
    if (!import.meta.client) throw new Error("仅支持客户端剪贴板写入");

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("浏览器不支持剪贴板写入");
      }

      await navigator.clipboard.writeText(text);
      toast.add({
        title: "复制成功",
        icon: "i-lucide-check",
        color: "neutral",
      });
    } catch (err) {
      toast.add({
        title: "复制失败",
        description: "请尝试手动复制（Ctrl+C）",
        color: "error",
        icon: "i-lucide-circle-alert",
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
