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
            />
            <div class="flex gap-2 items-center">
                <!-- <UCheckbox
                    label="全选"
                    :model-value="isAllSelected"
                    @update:model-value="toggleSelectAll"
                /> -->

                <!-- <UButton
                    color="primary"
                    variant="solid"
                    size="sm"
                    @click="importSelectedData"
                >
                    导入
                </UButton> -->
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
const selectedColumns = ref({});
const selectCurrentColumnAll = ref(false);

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

const updateSheetDataAndColumns = () => {
    const selectedSheetAllData = workbookData.value[selectedSheetIndex.value];
    if (!selectedSheetAllData) return;

    selectedSheetColumns.value = selectedSheetAllData.columns.map(
        (col, index) => ({
            accessorKey: `col${index}`,
            header: () =>
                h("div", { class: "flex items-center gap-2" }, [
                    h(UCheckbox),
                    h("span", col),
                ]),
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

// const importSelectedData = () => {
//     const sheet = currentSheet.value;
//     const selected = selectedColumns.value;

//     if (!sheet || selected.length === 0) {
//         toast.add({ title: "请选择需要导入的列！", color: "warning" });
//         return;
//     }

//     const columnIndexes = selected
//         .map((col) => sheet.columns.indexOf(col))
//         .filter((idx) => idx !== -1);

//     if (columnIndexes.length === 0) {
//         toast.add({
//             title: "选中的列不存在于原数据中，请检查！",
//             color: "error",
//         });
//         return;
//     }

//     const importedData = sheet.data.map((row) =>
//         columnIndexes.map((i) => row[i]),
//     );

//     emit("file-upload", importedData);
//     toast.add({
//         title: `导入成功！共导入 ${importedData.length} 条记录`,
//         color: "success",
//     });

//     isModalOpen.value = false;
//     resetState();
// };

const resetState = () => {
    workbookData.value = [];
    selectedSheetIndex.value = -1;
};
</script>
