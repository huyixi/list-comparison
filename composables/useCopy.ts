// composables/useCopy.ts
export const useCopy = () => {
  const toast = useToast();

  const handleCopy = async (content: string) => {
    if (!content) {
      toast.add({
        title: "无可复制内容",
        color: "neutral",
        icon: "i-lucide-circle-alert",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.add({
        title: "复制成功",
        description: "内容已复制到剪贴板。",
        color: "primary",
        icon: "i-lucide-copy-check",
      });
    } catch (error) {
      toast.add({
        title: "复制失败",
        description: "复制失败，请尝试手动复制。",
        color: "error",
        icon: "i-lucide-copy-x",
      });
    }
  };

  return { handleCopy };
};
