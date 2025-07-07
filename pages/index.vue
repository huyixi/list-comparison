<template>
    <UContainer class="py-8">
        <AppHeader />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ListInput
                v-model="listA"
                ref="listARef"
                title="列表 A"
                :total-count="listAInfo.totalEnteredCount"
                @clipboard-paste="(content) => handlePaste('A', content)"
                @file-upload="
                    (fileContent) => handleFileUpload('A', fileContent)
                "
            >
                <template #stats>
                    <StatPopover
                        title="个有效项"
                        :count="listAInfo.allUniqueNames.length"
                        :items="listAInfo.allUniqueNames"
                        status="green"
                        :show-copy="true"
                        @copy="copyToClipboard(listAInfo.allUniqueNames, 'A')"
                        :copied="listACopied"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listAInfo.duplicateInfoCount"
                        :items="listAInfo.duplicates"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `[${item.count} 次]${item.name}`
                        "
                        @clean="removeDuplicateItems('A')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listAInfo.invalidCount"
                        :items="listAInfo.invalidNames"
                        status="red"
                        :show-clean="true"
                        @clean="removeInvalidItems('A')"
                    />
                </template>
            </ListInput>

            <ListInput
                v-model="listB"
                title="列表 B"
                ref="listBRef"
                :total-count="listBInfo.totalEnteredCount"
                @clipboard-paste="(event) => handlePaste('B', event)"
                @file-upload="
                    (fileContent) => handleFileUpload('B', fileContent)
                "
            >
                <template #stats>
                    <StatPopover
                        title="个有效项"
                        :count="listBInfo.allUniqueNames.length"
                        :items="listBInfo.allUniqueNames"
                        status="green"
                        :show-copy="true"
                        @copy="copyToClipboard(listBInfo.allUniqueNames, 'B')"
                        :copied="listBCopied"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listBInfo.duplicateInfoCount"
                        :items="listBInfo.duplicates"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `[${item.count} 次]${item.name}`
                        "
                        @clean="removeDuplicateItems('B')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listBInfo.invalidCount"
                        :items="listBInfo.invalidNames"
                        status="red"
                        :show-clean="true"
                        @clean="removeInvalidItems('B')"
                    />
                </template>
            </ListInput>
        </div>

        <EmptyState v-if="!showResults" />

        <div
            v-if="showResults"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
            <ComparisonResult
                title="仅在列表 A"
                :items="onlyInA"
                empty-text="列表 A 中没有独有条目。"
                suffix="独有"
            />
            <ComparisonResult
                title="同时存在于 A 和 B"
                :items="inBoth"
                empty-text="A 和 B 中没有共同条目。"
                suffix="共有"
            />
            <ComparisonResult
                title="仅在列表 B"
                :items="onlyInB"
                empty-text="列表 B 中没有独有条目。"
                suffix="独有"
            />
        </div>

        <div v-if="showResults" class="text-center my-6">
            <UButton
                @click="exportResults"
                icon="i-lucide-download"
                color="primary"
                variant="subtle"
                class="px-4 py-2 hover:cursor-pointer"
            >
                导出结果
            </UButton>
        </div>
    </UContainer>
</template>

<script setup>
import {
    parseList,
    getItemsFromString,
    isConsideredInvalid,
} from "@/utils/listUtils";
import { exportResultsToFile } from "@/utils/exportUtils";

const toast = useToast();

const listA = ref("");
const listB = ref("");
const listARef = ref(null);
const listBRef = ref(null);
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);
const listACopied = ref(false);
const listBCopied = ref(false);

const handlePaste = (targetList, content) => {
    const listInputRef = targetList === "A" ? listARef : listBRef;
    listInputRef.value?.focusTextarea();

    const currentValue = targetList === "A" ? listA.value : listB.value;

    const separator = currentValue && !currentValue.endsWith("\n") ? "\n" : "";

    if (targetList === "A") {
        listA.value = `${currentValue}${separator}${content}`;
    } else {
        listB.value = `${currentValue}${separator}${content}`;
    }
};

const handleFileUpload = (listType, fileContent) => {
    if (listType === "A") {
        listA.value = listA.value
            ? listA.value + "\n" + fileContent
            : fileContent;
    } else {
        listB.value = listB.value
            ? listB.value + "\n" + fileContent
            : fileContent;
    }
};

const separators = useSeparators().selectedSeparators;
const listAInfo = computed(() => parseList(listA.value, separators.value));
const listBInfo = computed(() => parseList(listB.value, separators.value));

const compareNames = () => {
    const namesA = listAInfo.value.allNames;
    const namesB = listBInfo.value.allNames;

    onlyInA.value = [];
    onlyInB.value = [];
    inBoth.value = [];

    if (namesA.length === 0 && namesB.length === 0) {
        showResults.value = false;
        return;
    }

    const setA = new Set(namesA);
    const setB = new Set(namesB);

    onlyInA.value = [...setA].filter((name) => !setB.has(name)).sort();
    onlyInB.value = [...setB].filter((name) => !setA.has(name)).sort();
    inBoth.value = [...setA].filter((name) => setB.has(name)).sort();

    showResults.value = true;
};

const exportResults = () => {
    const sections = [];

    if (onlyInA.value.length > 0) {
        sections.push({
            title: "--- 仅在列表 A 中存在的条目 ---",
            content: onlyInA.value.join("\n"),
        });
    }

    if (onlyInB.value.length > 0) {
        sections.push({
            title: "--- 仅在列表 B 中存在的条目 ---",
            content: onlyInB.value.join("\n"),
        });
    }

    if (inBoth.value.length > 0) {
        sections.push({
            title: "--- 同时存在于列表 A 和 B 中的条目 ---",
            content: inBoth.value.join("\n"),
        });
    }

    if (listAInfo.value.duplicates.length > 0) {
        const duplicateContent = listAInfo.value.duplicates
            .map((item) => `${item.name} (出现 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 列表 A 中的重复条目 ---",
            content: duplicateContent,
        });
    }

    if (listBInfo.value.duplicates.length > 0) {
        const duplicateContent = listBInfo.value.duplicates
            .map((item) => `${item.name} (出现 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 列表 B 中的重复条目 ---",
            content: duplicateContent,
        });
    }

    if (listAInfo.value.invalidNames.length > 0) {
        sections.push({
            title: "--- 列表 A 中检测到的特殊格式或空条目 (仅提示) ---",
            content: listAInfo.value.invalidNames.join("\n"),
        });
    }

    if (listBInfo.value.invalidNames.length > 0) {
        sections.push({
            title: "--- 列表 B 中检测到的特殊格式或空条目 (仅提示) ---",
            content: listBInfo.value.invalidNames.join("\n"),
        });
    }

    if (sections.length === 0) {
        toast.add({
            title: "没有可导出的内容",
            description: "没有发现任何可导出的结果",
            color: "blue",
            icon: "i-lucide-circle-alert",
        });
        return;
    }

    exportResultsToFile(sections);
};

const removeDuplicateItems = (listType) => {
    const info = listType === "A" ? listAInfo.value : listBInfo.value;
    const currentRef = listType === "A" ? listA : listB;

    if (!info.duplicates.length) {
        toast.add({
            title: `列表 ${listType} 中没有重复项`,
            icon: "i-lucide-circle-alert",
            color: "blue",
        });
        return;
    }

    currentRef.value = info.allUniqueNames.join("\n");

    toast.add({
        title: `列表 ${listType} 的重复项已移除`,
        icon: "i-lucide-check-circle",
        color: "green",
    });
};

const removeInvalidItems = (listType) => {
    const info = listType === "A" ? listAInfo.value : listBInfo.value;
    const currentRef = listType === "A" ? listA : listB;

    if (!info.invalidNames.length) {
        toast.add({
            title: `列表 ${listType} 中没有无效项`,
            icon: "i-lucide-circle-alert",
            color: "blue",
        });
        return;
    }

    const validItems = info.allNames.filter(
        (item) => !info.invalidNames.includes(item),
    );

    currentRef.value = validItems.join("\n");

    toast.add({
        title: `列表 ${listType} 的无效项已移除`,
        icon: "i-lucide-check-circle",
        color: "green",
    });
};

watch(
    [listA, listB],
    () => {
        compareNames();
    },
    { immediate: false },
);
</script>
