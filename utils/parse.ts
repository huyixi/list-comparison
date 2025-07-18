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
    .map(([item, count]) => ({ item, count }))
    .sort((a, b) => b.count - a.count || a.item.localeCompare(b.item));

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
