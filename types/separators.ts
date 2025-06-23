// types/separators.ts

export type BuiltInSeparator = {
  type: "built-in";
  label: string;
  description: string;
  id: string;
};

export type CustomSeparator = {
  type: "custom";
  label: string;
  description: string;
  id: string;
};

export type SeparatorItem = BuiltInSeparator | CustomSeparator;

export const initialSeparators: BuiltInSeparator[] = [
  { type: "built-in", label: ",", description: "英文逗号", id: "comma" },
  { type: "built-in", label: ".", description: "英文句点", id: "dot" },
  { type: "built-in", label: " ", description: "空格", id: "space" },
  { type: "built-in", label: ";", description: "英文分号", id: "semicolon" },
  { type: "built-in", label: ":", description: "英文冒号", id: "colon" },
  { type: "built-in", label: "，", description: "中文逗号", id: "ch-comma" },
  { type: "built-in", label: "。", description: "中文句号", id: "ch-dot" },
  { type: "built-in", label: "　", description: "全角空格", id: "full-space" },
  {
    type: "built-in",
    label: "；",
    description: "中文分号",
    id: "ch-semicolon",
  },
  { type: "built-in", label: "：", description: "中文冒号", id: "ch-colon" },
  { type: "built-in", label: "|", description: "竖线", id: "pipe" },
  { type: "built-in", label: "/", description: "斜杠", id: "slash" },
  { type: "built-in", label: "\\", description: "反斜杠", id: "backslash" },
  { type: "built-in", label: "\n", description: "换行", id: "newline" },
];
