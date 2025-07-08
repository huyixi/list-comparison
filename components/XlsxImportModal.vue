<template>
    <UModal
        :ui="{ body: 'p-4 sm:p-4', footer: 'justify-between p-4 sm:p-4' }"
        title="导入数据"
    >
        <template #body>
            <UCard
                :ui="{
                    root: 'overflow-hidden',
                    body: 'p-0 sm:p-0 ',
                }"
            >
                <UTable
                    :key="selectedSheetIndex"
                    :data="previewSheetData"
                    :columns="selectedSheetColumns"
                    :ui="{
                        root: 'max-h-[50vh] overflow-auto',
                        tbody: 'bg-(--ui-bg-muted) hover:cursor-not-allowed',
                        th: 'p-2 max-w-[6rem] truncate whitespace-nowrap',
                        td: 'p-2 max-w-[6rem] truncate whitespace-nowrap',
                    }"
                >
                </UTable>
            </UCard>
        </template>
        <template #footer>
            <USelect
                v-model="selectedSheetIndex"
                :items="sheetOptions"
                placeholder="请选择Sheet"
                class="w-24"
                size="md"
            />
            <div class="flex gap-2 items-center">
                <UCheckbox
                    label="全选"
                    :model-value="selectedAllColumns"
                    size="md"
                    @click="toggleSheetColumnsSelectAll"
                    :ui="{
                        root: 'p-2 hover:cursor-pointer',
                        base: 'size-4 hover:cursor-pointer',
                        wrapper: 'ms-1 hover:cursor-pointer',
                        label: 'hover:cursor-pointer',
                    }"
                />

                <UButton
                    color="primary"
                    variant="solid"
                    size="md"
                    class="px-4"
                    @click="importSelectedData"
                >
                    导入
                </UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { Sheet } from "~/types/sheet";

const UCheckbox = resolveComponent("UCheckbox");

const props = defineProps<{
    workbookData: Sheet[];
}>();

const emit = defineEmits(["import-data"]);

const toast = useToast();

const selectedSheetIndex = ref(0);
const selectedSheetColumns = ref<any[]>([]);
const selectedSheetData = ref<any[]>([]);
const selectedSheetColumnSelections = ref<any[]>([]);
const selectedAllColumns = ref(false);
const previewSheetData = ref<any[]>([]);

const PREVIEW_ROWS = 8;

const sheetOptions = computed(() => {
    return props.workbookData.map((item, index) => ({
        label: item.name,
        value: index,
    }));
});

const handleSheetColumnSelection = (col: number) => {
    if (selectedSheetColumnSelections.value.includes(col)) {
        selectedSheetColumnSelections.value =
            selectedSheetColumnSelections.value.filter((item) => item !== col);
    } else {
        selectedSheetColumnSelections.value.push(col);
    }

    selectedAllColumns.value =
        selectedSheetColumnSelections.value.length ===
        selectedSheetColumns.value.length;
};

const toggleSheetColumnsSelectAll = () => {
    if (
        selectedSheetColumnSelections.value.length ===
        selectedSheetColumns.value.length
    ) {
        selectedSheetColumnSelections.value = [];
    } else {
        selectedSheetColumnSelections.value = selectedSheetColumns.value.map(
            (_, index) => index,
        );
    }
    selectedAllColumns.value = !selectedAllColumns.value;
};

const updateSheetDataAndColumns = () => {
    const sheet = props.workbookData[selectedSheetIndex.value];
    if (!sheet) return;

    selectedSheetColumns.value = sheet.columns.map((col, index) => ({
        accessorKey: `col${index}`,
        header: () =>
            h(resolveComponent("UTooltip"), { text: String(col) }, () =>
                h(
                    "div",
                    {
                        class: "flex items-center gap-2 hover:cursor-pointer",
                        onClick: () => handleSheetColumnSelection(index),
                    },
                    [
                        h(UCheckbox, {
                            modelValue:
                                selectedSheetColumnSelections.value.includes(
                                    index,
                                ),
                            "aria-label": `Select column ${col}`,
                        }),
                        h("span", { class: "truncate max-w-[12rem]" }, col),
                    ],
                ),
            ),
        cell: ({ row }: { row: any }) => {
            const value = row.getValue(`col${index}`);
            const isSelected =
                selectedSheetColumnSelections.value.includes(index);

            return h(
                resolveComponent("UTooltip"),
                { text: String(value) },
                () =>
                    h("div", { class: "flex items-center gap-2" }, [
                        h(UCheckbox, {
                            disabled: true,
                            modelValue: isSelected,
                            "aria-label": `Select row ${row.id}`,
                            class: !isSelected ? "opacity-50" : "",
                        }),
                        h(
                            "span",
                            { class: "truncate max-w-[12rem]" },
                            String(value),
                        ),
                    ]),
            );
        },
    }));

    selectedSheetData.value = sheet.data.map((row) =>
        sheet.columns.reduce(
            (acc, _c, idx) => {
                acc[`col${idx}`] = row[idx];
                return acc;
            },
            {} as Record<string, any>,
        ),
    );

    const preview = selectedSheetData.value.slice(0, PREVIEW_ROWS);

    if (selectedSheetData.value.length > PREVIEW_ROWS) {
        const ellipsisRow = sheet.columns.reduce(
            (acc, _c, idx) => {
                acc[`col${idx}`] = "…";
                return acc;
            },
            {} as Record<string, any>,
        );
        preview.push(ellipsisRow);
    }

    previewSheetData.value = preview;
};

watch(
    selectedSheetIndex,
    () => {
        selectedSheetColumnSelections.value = [];
        selectedAllColumns.value = false;
        updateSheetDataAndColumns();
    },
    { immediate: true },
);

watch(
    () => props.workbookData,
    (newVal) => {
        if (newVal && newVal.length > 0) {
            selectedSheetIndex.value = 0;
            selectedSheetColumnSelections.value = [];
            selectedAllColumns.value = false;
            updateSheetDataAndColumns();
        }
    },
    { immediate: true },
);

const importSelectedData = () => {
    const sheet = props.workbookData[selectedSheetIndex.value];
    const selectedColumns = selectedSheetColumnSelections.value;

    if (!sheet || selectedColumns.length === 0) {
        toast.add({
            title: "未选择任何数据",
            description: "请从表格中选择你想导入的列。",
            color: "warning",
        });
        return;
    }
    const importedData = sheet.data.map((row) =>
        selectedColumns.map((colIndex) => row[colIndex]),
    );

    const result = importedData.map((item) => item.join(",")).join("\n");

    emit("import-data", result);
};
</script>
