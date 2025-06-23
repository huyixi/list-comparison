export const initialSeparators = [
  { label: ",", description: "英文逗号", id: "comma" },
  { label: ".", description: "英文句点", id: "dot" },
  { label: " ", description: "空格", id: "space" },
  { label: ";", description: "英文分号", id: "semicolon" },
  { label: ":", description: "英文冒号", id: "colon" },
  { label: "，", description: "中文逗号", id: "ch-comma" },
  { label: "。", description: "中文句号", id: "ch-dot" },
  { label: "　", description: "全角空格", id: "full-space" },
  { label: "；", description: "中文分号", id: "ch-semicolon" },
  { label: "：", description: "中文冒号", id: "ch-colon" },
  { label: "|", description: "竖线", id: "pipe" },
  { label: "/", description: "斜杠", id: "slash" },
  { label: "\\", description: "反斜杠", id: "backslash" },
  { label: "\n", description: "换行", id: "newline" },
] as const;

export type BuiltInSeparator = (typeof initialSeparators)[number];
export type BuiltInSeparatorId = BuiltInSeparator["id"];

export type CustomSeparator = {
  label: string;
  description: string;
  id: string;
};

export type SeparatorItem = BuiltInSeparator | CustomSeparator;
