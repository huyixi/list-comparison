<template>
    <UContainer class="py-8">
        <CustomSeperator />
        <AppHeader />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ListInput
                v-model="listA"
                ref="listARef"
                title="名单 A"
                :total-count="listAInfo.totalEnteredCount"
                @clipboard-paste="(content) => handlePaste('A', content)"
                @file-upload="
                    (fileContent) => handleFileUpload('A', fileContent)
                "
            >
                <template #stats>
                    <StatPopover
                        title="条有效条目"
                        :count="listAInfo.allUniqueNames.length"
                        :items="listAInfo.allUniqueNames"
                        status="green"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listAInfo.duplicateInfoCount"
                        :items="listAInfo.duplicates"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `${item.name} (重复 ${item.count} 次)`
                        "
                        @clean="removeDuplicates('A')"
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
                title="名单 B"
                ref="listBRef"
                :total-count="listBInfo.totalEnteredCount"
                @clipboard-paste="(event) => handlePaste('B', event)"
                @file-upload="
                    (fileContent) => handleFileUpload('B', fileContent)
                "
            >
                <template #stats>
                    <StatPopover
                        title="条有效条目"
                        :count="listBInfo.allUniqueNames.length"
                        :items="listBInfo.allUniqueNames"
                        status="green"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listBInfo.duplicateInfoCount"
                        :items="listBInfo.duplicates"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `${item.name} (重复 ${item.count} 次)`
                        "
                        @clean="removeDuplicates('B')"
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
                title="仅在名单 A"
                :items="onlyInA"
                empty-text="名单 A 中没有独有条目。"
                suffix="独有"
            />
            <ComparisonResult
                title="同时存在于 A 和 B"
                :items="inBoth"
                empty-text="A 和 B 中没有共同条目。"
                suffix="共有"
            />
            <ComparisonResult
                title="仅在名单 B"
                :items="onlyInB"
                empty-text="名单 B 中没有独有条目。"
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
import { ref, watch, computed } from "vue";

const toast = useToast();

const listA = ref("");
const listB = ref("");
const listARef = ref(null);
const listBRef = ref(null);
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

const getItemsFromString = (text) => {
    if (!text || typeof text !== "string" || !text.trim()) {
        return [];
    }
    return text
        .split(/[\n,.;、，。；\t ]+/)
        .map((name) => name.trim())
        .filter((name) => name !== "");
};

const isConsideredInvalid = (name) => {
    if (!name || typeof name !== "string") return true;
    const trimmedName = name.trim();
    if (trimmedName === "") return true;
    const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
    return !validCharPattern.test(trimmedName);
};

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

const parseNameList = (text) => {
    const result = {};
    const items = getItemsFromString(text);
    result.totalEnteredCount = items.length;
    result.allNames = items;
    const nameCountMap = {};
    const allNamesSet = new Set();
    const tempInvalidNames = [];
    items.forEach((name) => {
        if (isConsideredInvalid(name)) {
            tempInvalidNames.push(name);
        }
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
        allNamesSet.add(name);
    });
    result.allUniqueNames = Array.from(allNamesSet).sort();
    result.invalidNames = tempInvalidNames;
    result.invalidCount = result.invalidNames.length;
    const duplicateEntries = Object.entries(nameCountMap)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    result.duplicates = duplicateEntries;

    result.duplicateInfoCount = duplicateEntries.reduce(
        (sum, { count }) => sum + count,
        0,
    );
    return result;
};

const listAInfo = computed(() => parseNameList(listA.value));
const listBInfo = computed(() => parseNameList(listB.value));

const compareNames = () => {
    const namesA = listAInfo.value.allNames;
    const namesB = listBInfo.value.allNames;

    onlyInA.value = [];
    onlyInB.value = [];
    inBoth.value = [];

    if (namesA.length === 0 || namesB.length === 0) {
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
            title: "--- 仅在名单 A 中存在的条目 ---",
            content: onlyInA.value.join("\n"),
        });
    }

    if (inBoth.value.length > 0) {
        sections.push({
            title: "--- 同时存在于名单 A 和 B 中的条目 ---",
            content: inBoth.value.join("\n"),
        });
    }

    if (onlyInB.value.length > 0) {
        sections.push({
            title: "--- 仅在名单 B 中存在的条目 ---",
            content: onlyInB.value.join("\n"),
        });
    }

    if (listAInfo.value.duplicates.length > 0) {
        const duplicateContent = listAInfo.value.duplicates
            .map((item) => `${item.name} (出现 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 名单 A 中的重复条目 ---",
            content: duplicateContent,
        });
    }

    if (listBInfo.value.duplicates.length > 0) {
        const duplicateContent = listBInfo.value.duplicates
            .map((item) => `${item.name} (出现 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 名单 B 中的重复条目 ---",
            content: duplicateContent,
        });
    }

    if (listAInfo.value.invalidNames.length > 0) {
        sections.push({
            title: "--- 名单 A 中检测到的特殊格式或空条目 (仅提示) ---",
            content: listAInfo.value.invalidNames.join("\n"),
        });
    }

    if (listBInfo.value.invalidNames.length > 0) {
        sections.push({
            title: "--- 名单 B 中检测到的特殊格式或空条目 (仅提示) ---",
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

    const content = sections
        .map((section) => `${section.title}\n${section.content}`)
        .join("\n\n\n");

    try {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const timestamp = new Date()
            .toISOString()
            .slice(0, 16)
            .replace("T", "_")
            .replace(":", "-");
        link.download = `比对结果_${timestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.add({
            title: "导出成功",
            icon: "i-lucide-circle-check",
            color: "green",
            timeout: 2000,
        });
    } catch (error) {
        console.error("导出失败:", error);
        toast.add({
            title: "导出失败",
            description: "无法生成下载文件",
            color: "red",
            icon: "i-lucide-circle-alert",
        });
    }
};

const removeDuplicates = (listType) => {
    let currentListRef = listType === "A" ? listA : listB;
    let listInfo = listType === "A" ? listAInfo.value : listBInfo.value;

    if (!currentListRef || !listInfo) return;

    if (listInfo.duplicateInfoCount === 0) {
        toast.add({
            title: `名单 ${listType} 中没有检测到重复项`,
            color: "blue",
            icon: "i-lucide-circle-alert",
        });
        return;
    }

    const items = getItemsFromString(currentListRef.value);
    if (items.length === 0) return;

    const uniqueItemsSet = new Set(items);
    const uniqueItemsArray = Array.from(uniqueItemsSet).sort();
    currentListRef.value = uniqueItemsArray.join("\n");

    toast.add({
        title: `名单 ${listType} 的重复项已移除`,
        icon: "i-lucide-circle-alert",
        color: "green",
    });
};

const removeInvalidItems = (listType) => {
    let currentListRef = listType === "A" ? listA : listB;
    let listInfo = listType === "A" ? listAInfo.value : listBInfo.value;

    if (!currentListRef || !listInfo) return;

    if (listInfo.invalidCount === 0) {
        toast.add({
            title: `名单 ${listType} 中没有检测到特殊格式项`,
            color: "blue",
            icon: "i-lucide-circle-alert",
        });
        return;
    }

    const items = getItemsFromString(currentListRef.value);
    if (items.length === 0) return;

    const validItems = items.filter((item) => !isConsideredInvalid(item));

    const sortedValidItems = validItems.sort();

    currentListRef.value = sortedValidItems.join("\n");

    toast.add({
        title: `名单 ${listType} 的特殊格式项已移除`,
        icon: "i-lucide-circle-alert",
        color: "green",
    });
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

watch(
    [listA, listB],
    () => {
        compareNames();
    },
    { immediate: false },
);
</script>
