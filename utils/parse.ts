// utils/parse.ts

function buildRegexCharClass(separators: string[]): string {
  return separators
    .map((sep) => sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");
}

function splitTextBySeparators(text: string, separators: string[]): string[] {
  if (!text || typeof text !== "string" || !text.trim()) {
    return [];
  }
  const regexCharClass = buildRegexCharClass(separators);

  const regex = new RegExp(`[${regexCharClass}]`, "g");

  return text
    .split(regex)
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function isInvalidItem(item: string): boolean {
  const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
  return !item?.trim() || !validCharPattern.test(item);
}

export function parseText(text: string, separators: string[]) {
  const rawItems = splitTextBySeparators(text, separators);

  const validItems: string[] = [];
  const invalidItems: string[] = [];

  const itemCountMap: Record<string, number> = {};

  rawItems.forEach((item) => {
    if (isInvalidItem(item)) {
      invalidItems.push(item);
    } else {
      validItems.push(item);
    }

    itemCountMap[item] = (itemCountMap[item] || 0) + 1;
  });

  const duplicateItems = Object.entries(itemCountMap)
    .filter(([_, count]) => count > 1)
    .map(([item, count]) => ({ label: item, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  console.log("duplicateItem00000000000s", duplicateItems);

  const result = {
    rawItems,
    rawItemsCount: rawItems.length,
    validItems,
    validItemsCount: validItems.length,
    duplicateItems,
    duplicateItemsCount: duplicateItems.length,
    invalidItems,
    invalidItemsCount: invalidItems.length,
  };

  return result;
}

export function deduplicateText(text: string, separators: string[]): string {
  if (!text) return "";

  const parsed = parseText(text, separators);
  if (parsed.duplicateItems.length === 0) return text;

  let modifiedText = text;

  // 构建匹配所有分隔符或空白的正则表达式
  const sepPattern = separators
    .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const separatorRegex = new RegExp(`(?:${sepPattern})|\\s+`, "g");

  // 为避免重复删除同一部分，我们记录每次删改后的位置
  parsed.duplicateItems.forEach(({ item, count }) => {
    for (let i = 0; i < count - 1; i++) {
      const lastIndex = modifiedText.lastIndexOf(item);
      if (lastIndex === -1) continue;

      let startIndex = lastIndex;
      let endIndex = lastIndex + item.length;

      // 1. 尝试删除 item 后方的分隔符（优先处理）
      separatorRegex.lastIndex = endIndex;
      const nextMatch = separatorRegex.exec(modifiedText);
      if (nextMatch && nextMatch.index === endIndex) {
        endIndex = nextMatch.index + nextMatch[0].length;
      } else {
        // 2. 否则尝试删除前方的分隔符
        const before = modifiedText.slice(0, startIndex);
        let match: RegExpExecArray | null = null;
        let result: RegExpExecArray | null;

        // 向前找最后一个分隔符（避免直接用 regex.exec）
        while ((result = separatorRegex.exec(before)) !== null) {
          match = result;
        }

        if (match && match.index + match[0].length === startIndex) {
          startIndex = match.index;
        }
      }

      // 删除该重复项及可能的前/后分隔符
      modifiedText =
        modifiedText.slice(0, startIndex) + modifiedText.slice(endIndex);
    }
  });

  return modifiedText.trim();
}
