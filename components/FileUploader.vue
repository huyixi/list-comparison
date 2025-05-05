<template>
    <UTooltip :text="tooltip">
        <UButton
            type="button"
            :icon="icon"
            :size="size"
            :color="color"
            :variant="variant"
            :aria-label="tooltip"
            class="hover:cursor-pointer"
            @click="openFilePicker"
            :ui="{
                base: 'gap-0.5 p-0',
            }"
        >
            导入文件
        </UButton>
    </UTooltip>

    <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        @change="handleFileChange"
    />

    <UModal
        v-model:open="isModalOpen"
        :ui="{ body: 'p-4 sm:p-4', footer: 'justify-between p-4 sm:p-4' }"
        title="导入数据"
    >
        <template #body>
            <UCard
                :ui="{
                    body: 'p-0 sm:p-0',
                }"
            >
                <UTable
                    :key="selectedSheetIndex"
                    :data="previewSheetData"
                    :columns="selectedSheetColumns"
                    :ui="{
                        table: 'table-fixed w-full',
                        th: 'p-2 max-w-[6rem] truncate whitespace-nowrap',
                        td: 'p-2 max-w-[6rem] truncate whitespace-nowrap',
                        root: 'max-h-[50vh] overflow-auto',
                        tbody: 'bg-(--ui-bg-muted) hover:cursor-not-allowed',
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
                size="sm"
            />
            <div class="flex gap-2 items-center">
                <UCheckbox
                    label="全选"
                    :model-value="selectedAllColumns"
                    size="xs"
                    @click="toggleSheetColumnsSelectAll"
                    :ui="{
                        root: 'p-1.25 hover:cursor-pointer',
                        wrapper: 'ms-1',
                    }"
                    indicator="start"
                />

                <UButton
                    color="primary"
                    variant="solid"
                    size="sm"
                    class="hover:cursor-pointer"
                    @click="importSelectedData"
                >
                    导入
                </UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup>
import { h, resolveComponent } from "vue";
import * as XLSX from "xlsx";
const UCheckbox = resolveComponent("UCheckbox");

const toast = useToast();

const props = defineProps({
    accept: {
        type: String,
        default:
            ".txt,.csv,.xlsx,text/plain,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    multiple: false,
    tooltip: { type: String, default: "上传 txt,xlsx 文件" },
    icon: { type: String, default: "i-lucide-file-up" },
    size: { type: String, default: "sm" },
    color: { type: String, default: "neutral" },
    variant: { type: String, default: "ghost" },
});

const emit = defineEmits(["file-upload"]);

const fileInput = ref(null);
const isModalOpen = ref(false);
const workbookData = ref([]);
const fileType = ref("");
const selectedSheetIndex = ref(-1);
const selectedSheetColumns = ref([]);
const selectedSheetData = ref([]);
const selectedSheetColumnSelections = ref([]);
const selectedAllColumns = ref(false);
const previewSheetData = ref([]);
const PREVIEW_ROWS = 8;
const ELLIPSIS = "…";
const openFilePicker = () => {
    fileInput.value?.click();
};

const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidFileType(file)) {
        console.warn(`不支持的文件类型: ${file.name}`);
        return;
    }

    fileType.value = file.name.split(".").pop().toLowerCase();
    const content = await parseFile(file);

    if (fileType.value === "xlsx") {
        selectedSheetIndex.value = 0;
        workbookData.value = content;
        isModalOpen.value = true;
    } else {
        emit("file-upload", content);
        resetState();
    }
};

const isValidFileType = (file) => {
    const ext = file.name.toLowerCase().split(".").pop();
    const mime = file.type;
    return (
        ["txt", "csv", "xlsx"].includes(ext) &&
        (mime.includes("text") || mime.includes("sheet") || mime === "")
    );
};

const parseFile = async (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    const result = await new Promise((resolve, reject) => {
        reader.onerror = (e) => reject(e);
        reader.onload = (e) => resolve(e.target.result);
        const readMethod = ext === "xlsx" ? "readAsArrayBuffer" : "readAsText";
        reader[readMethod](file);
    });

    if (["txt", "csv"].includes(ext)) {
        return result;
    }

    if (ext === "xlsx") {
        const workbook = XLSX.read(new Uint8Array(result), { type: "array" });
        return parseWorkbook(workbook);
    }
    throw new Error("不支持的文件格式");
};

const parseWorkbook = (workbook) => {
    return workbook.SheetNames.map((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            blankrows: false,
            defval: "",
            raw: true,
        });
        const columns = (jsonData[0] || []).map((col) =>
            (col || "").toString().trim(),
        );
        return {
            name: sheetName,
            label: sheetName,
            columns,
            data: jsonData.slice(1) || [],
        };
    });
};

const sheetOptions = computed(() => {
    return workbookData.value.map((item, index) => ({
        label: item.name,
        value: index,
    }));
});

const handleSheetColumnSelection = (col) => {
    if (selectedSheetColumnSelections.value.includes(col)) {
        selectedSheetColumnSelections.value =
            selectedSheetColumnSelections.value.filter((item) => item !== col);
    } else {
        selectedSheetColumnSelections.value.push(col);
    }

    if (
        selectedSheetColumnSelections.value.length ===
        selectedSheetColumns.value.length
    ) {
        selectedAllColumns.value = true;
    } else {
        selectedAllColumns.value = false;
    }
};

const toggleSheetColumnsSelectAll = () => {
    if (
        selectedSheetColumnSelections.value.length ===
        selectedSheetColumns.value.length
    ) {
        selectedSheetColumnSelections.value = [];
    } else {
        selectedSheetColumnSelections.value = selectedSheetColumns.value.map(
            (item, index) => index,
        );
    }
};

const updateSheetDataAndColumns = () => {
    const sheet = workbookData.value[selectedSheetIndex.value];
    if (!sheet) return;

    selectedSheetColumns.value = sheet.columns.map((col, index) => ({
        accessorKey: `col${index}`,

        header: () =>
            h(resolveComponent("UTooltip"), { text: col }, () =>
                h("div", { class: "flex items-center gap-2" }, [
                    h(UCheckbox, {
                        modelValue:
                            selectedSheetColumnSelections.value.includes(index),
                        "aria-label": `Select column ${col}`,
                        onClick: () => handleSheetColumnSelection(index),
                        ui: { root: "hover:cursor-pointer" },
                    }),
                    h("span", { class: "truncate max-w-[12rem]" }, col),
                ]),
            ),

        cell: ({ row }) =>
            h(
                resolveComponent("UTooltip"),
                { text: row.getValue(`col${index}`) },
                () =>
                    h("div", { class: "flex items-center gap-2" }, [
                        h(UCheckbox, {
                            disabled: true,
                            modelValue:
                                selectedSheetColumnSelections.value.includes(
                                    index,
                                ),
                            "aria-label": `Select row ${row.id}`,
                        }),
                        h(
                            "span",
                            { class: "truncate max-w-[12rem]" },
                            row.getValue(`col${index}`),
                        ),
                    ]),
            ),
    }));

    selectedSheetData.value = sheet.data.map((row) =>
        sheet.columns.reduce((acc, _c, idx) => {
            acc[`col${idx}`] = row[idx];
            return acc;
        }, {}),
    );

    const preview = selectedSheetData.value.slice(0, PREVIEW_ROWS);

    if (selectedSheetData.value.length > PREVIEW_ROWS) {
        const ellipsisRow = sheet.columns.reduce((acc, _c, idx) => {
            acc[`col${idx}`] = "…";
            return acc;
        }, {});
        preview.push(ellipsisRow);
    }

    previewSheetData.value = preview;
};
watch(
    () => selectedSheetIndex.value,
    () => {
        updateSheetDataAndColumns();
    },
    { immediate: true },
);

const importSelectedData = () => {
    const sheet = workbookData.value[selectedSheetIndex.value];
    const selectedColumns = selectedSheetColumnSelections.value;

    if (!sheet || selectedColumns.length === 0) {
        toast.add({ title: "请选择需要导入的列！", color: "warning" });
        return;
    }

    const importedData = sheet.data.map((row) =>
        selectedColumns.map((colIndex) => row[colIndex]),
    );

    const result = importedData.map((item) => item.join(",")).join(",");

    emit("file-upload", result);
    toast.add({
        title: `导入成功！共导入 ${importedData.length} 条记录`,
        color: "success",
    });

    isModalOpen.value = false;
    resetState();
};

watch(isModalOpen, (newValue) => {
    if (!newValue) resetState();
});

const resetState = () => {
    workbookData.value = [];
    selectedSheetIndex.value = -1;
    selectedSheetColumns.value = [];
    selectedSheetData.value = [];
    selectedSheetColumnSelections.value = [];
    selectedAllColumns.value = false;
    fileInput.value.value = null;
};
</script>
