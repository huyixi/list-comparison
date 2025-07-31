// composables/useClipboard.ts
export const useClipboard = () => {
  const toast = useToast();

  // 复制
  const writeText = async (
    text: string,
    options: { showSuccessToast?: boolean; showFailToast?: boolean } = {},
  ): Promise<{ success: boolean; error?: Error }> => {
    const { showSuccessToast = false, showFailToast = true } = options;

    if (!text) {
      const error = new Error("没有可复制内容");
      handleFailToast(error);
      return { success: false, error };
    }

    if (!import.meta.client || !navigator?.clipboard?.writeText) {
      const error = new Error("浏览器不支持粘贴操作");
      handleFailToast(error);
      return { success: false, error };
    }

    try {
      await navigator.clipboard.writeText(text);

      if (showSuccessToast) {
        toast?.add?.({
          title: "复制成功",
          color: "success",
          icon: "i-lucide-check",
        });
      }

      return { success: true };
    } catch (e: any) {
      handleFailToast(e);
      return { success: false, error: e };
    }

    function handleFailToast(error: Error) {
      if (showFailToast) {
        toast?.add?.({
          title: "复制失败",
          description: "请尝试手动复制（Ctrl+C）",
          color: "error",
          icon: "i-lucide-x",
        });
      }
    }
  };

  // 粘贴
  const readText = async (
    options: { showSuccessToast?: boolean; showFailToast?: boolean } = {},
  ): Promise<{ success: boolean; text?: string; error?: Error }> => {
    const { showSuccessToast = false, showFailToast = true } = options;

    if (!import.meta.client || !navigator?.clipboard?.readText) {
      const error = new Error("剪贴板权限未授权");
      handleFailToast(error);
      return { success: false, error };
    }

    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        console.log("剪贴板内容为空");
        const error = new Error("剪贴板内容为空");
        handleFailToast(error);
        return { success: false, error };
      }
      if (showSuccessToast) {
        toast?.add?.({
          title: "粘贴成功",
          color: "success",
          icon: "i-lucide-check",
        });
      }
      return { success: true, text };
    } catch (e: any) {
      handleFailToast(e);
      return { success: false, error: e };
    }

    function handleFailToast(error: Error) {
      console.log("粘贴失败", typeof error, error);
      if (!showFailToast) return;
      toast?.add?.({
        title: "粘贴失败",
        description: error.message ?? "请手动粘贴（Ctrl+V）",
        color: "error",
        icon: "i-lucide-x",
      });
    }
  };

  return {
    readText,
    writeText,
  };
};
