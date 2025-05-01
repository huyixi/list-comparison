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
        />
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
        :ui="{ footer: 'justify-between' }"
        title="导入数据"
    >
        <template #body>
            <UTable
                :key="selectedSheetIndex"
                :data="selectedSheetData"
                :columns="selectedSheetColumns"
            >
            </UTable>
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
                    variant="card"
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
    tooltip: { type: String, default: "上传文件" },
    icon: { type: String, default: "i-lucide-file-up" },
    size: { type: String, default: "xs" },
    color: { type: String, default: "neutral" },
    variant: { type: String, default: "outline" },
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
    const selectedSheetAllData = workbookData.value[selectedSheetIndex.value];
    if (!selectedSheetAllData) return;

    selectedSheetColumns.value = selectedSheetAllData.columns.map(
        (col, index) => ({
            accessorKey: `col${index}`,
            header: () =>
                h("div", { class: "flex items-center gap-2" }, [
                    h(UCheckbox, {
                        modelValue:
                            selectedSheetColumnSelections.value.includes(index),
                        "aria-label": `Select column ${col}`,
                        onClick: () => handleSheetColumnSelection(index),
                    }),
                    h("span", col),
                ]),
            cell: ({ row }) => {
                return h("div", { class: "flex items-center gap-2" }, [
                    h(UCheckbox, {
                        disabled: true,
                        modelValue:
                            selectedSheetColumnSelections.value.includes(index),
                        "aria-label": `Select row ${row.id}`,
                    }),
                    h("span", row.getValue(`col${index}`)),
                ]);
            },
        }),
    );

    selectedSheetData.value = selectedSheetAllData.data.map((item) =>
        selectedSheetAllData.columns.reduce((row, col, index) => {
            row[`col${index}`] = item[index];
            return row;
        }, {}),
    );

    console.log(
        "selectedSheetData",
        selectedSheetData.value,
        typeof selectedSheetData.value,
        "selectedSheetColumns",
        selectedSheetColumns.value,
    );
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
    console.log("selectedColumns", selectedColumns, "sheet", sheet);

    if (!sheet || selectedColumns.length === 0) {
        toast.add({ title: "请选择需要导入的列！", color: "warning" });
        return;
    }

    const importedData = sheet.data.map((row) =>
        selectedColumns.map((colIndex) => row[colIndex]),
    );

    const result = importedData
        .map((item) => item.join(",")) // 将每个数组 ['name', 'city'] 转换为 'name,city'
        .join(",");
    console.log("importedData", typeof importedData.value, importedData);

    emit("file-upload", result);
    console.log("result", result);
    toast.add({
        title: `导入成功！共导入 ${importedData.length} 条记录`,
        color: "success",
    });

    isModalOpen.value = false;
    resetState();
};

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
