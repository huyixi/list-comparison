type ParsedItem = {
  value: string;
  separator: string;
  start: number;
  end: number;
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function parseTextWithSeparators(
  text: string,
  separators: string[],
): ParsedItem[] {
  if (!text || typeof text !== "string" || !text.trim()) {
    return [];
  }

  const sepPattern = separators.map(escapeRegex).join("|");
  const regex = new RegExp(sepPattern, "g");

  const result: ParsedItem[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const sep = match[0];
    const part = text.slice(lastIndex, match.index);
    result.push({
      value: part,
      separator: sep,
      start: lastIndex,
      end: match.index + sep.length,
    });
    lastIndex = match.index + sep.length;
  }

  if (lastIndex < text.length) {
    result.push({
      value: text.slice(lastIndex),
      separator: "",
      start: lastIndex,
      end: text.length,
    });
  }

  return result;
}

function isInvalidItem(item: string): boolean {
  const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
  return !item?.trim() || !validCharPattern.test(item);
}

export function parseText(
  text: string,
  separators: string[],
): {
  rawItems: string[];
  rawItemsCount: number;
  validItems: string[];
  validItemsCount: number;
  duplicateItems: { label: string; count: number }[];
  duplicateItemsCount: number;
  invalidItems: string[];
  invalidItemsCount: number;
} {
  const parsed = parseTextWithSeparators(text, separators);
  const rawItems = parsed
    .map((entry) => entry.value.trim())
    .filter((v) => v !== "");

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

  return {
    rawItems,
    rawItemsCount: rawItems.length,
    validItems,
    validItemsCount: validItems.length,
    duplicateItems,
    duplicateItemsCount: duplicateItems.length,
    invalidItems,
    invalidItemsCount: invalidItems.length,
  };
}

export function removeDuplicateItems(
  text: string,
  separators: string[],
): string {
  if (!text || typeof text !== "string") return "";

  const parsed = parseTextWithSeparators(text, separators);
  const seen = new Set<string>();
  const resultParts: string[] = [];

  for (const entry of parsed) {
    const trimmed = entry.value.trim();
    if (trimmed === "") {
      resultParts.push(text.slice(entry.start, entry.end));
      continue;
    }

    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      resultParts.push(text.slice(entry.start, entry.end));
    }
  }

  return resultParts.join("");
}

export function removeInvalidItems(text: string, separators: string[]): string {
  if (!text || typeof text !== "string") return "";

  const parsed = parseTextWithSeparators(text, separators);
  const resultParts: string[] = [];

  for (const entry of parsed) {
    const trimmed = entry.value.trim();
    if (!isInvalidItem(trimmed)) {
      resultParts.push(text.slice(entry.start, entry.end));
    } else {
      const slice = text.slice(entry.start, entry.end);
      const preservedSeparators = slice.slice(entry.value.length);
      resultParts.push(preservedSeparators);
    }
  }

  return resultParts.join("");
}
