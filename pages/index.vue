<script setup lang="ts">
import { exportResultsToFile } from "@/utils/export";

const listARef = ref(null);
const listBRef = ref(null);
const showResults = ref(true);

const {
    input: inputA,
    appendInput: appendTextA,
    setInput: setInputA,
} = useInput();
const {
    input: inputB,
    appendInput: appendTextB,
    setInput: setInputB,
} = useInput();

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
    if (target === "A") appendTextA(text);
    else appendTextB(text);
};
provide("appendText", appendText);

const toast = useToast();
const { writeText } = useClipboard();

const validListACopyStatus: CopyStatus = ref("idle");
const validListBCopyStatus: CopyStatus = ref("idle");

const handleCopy = async (target: "A" | "B") => {
    const text =
        target === "A"
            ? listAInfo.value.validItems.join("\n")
            : listBInfo.value.validItems.join("\n");
    const result = await writeText(text);

    if (result.success) {
        if (target === "A") validListACopyStatus.value = "success";
        else validListBCopyStatus.value = "success";

        setTimeout(() => {
            if (target === "A") validListACopyStatus.value = "idle";
            else validListBCopyStatus.value = "idle";
        }, 1500);
    } else {
        if (target === "A") validListACopyStatus.value = "fail";
        else validListBCopyStatus.value = "fail";

        setTimeout(() => {
            if (target === "A") validListACopyStatus.value = "idle";
            else validListBCopyStatus.value = "idle";
        }, 1500);
    }
};

import { removeDuplicateItems, removeInvalidItems } from "@/utils/parse";

const handleRemoveDuplicateItems = (target: "A" | "B") => {
    const text = target === "A" ? inputA.value : inputB.value;
    const result = removeDuplicateItems(text, selectedSeparators.value);

    if (text === result) {
        toast.add({
            title: `名单 ${target} 中没有重复项`,
            icon: "i-lucide-circle-alert",
            color: "warning",
        });
    } else {
        toast.add({
            title: `名单 ${target} 的重复项已移除`,
            icon: "i-lucide-check",
        });
    }

    if (target === "A") setInputA(result);
    else setInputB(result);
};

const handleRemoveInvalidItems = (target: "A" | "B") => {
    const text = target === "A" ? inputA.value : inputB.value;
    const result = removeInvalidItems(text, selectedSeparators.value);

    if (text === result) {
        toast.add({
            title: `名单 ${target} 中没有无效项`,
            icon: "i-lucide-circle-alert",
            color: "neutral",
        });
    } else {
        toast.add({
            title: `名单 ${target} 的无效项已移除`,
            icon: "i-lucide-check",
        });
    }

    if (target === "A") setInputA(result);
    else setInputB(result);
};

import type { DuplicateItem } from "@/types";

// exportResultsToFile({
//     onlyInA: comparedResult.value.onlyInA,
//     onlyInB: comparedResult.value.onlyInB,
//     inBoth: comparedResult.value.inBoth,
//     listAInfo: listAInfo.value,
//     listBInfo: listBInfo.value,
//     filename: "名单比对",
// });
</script>

<template>
    <UContainer class="py-8">
        <AppHeader />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <ListInput
                title="名单 A"
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
                        @copy="handleCopy('A')"
                        :copyStatus="validListACopyStatus"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listAInfo.duplicateItemsCount"
                        :items="listAInfo.duplicateItems"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item: DuplicateItem) =>
                                `[${item.count} 次]${item.label}`
                        "
                        @clean="handleRemoveDuplicateItems('A')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listAInfo.invalidItemsCount"
                        :items="listAInfo.invalidItems"
                        status="red"
                        :show-clean="true"
                        @clean="handleRemoveInvalidItems('A')"
                    />
                </template>
            </ListInput>

            <ListInput
                v-model="inputB"
                target="B"
                title="名单 B"
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
                        @copy="handleCopy('B', validTextB)"
                        :copyStatus="validListBCopyStatus"
                    />

                    <StatPopover
                        title="个重复项"
                        :count="listBInfo.duplicateItemsCount"
                        :items="listBInfo.duplicateItems"
                        status="yellow"
                        :show-clean="true"
                        :display-formatter="
                            (item: DuplicateItem) =>
                                `[${item.count} 次]${item.label}`
                        "
                        @clean="handleRemoveDuplicateItems('B')"
                    />

                    <StatPopover
                        title="个可能无效项"
                        :count="listBInfo.invalidItemsCount"
                        :items="listBInfo.invalidItems"
                        status="red"
                        :show-clean="true"
                        @clean="handleRemoveInvalidItems('B')"
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
                :items="comparedResult.onlyInA"
                empty-text="名单 A 中没有独有条目。"
                suffix="独有"
            />
            <ComparisonResult
                title="同时存在于 A 和 B"
                :items="comparedResult.inBoth"
                empty-text="A 和 B 中没有共同条目。"
                suffix="共有"
            />
            <ComparisonResult
                title="仅在名单 B"
                :items="comparedResult.onlyInB"
                empty-text="名单 B 中没有独有条目。"
                suffix="独有"
            />
        </div>
        <!--
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
        </div> -->
    </UContainer>
</template>
