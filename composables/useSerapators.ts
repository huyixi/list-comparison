import { ref, computed } from "vue";
import type { SeparatorItem, CustomSeparator } from "@/types/index";
import { initialSeparators } from "@/types/index";

const separators = ref<SeparatorItem[]>([...initialSeparators]);
const selectedSeparatorIds = ref<string[]>(initialSeparators.map((s) => s.id));
const separatorQuery = ref("");

const isCustom = (s: SeparatorItem): s is CustomSeparator =>
  s.id.startsWith("custom-");

const addCustomSeparator = () => {
  const trimmed = separatorQuery.value.trim();
  if (!trimmed) return;

  const exists = separators.value.some((s) => s.label === trimmed);
  if (!exists) {
    const newId = `custom-${Date.now()}`;
    separators.value.push({
      label: trimmed,
      description: "Custom Separator",
      id: newId,
    });

    selectedSeparatorIds.value.push(newId);
  }
  separatorQuery.value = "";
};

const removeCustomSeparator = (separator: SeparatorItem) => {
  if (!isCustom(separator)) return;

  separators.value = separators.value.filter((s) => s.id !== separator.id);
  selectedSeparatorIds.value = selectedSeparatorIds.value.filter(
    (id) => id !== separator.id,
  );
};

const handleSeparatorClick = (separator: SeparatorItem) => {
  const idx = selectedSeparatorIds.value.indexOf(separator.id);
  if (idx !== -1) {
    selectedSeparatorIds.value.splice(idx, 1);
  } else {
    selectedSeparatorIds.value.push(separator.id);
  }
};

const resetSeparators = () => {
  separators.value = [...initialSeparators];
  selectedSeparatorIds.value = initialSeparators.map((s) => s.id);
};

const selectedSeparatorLabels = computed(() =>
  separators.value
    .filter((s) => selectedSeparatorIds.value.includes(s.id))
    .map((s) => s.label),
);

export function useSeparators() {
  return {
    separators,
    selectedSeparatorIds,
    selectedSeparatorLabels,
    separatorQuery,

    isCustom,
    addCustomSeparator,
    removeCustomSeparator,
    handleSeparatorClick,
    resetSeparators,
  };
}
