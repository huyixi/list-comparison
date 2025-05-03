import { progress } from "#build/ui";

// composables/useCopy.ts
export const useCopy = () => {
  const toast = useToast();

  const handleCopy = async (content: string) => {
    if (!content) {
      toast.add({
        title: "无可复制内容",
        color: "neutral",
        icon: "i-lucide-circle-alert",
        duration: 2000,
      });
      return false;
    }

    try {
      await navigator.clipboard.writeText(content);
      toast.add({
        title: "复制成功",
        color: "success",
        icon: "i-lucide-copy-check",
        duration: 1000,
      });
      return true;
    } catch (error) {
      toast.add({
        title: "复制失败",
        description: "复制失败，请尝试手动复制。",
        color: "error",
        icon: "i-lucide-copy-x",
        duration: 2000,
      });
      return false;
    }
  };

  return { handleCopy };
};
