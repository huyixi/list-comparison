// utils/listUtils.ts

/**
 * 根据输入文本分割成名称列表，去除空白和无效项
 * @param text 输入字符串
 * @param separators 分隔符数组
 * @returns 名称数组
 */
export function getItemsFromString(
  text: string,
  separators: string[],
): string[] {
  if (!text || typeof text !== "string" || !text.trim()) {
    return [];
  }
  const escapeSeparators = separators
    .map((sep) => sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("");

  const regex = new RegExp(`[${escapeSeparators}]`, "g");

  return text
    .split(regex)
    .map((name) => name.trim())
    .filter((name) => name !== "");
}

/**
 * 判断字符串是否被视为无效名称
 * 无效标准：空字符串，或者不包含任何字母、数字、汉字等有效字符
 * @param name 需要判断的字符串
 * @returns 是否无效
 */
export function isConsideredInvalid(name: string): boolean {
  if (!name || typeof name !== "string") return true;
  const trimmedName = name.trim();
  if (trimmedName === "") return true;

  // Unicode 属性匹配：字母、数字、汉字等
  const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
  return !validCharPattern.test(trimmedName);
}

/**
 * 解析文本列表，返回统计信息（总数、唯一列表、重复、无效项）
 * @param text 输入字符串
 * @param separators 分隔符数组
 * @returns 解析结果对象
 */
export function parseList(text: string, separators: string[]) {
  const result: {
    totalEnteredCount: number;
    allNames: string[];
    allUniqueNames: string[];
    duplicates: { name: string; count: number }[];
    duplicateInfoCount: number;
    invalidNames: string[];
    invalidCount: number;
  } = {
    totalEnteredCount: 0,
    allNames: [],
    allUniqueNames: [],
    duplicates: [],
    duplicateInfoCount: 0,
    invalidNames: [],
    invalidCount: 0,
  };

  const items = getItemsFromString(text, separators);
  console.log("items", items, separators);
  result.totalEnteredCount = items.length;
  result.allNames = items;

  const nameCountMap: Record<string, number> = {};
  const allNamesSet = new Set<string>();
  const tempInvalidNames: string[] = [];

  items.forEach((name) => {
    if (isConsideredInvalid(name)) {
      tempInvalidNames.push(name);
    }
    nameCountMap[name] = (nameCountMap[name] || 0) + 1;
    allNamesSet.add(name);
  });

  result.allUniqueNames = Array.from(allNamesSet).sort();
  result.invalidNames = tempInvalidNames;
  result.invalidCount = tempInvalidNames.length;

  const duplicateEntries = Object.entries(nameCountMap)
    .filter(([_, count]) => count > 1)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  result.duplicates = duplicateEntries;
  result.duplicateInfoCount = duplicateEntries.reduce(
    (sum, { count }) => sum + count,
    0,
  );

  return result;
}
