<script setup lang="ts">
import { exportResultsToFile } from "@/utils/export";
import { useImage } from "~/composables/useImage";

const listARef = ref(null);
const listBRef = ref(null);
const showResults = ref(true);

const { input: inputA, appendInput: appendTextA } = useInput();
const { input: inputB, appendInput: appendTextB } = useInput();

const { selectedSeparators } = useSeparators();

const listAInfo = computed(() =>
    parseText(inputA.value, selectedSeparators.value),
);
const listBInfo = computed(() =>
    parseText(inputB.value, selectedSeparators.value),
);

const comparedResult = computed(() =>
    compareLists(listAInfo.value.rawItems, listBInfo.value.rawItems),
);

const appendText = (target: "A" | "B", text: string) => {
    console.log("appendText", target);
    if (target === "A") appendTextA(text);
    else appendTextB(text);
};
provide("appendText", appendText);

const toast = useToast();
const clipboard = useClipboard();

const validListACopied = ref(false);
const validListBCopied = ref(false);

const handleCopy = (content) => {
    clipboard.writeText(content);
};

// const exportResults = () => {
//     const sections = [];

//     if (onlyInA.value.length > 0) {
//         sections.push({
//             title: "--- 仅在列表 A 中存在的条目 ---",
//             content: onlyInA.value.join("\n"),
//         });
//     }

//     if (onlyInB.value.length > 0) {
//         sections.push({
//             title: "--- 仅在列表 B 中存在的条目 ---",
//             content: onlyInB.value.join("\n"),
//         });
//     }

//     if (inBoth.value.length > 0) {
//         sections.push({
//             title: "--- 同时存在于列表 A 和 B 中的条目 ---",
//             content: inBoth.value.join("\n"),
//         });
//     }

//     if (listAInfo.value.duplicates.length > 0) {
//         const duplicateContent = listAInfo.value.duplicates
//             .map((item) => `${item.name} (出现 ${item.count} 次)`)
//             .join("\n");

//         sections.push({
//             title: "--- 列表 A 中的重复条目 ---",
//             content: duplicateContent,
//         });
//     }

//     if (listBInfo.value.duplicates.length > 0) {
//         const duplicateContent = listBInfo.value.duplicates
//             .map((item) => `${item.name} (出现 ${item.count} 次)`)
//             .join("\n");

//         sections.push({
//             title: "--- 列表 B 中的重复条目 ---",
//             content: duplicateContent,
//         });
//     }

//     if (listAInfo.value.invalidNames.length > 0) {
//         sections.push({
//             title: "--- 列表 A 中检测到的特殊格式或空条目 (仅提示) ---",
//             content: listAInfo.value.invalidNames.join("\n"),
//         });
//     }

//     if (listBInfo.value.invalidNames.length > 0) {
//         sections.push({
//             title: "--- 列表 B 中检测到的特殊格式或空条目 (仅提示) ---",
//             content: listBInfo.value.invalidNames.join("\n"),
//         });
//     }

//     if (sections.length === 0) {
//         toast.add({
//             title: "没有可导出的内容",
//             description: "没有发现任何可导出的结果",
//             color: "warning",
//             icon: "i-lucide-circle-alert",
//         });
//         return;
//     }

//     exportResultsToFile(sections);
// };

// const removeDuplicateItems = (listType) => {
//     const info = listType === "A" ? listAInfo.value : listBInfo.value;
//     const currentRef = listType === "A" ? listA : listB;

//     if (!info.duplicates.length) {
//         toast.add({
//             title: `列表 ${listType} 中没有重复项`,
//             icon: "i-lucide-circle-alert",
//         });
//         return;
//     }

//     currentRef.value = info.orderedUniqueNames.join("\n");

//     toast.add({
//         title: `列表 ${listType} 的重复项已移除`,
//         icon: "i-lucide-list-check",
//         color: "neutral",
//     });
// };

// const removeInvalidItems = (listType) => {
//     const info = listType === "A" ? listAInfo.value : listBInfo.value;
//     const currentRef = listType === "A" ? listA : listB;

//     if (!info.invalidNames.length) {
//         toast.add({
//             title: `列表 ${listType} 中没有无效项`,
//             icon: "i-lucide-circle-alert",
//             color: "neutral",
//         });
//         return;
//     }

//     const validItems = info.allNames.filter(
//         (item) => !info.invalidNames.includes(item),
//     );

//     currentRef.value = validItems.join("\n");

//     toast.add({
//         title: `列表 ${listType} 的无效项已移除`,
//         icon: "i-lucide-list-check",
//         color: "neutral",
//     });
// };
</script>

<template>
    <UContainer class="py-8">
        <AppHeader />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ListInput
                title="列表 A"
                target="A"
                ref="listARef"
                v-model="inputA"
                :total-count="listAInfo.rawItemsCount"
            >
                <template #stats>
                    <StatPopover
                        title="个有效项"
                        :count="listAInfo.validItemsCount"
                        :items="listAInfo.validItems"
                        status="green"
                        :show-copy="true"
                        @copy="handleCopy(listAInfo.validItems.join('\n'))"
                        :copied="validListACopied"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listAInfo.duplicateItemsCount"
                        :items="listAInfo.duplicateItems"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `[${item.count} 次]${item.name}`
                        "
                        @clean="removeDuplicateItems('A')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listAInfo.invalidItemsCount"
                        :items="listAInfo.invalidItems"
                        status="red"
                        :show-clean="true"
                        @clean="removeInvalidItems('A')"
                    />
                </template>
            </ListInput>

            <ListInput
                v-model="inputB"
                target="B"
                title="列表 B"
                ref="listBRef"
                :total-count="listBInfo.rawItemsCount"
            >
                <template #stats>
                    <StatPopover
                        title="个有效项"
                        :count="listBInfo.validItemsCount"
                        :items="listBInfo.validItems"
                        status="green"
                        :show-copy="true"
                        @copy="handleCopy(listBInfo.validItems.join('\n'))"
                        :copied="validListACopied"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listBInfo.duplicateItemsCount"
                        :items="listBInfo.duplicateItems"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item) => `[${item.count} 次]${item.name}`
                        "
                        @clean="removeDuplicateItems('B')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listBInfo.invalidItemsCount"
                        :items="listBInfo.invalidItems"
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
                :items="comparedResult.onlyInA"
                empty-text="列表 A 中没有独有条目。"
                suffix="独有"
            />
            <ComparisonResult
                title="同时存在于 A 和 B"
                :items="comparedResult.inBoth"
                empty-text="A 和 B 中没有共同条目。"
                suffix="共有"
            />
            <ComparisonResult
                title="仅在列表 B"
                :items="comparedResult.onlyInB"
                empty-text="列表 B 中没有独有条目。"
                suffix="独有"
            />
        </div>

        <!-- <div v-if="showResults" class="text-center my-6">
            <UButton
                @click="exportResults"
                icon="i-lucide-download"
                color="primary"
                variant="subtle"
                class="px-4 py-2 hover:cursor-pointer"
            >
                导出结果
            </UButton>
        </div> -->
    </UContainer>
</template>
