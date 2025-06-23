// composables/useCopy.ts
export const useCopy = () => {
  const toast = useToast();

  const fallbackCopy = (text: string): boolean => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "1px";
    textArea.style.height = "1px";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand("copy");
    } catch (err) {
      successful = false;
    }

    document.body.removeChild(textArea);
    return successful;
  };

  /**
   * 复制文本函数
   * @param content 需要复制的文本
   * @param onSuccess 成功回调（可选）
   * @param onFail 失败回调（可选）
   */
  const handleCopy = async (
    content: string,
    onSuccess?: () => void,
    onFail?: () => void,
  ): Promise<boolean> => {
    if (!content) {
      toast.add({
        title: "无可复制内容",
        color: "neutral",
        icon: "i-lucide-circle-alert",
        duration: 2000,
      });
      onFail && onFail();
      return false;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const result = fallbackCopy(content);
        if (!result) throw new Error("Fallback copy failed");
      }
      toast.add({
        title: "复制成功",
        color: "success",
        icon: "i-lucide-copy-check",
        duration: 1000,
      });
      onSuccess && onSuccess();
      return true;
    } catch (error) {
      toast.add({
        title: "复制失败",
        description: "复制失败，请尝试手动复制。",
        color: "error",
        icon: "i-lucide-copy-x",
        duration: 2000,
      });
      onFail && onFail();
      return false;
    }
  };

  return { handleCopy };
};
