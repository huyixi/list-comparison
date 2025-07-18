export function compareLists(
  listA: string[],
  listB: string[],
): { onlyInA: string[]; onlyInB: string[]; inBoth: string[] } {
  const onlyInA = listA.filter((item) => !listB.includes(item));
  const onlyInB = listB.filter((item) => !listA.includes(item));
  const inBoth = listA.filter((item) => listB.includes(item));
  return { onlyInA, onlyInB, inBoth };
}
