// utils/imageLayout.ts
export type GridLayoutItem = {
  colSpan: number;
  rowSpan: number;
};

export function getImageLayout(index: number, total: number): GridLayoutItem {
  const layouts: Record<number, GridLayoutItem[]> = {
    1: [{ colSpan: 1, rowSpan: 1 }],
    2: [
      { colSpan: 1, rowSpan: 2 },
      { colSpan: 1, rowSpan: 2 },
    ],
    3: [
      { colSpan: 1, rowSpan: 2 },
      { colSpan: 1, rowSpan: 1 },
      { colSpan: 1, rowSpan: 1 },
    ],
    4: Array.from({ length: 4 }, () => ({ colSpan: 1, rowSpan: 1 })),
    5: [
      { colSpan: 2, rowSpan: 2 },
      { colSpan: 1, rowSpan: 2 },
      ...Array.from({ length: 3 }, () => ({ colSpan: 1, rowSpan: 1 })),
    ],
    6: [
      { colSpan: 2, rowSpan: 2 },
      ...Array.from({ length: 4 }, () => ({ colSpan: 1, rowSpan: 1 })),
    ],
    7: [
      { colSpan: 1, rowSpan: 2 },
      { colSpan: 1, rowSpan: 2 },
      ...Array.from({ length: 5 }, () => ({ colSpan: 1, rowSpan: 1 })),
    ],
    8: [
      { colSpan: 1, rowSpan: 2 },
      ...Array.from({ length: 7 }, () => ({ colSpan: 1, rowSpan: 1 })),
    ],
    9: Array.from({ length: 9 }, () => ({ colSpan: 1, rowSpan: 1 })),
  };

  const layout = layouts[total] || [];
  console.log(index, total, layout[index] || { colSpan: 1, rowSpan: 1 });
  return layout[index] || { colSpan: 1, rowSpan: 1 };
}
