/**
 * 将比对结果导出为 txt 文件
 * @param sections 导出区块数组，每项包含 title 和 content
 * @param filename 文件名前缀，默认为 "比对结果"
 */
export function exportResultsToFile(
  sections: { title: string; content: string }[],
  filename = "比对结果",
) {
  const toast = useToast();

  if (!sections || sections.length === 0) {
    toast.add({
      title: "没有可导出的内容",
      description: "没有发现任何可导出的结果",
      icon: "i-lucide-circle-alert",
    });
    return;
  }

  const content = sections
    .map((section) => `${section.title}\n${section.content}`)
    .join("\n\n\n");

  try {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const timestamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");

    link.download = `${filename}_${timestamp}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.add({
      title: "导出成功",
      icon: "i-lucide-circle-check",
      duration: 2000,
      color: "success",
    });
  } catch (error) {
    console.error("导出失败:", error);
    toast.add({
      title: "导出失败",
      description: "无法生成下载文件",
      icon: "i-lucide-circle-alert",
      color: "error",
    });
  }
}
