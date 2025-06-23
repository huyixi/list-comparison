import { ref, computed, watch } from "vue";
import type { SeparatorItem, CustomSeparator } from "~/types/separators";
import { initialSeparators } from "~/types/separators";

const STORAGE_KEYS = {
  custom: "custom-separators",
  selected: "selected-separator-ids",
} as const;

const separators = ref<SeparatorItem[]>([...initialSeparators]);
const selectedSeparatorIds = ref<string[]>(initialSeparators.map((s) => s.id));
const separatorQuery = ref("");
let isInitialized = false;

export const isCustom = (s: SeparatorItem): s is CustomSeparator =>
  s.type === "custom";

export function useSeparators() {
  if (process.client && !isInitialized) {
    try {
      const { get, set } = useLocalData();
      const customSeparators = get<CustomSeparator[]>(STORAGE_KEYS.custom, []);
      const loadedSelectedIds = get<string[]>(STORAGE_KEYS.selected, []);

      separators.value = [...initialSeparators, ...customSeparators];
      selectedSeparatorIds.value =
        loadedSelectedIds.length > 0
          ? loadedSelectedIds
          : initialSeparators.map((s) => s.id);

      isInitialized = true;

      watch(
        [separators, selectedSeparatorIds],
        () => {
          const custom = separators.value.filter((s) => isCustom(s));
          set(STORAGE_KEYS.custom, custom);
          set(STORAGE_KEYS.selected, selectedSeparatorIds.value);
        },
        { deep: true },
      );
    } catch (error) {
      console.error("Error initializing separators:", error);
      separators.value = [...initialSeparators];
      selectedSeparatorIds.value = initialSeparators.map((s) => s.id);
    }
  }

  const addCustomSeparator = () => {
    const trimmed = separatorQuery.value.trim();
    if (!trimmed) return;

    const exists = separators.value.some((s) => s.label === trimmed);
    if (!exists) {
      const newId = `custom-${Date.now()}`;
      separators.value.push({
        type: "custom",
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

  const selectedSeparators = computed(() =>
    separators.value
      .filter((s) => selectedSeparatorIds.value.includes(s.id))
      .map((s) => s.label),
  );

  return {
    separators,
    selectedSeparatorIds,
    selectedSeparators,
    separatorQuery,
    isCustom,
    addCustomSeparator,
    removeCustomSeparator,
    handleSeparatorClick,
    resetSeparators,
  };
}
