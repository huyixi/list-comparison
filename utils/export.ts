/**
 * 将比对结果导出为 txt 文件
 * @param params.onlyInA 仅在名单 A 中存在的条目数组
 * @param params.onlyInB 仅在名单 B 中存在的条目数组
 * @param params.inBoth 同时存在于名单 A 和 B 的条目数组
 * @param params.listAInfo 名单 A 的解析信息，包含 duplicates、invalidNames 等字段
 * @param params.listBInfo 名单 B 的解析信息，包含 duplicates、invalidNames 等字段
 * @param params.filename 文件名前缀，默认为 "比对结果"
 */
export function exportResultsToFile({
  onlyInA,
  onlyInB,
  inBoth,
  listAInfo,
  listBInfo,
  filename = "比对结果",
}: {
  onlyInA: string[];
  onlyInB: string[];
  inBoth: string[];
  listAInfo: {
    duplicates: { name: string; count: number }[];
    invalidNames: string[];
  };
  listBInfo: {
    duplicates: { name: string; count: number }[];
    invalidNames: string[];
  };
  filename?: string;
}) {
  const sections: { title: string; content: string }[] = [];

  if (onlyInA.length > 0) {
    sections.push({
      title: "--- 仅在名单 A 中存在的条目 ---",
      content: onlyInA.join("\n"),
    });
  }

  if (onlyInB.length > 0) {
    sections.push({
      title: "--- 仅在名单 B 中存在的条目 ---",
      content: onlyInB.join("\n"),
    });
  }

  if (inBoth.length > 0) {
    sections.push({
      title: "--- 同时存在于名单 A 和 B 中的条目 ---",
      content: inBoth.join("\n"),
    });
  }

  if (listAInfo.duplicates.length > 0) {
    const duplicateContent = listAInfo.duplicates
      .map((item) => `${item.name} (出现 ${item.count} 次)`)
      .join("\n");

    sections.push({
      title: "--- 名单 A 中的重复条目 ---",
      content: duplicateContent,
    });
  }

  if (listBInfo.duplicates.length > 0) {
    const duplicateContent = listBInfo.duplicates
      .map((item) => `${item.name} (出现 ${item.count} 次)`)
      .join("\n");

    sections.push({
      title: "--- 名单 B 中的重复条目 ---",
      content: duplicateContent,
    });
  }

  if (listAInfo.invalidNames.length > 0) {
    sections.push({
      title: "--- 名单 A 中检测到的特殊格式或空条目 (仅提示) ---",
      content: listAInfo.invalidNames.join("\n"),
    });
  }

  if (listBInfo.invalidNames.length > 0) {
    sections.push({
      title: "--- 名单 B 中检测到的特殊格式或空条目 (仅提示) ---",
      content: listBInfo.invalidNames.join("\n"),
    });
  }

  if (sections.length === 0) {
    // 无内容直接返回
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
  } catch (error) {
    console.error("导出失败:", error);
  }
}
