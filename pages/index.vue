<template>
    <UContainer class="py-8">
        <AppHeader />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">名单 A</h2>
                    <div class="flex items-center gap-2">
                        <ClipboardPaste targetList="A" @paste="handlePaste" />
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadA"
                            aria-label="上传名单 A"
                        >
                        </UButton>
                        <input
                            type="file"
                            accept=".txt,.csv"
                            @change="handleFileUpload($event, 'A')"
                            class="hidden"
                            ref="fileInputA"
                        />
                    </div>
                </div>
                <textarea
                    v-model="listA"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="输入第一份名单。姓名可用逗号、分号、制表符或换行分隔。"
                ></textarea>
                <div
                    class="flex justify-between items-center border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <span class="text-gray-700 p-2"
                        >检测到 {{ listAInfo.totalEnteredCount }} 个姓名</span
                    >
                    <div class="flex items-center justify-end gap-3 p-2">
                        <UPopover v-if="listAInfo.allUniqueNames.length > 0">
                            <p class="flex items-center hover:cursor-pointer">
                                <span
                                    class="w-2 h-2 rounded-full bg-green-500 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listAInfo.allUniqueNames.length
                                }}</span>
                            </p>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 flex justify-between bg-gray-50 border-b border-gray-200"
                                    >
                                        <p class="font-medium inline-block">
                                            <span
                                                class="text-green-600 font-semibold"
                                            >
                                                {{
                                                    listAInfo.allUniqueNames
                                                        .length
                                                }}
                                            </span>
                                            条有效条目
                                        </p>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                name, index
                                            ) in listAInfo.allUniqueNames"
                                            :key="'all-unique-a-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <span
                                                class="w-2 h-2 rounded-full bg-green-500 mr-1 inline-block"
                                            ></span>
                                            <span>{{ name }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>

                        <UPopover v-if="listAInfo.duplicates.length > 0">
                            <p class="flex items-center hover:cursor-pointer">
                                <span
                                    class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listAInfo.duplicateInfoCount
                                }}</span>
                            </p>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 gap-2 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                                    >
                                        <p class="font-medium inline-block">
                                            <span
                                                class="text-orange-600 font-semibold"
                                            >
                                                {{
                                                    listAInfo.duplicateInfoCount
                                                }}
                                            </span>
                                            个重复姓名
                                        </p>
                                        <UButton
                                            icon="ph:broom-fill"
                                            size="2xs"
                                            color="neutral"
                                            variant="link"
                                            @click="removeDuplicates('A')"
                                            class="hover:cursor-pointer p-1"
                                        >
                                            移除
                                        </UButton>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                item, index
                                            ) in listAInfo.duplicates"
                                            :key="'dup-a-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <div>
                                                <span
                                                    class="w-2 h-2 rounded-full bg-orange-500 mr-1 inline-block"
                                                ></span>
                                                <span class="">{{
                                                    item.name
                                                }}</span>
                                            </div>
                                            <span class="">
                                                重复 {{ item.count }} 次
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>

                        <UPopover v-if="listAInfo.invalidNames.length > 0">
                            <span
                                class="flex items-center hover:cursor-pointer"
                            >
                                <span
                                    class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listAInfo.invalidCount
                                }}</span>
                            </span>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 gap-1 flex flex-col bg-gray-50 border-b border-gray-200"
                                    >
                                        <div
                                            class="flex justify-between items-center"
                                        >
                                            <p class="font-medium inline-block">
                                                <span
                                                    class="text-red-600 font-semibold"
                                                >
                                                    {{ listAInfo.invalidCount }}
                                                </span>
                                                个可能无效姓名
                                            </p>
                                            <UButton
                                                icon="ph:broom-fill"
                                                size="2xs"
                                                color="neutral"
                                                variant="link"
                                                class="hover:cursor-pointer p-1"
                                                @click="removeInvalidItems('A')"
                                            >
                                                移除
                                            </UButton>
                                        </div>

                                        <p class="text-gray-500 text-[10px]">
                                            注：这些条目仍会参与比对，此处仅作提示。
                                        </p>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                item, index
                                            ) in listAInfo.invalidNames"
                                            :key="'invalid-a-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center"
                                        >
                                            <span
                                                class="w-2 h-2 rounded-full bg-red-500 mr-1 inline-block"
                                            ></span>
                                            <span>{{ item }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">名单 B</h2>
                    <div class="flex items-center gap-2">
                        <ClipboardPaste targetList="B" @paste="handlePaste" />
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadB"
                            aria-label="上传名单 B"
                        >
                        </UButton>
                        <input
                            type="file"
                            accept=".txt,.csv"
                            @change="handleFileUpload($event, 'B')"
                            class="hidden"
                            ref="fileInputB"
                        />
                    </div>
                </div>
                <textarea
                    v-model="listB"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="输入第二份名单。姓名可用逗号、分号、制表符或换行分隔。"
                ></textarea>
                <div
                    class="flex justify-between items-center border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <span class="text-gray-700 p-2"
                        >检测到 {{ listBInfo.totalEnteredCount }} 个姓名</span
                    >
                    <div class="flex items-center justify-end gap-3 p-2">
                        <UPopover v-if="listBInfo.allUniqueNames.length > 0">
                            <p class="flex items-center hover:cursor-pointer">
                                <span
                                    class="w-2 h-2 rounded-full bg-green-500 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listBInfo.allUniqueNames.length
                                }}</span>
                            </p>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 flex justify-between bg-gray-50 border-b border-gray-200"
                                    >
                                        <p class="font-medium inline-block">
                                            <span
                                                class="text-green-600 font-semibold"
                                            >
                                                {{
                                                    listBInfo.allUniqueNames
                                                        .length
                                                }}
                                            </span>
                                            条有效条目
                                        </p>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                name, index
                                            ) in listBInfo.allUniqueNames"
                                            :key="'all-unique-b-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                        >
                                            <span
                                                class="w-2 h-2 rounded-full bg-green-500 mr-1 inline-block"
                                            ></span>
                                            <span>{{ name }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>

                        <UPopover v-if="listBInfo.duplicates.length > 0">
                            <p class="flex items-center hover:cursor-pointer">
                                <span
                                    class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listBInfo.duplicateInfoCount
                                }}</span>
                            </p>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 gap-2 flex justify-between items-center bg-gray-50 border-b border-gray-200"
                                    >
                                        <p class="font-medium inline-block">
                                            <span
                                                class="text-orange-600 font-semibold"
                                            >
                                                {{
                                                    listBInfo.duplicateInfoCount
                                                }}
                                            </span>
                                            个重复姓名
                                        </p>
                                        <UButton
                                            icon="ph:broom-fill"
                                            size="2xs"
                                            color="neutral"
                                            variant="link"
                                            @click="removeDuplicates('B')"
                                            class="hover:cursor-pointer p-1"
                                        >
                                            移除
                                        </UButton>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                item, index
                                            ) in listBInfo.duplicates"
                                            :key="'dup-b-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <div>
                                                <span
                                                    class="w-2 h-2 rounded-full bg-orange-500 mr-1 inline-block"
                                                ></span>
                                                <span class="">{{
                                                    item.name
                                                }}</span>
                                            </div>
                                            <span class="">
                                                重复 {{ item.count }} 次
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>

                        <UPopover v-if="listBInfo.invalidNames.length > 0">
                            <span
                                class="flex items-center hover:cursor-pointer"
                            >
                                <span
                                    class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                                ></span>
                                <span class="text-gray-700">{{
                                    listBInfo.invalidCount
                                }}</span>
                            </span>
                            <template #content>
                                <div
                                    class="max-w-sm max-h-72 overflow-y-auto text-xs"
                                >
                                    <div
                                        class="p-2 gap-1 flex flex-col bg-gray-50 border-b border-gray-200"
                                    >
                                        <div
                                            class="flex justify-between items-center"
                                        >
                                            <p class="font-medium inline-block">
                                                <span
                                                    class="text-red-600 font-semibold"
                                                >
                                                    {{ listBInfo.invalidCount }}
                                                </span>
                                                个可能无效姓名
                                            </p>
                                            <UButton
                                                icon="ph:broom-fill"
                                                size="2xs"
                                                variant="link"
                                                color="neutral"
                                                class="hover:cursor-pointer p-1"
                                                @click="removeInvalidItems('B')"
                                            >
                                                移除
                                            </UButton>
                                        </div>

                                        <p class="text-gray-500 text-[10px]">
                                            注：这些条目仍会参与比对，此处仅作提示。
                                        </p>
                                    </div>

                                    <ul class="space-y-0.5">
                                        <li
                                            v-for="(
                                                item, index
                                            ) in listBInfo.invalidNames"
                                            :key="'invalid-b-' + index"
                                            class="px-1.5 py-1 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex items-center"
                                        >
                                            <span
                                                class="w-2 h-2 rounded-full bg-red-500 mr-1 inline-block"
                                            ></span>
                                            <span>{{ item }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </UPopover>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="!showResults"
            class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center"
        >
            <div class="flex flex-col items-center justify-center">
                <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                    <UIcon
                        name="i-heroicons-document-duplicate"
                        class="text-gray-400 w-8 h-8"
                    />
                </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">
                    尚未生成比对结果
                </h3>
                <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
                    在上方区域输入或上传名单以查看它们之间的差异和相同之处。
                </p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">
                        仅在名单 A
                    </h2>
                    <UButton
                        :icon="
                            onlyInACopied
                                ? 'i-heroicons-check-badge'
                                : 'i-heroicons-clipboard-document'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInA, 'only-in-a')"
                        aria-label="复制仅在名单A 中的条目"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="text-sm">
                        <li
                            v-for="(name, index) in onlyInA"
                            :key="'a-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                        <li
                            v-if="onlyInA.length === 0"
                            class="px-3 py-4 text-center text-gray-400 text-xs"
                        >
                            名单 A 中没有独有条目。
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ onlyInA.length }} 条独有
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">
                        同时存在于 A 和 B
                    </h2>
                    <UButton
                        :icon="
                            inBothCopied
                                ? 'i-heroicons-check-badge'
                                : 'i-heroicons-clipboard-document'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(inBoth, 'in-both')"
                        aria-label="复制同时存在于两个名单中的条目"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="text-sm">
                        <li
                            v-for="(name, index) in inBoth"
                            :key="'both-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                        <li
                            v-if="inBoth.length === 0"
                            class="px-3 py-4 text-center text-gray-400 text-xs"
                        >
                            没有找到共同条目。
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ inBoth.length }} 条共有
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">
                        仅在名单 B
                    </h2>
                    <UButton
                        :icon="
                            onlyInBCopied
                                ? 'i-heroicons-check-badge'
                                : 'i-heroicons-clipboard-document'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInB, 'only-in-b')"
                        aria-label="复制仅在名单B中的条目"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="text-sm">
                        <li
                            v-for="(name, index) in onlyInB"
                            :key="'b-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                        <li
                            v-if="onlyInB.length === 0"
                            class="px-3 py-4 text-center text-gray-400 text-xs"
                        >
                            名单 B 中没有独有条目。
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ onlyInB.length }} 条独有
                </div>
            </div>
        </div>

        <div v-if="showResults" class="text-center my-6">
            <UButton
                @click="exportResults"
                icon="i-heroicons-arrow-down-tray"
                color="neutral"
                variant="outline"
                class="px-4 py-2 hover:cursor-pointer"
            >
                导出结果
            </UButton>
        </div>
    </UContainer>
</template>

<script setup>
import { ref, watch, computed } from "vue";
defineOgImageComponent("NuxtSeo", {
    title: "名单比对工具 🔍",
    description: "快速、精准地对比名单数据，轻松找出重复项、差异项或唯一项！",
    theme: "#ff0000",
    colorMode: "dark",
    ogImage: {
        fonts: ["Noto+Sans+SC:400"],
    },
});

const toast = useToast();

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

const fileInputA = ref(null);
const fileInputB = ref(null);

const getItemsFromString = (text) => {
    if (!text || typeof text !== "string" || !text.trim()) {
        return [];
    }
    return text
        .split(/[\n,;、\t]+/)
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

const handlePaste = (data) => {
    if (!data || !data.content) return;

    const { targetList, content } = data;
    const listRef =
        targetList === "A" ? listA : targetList === "B" ? listB : null;

    if (!listRef) return;

    try {
        const currentValue = listRef.value || "";

        const separator =
            currentValue && !currentValue.endsWith("\n") ? "\n" : "";
        listRef.value = currentValue
            ? `${currentValue}${separator}${content}`
            : content;
    } catch (error) {
        console.error("粘贴处理失败:", error);
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

const isValidFileType = (file) => {
    const validTypes = ["text/plain", "text/csv"];
    const validExtensions = [".txt", ".csv"];

    return (
        validTypes.includes(file.type) ||
        validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
};

const handleFileUpload = async (event, listType) => {
    const file = event.target.files[0];
    if (!file) return;

    const resetInput = () => {
        event.target.value = "";
    };

    if (!isValidFileType(file)) {
        console.warn(`Unsupported file type: ${file.type || file.name}`);
        toast.add({
            title: "不支持的文件类型",
            description: "请上传 .txt 或 .csv 文件。",
            color: "orange",
            icon: "i-heroicons-exclamation-triangle",
        });
        resetInput();
        return;
    }

    try {
        const content = await readFileAsText(file);
        if (listType === "A") {
            listA.value = content;
        } else if (listType === "B") {
            listB.value = content;
        }
        resetInput();
    } catch (error) {
        console.error("File reading error:", error);
        toast.add({
            title: "读取文件出错",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
        });
        resetInput();
    }
};

const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
};

const triggerFileUploadA = () => {
    fileInputA.value?.click();
};
const triggerFileUploadB = () => {
    fileInputB.value?.click();
};

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

    // 使用 Set 来获取每个名单中的 *独一无二* 的条目（包括“无效”条目）
    const setA = new Set(namesA);
    const setB = new Set(namesB);

    // 找出仅在 A 中的独有条目
    onlyInA.value = [...setA].filter((name) => !setB.has(name)).sort();

    // 找出仅在 B 中的独有条目
    onlyInB.value = [...setB].filter((name) => !setA.has(name)).sort();

    // 找出在 A 和 B 中都存在的共有条目
    inBoth.value = [...setA].filter((name) => setB.has(name)).sort();

    showResults.value = true; // 显示结果区
};

const exportResults = () => {
    // 收集所有有内容的部分
    const sections = [];

    // 只有在有内容时才添加相应部分
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

    // 添加重复信息（如果有）
    if (listAInfo.value.duplicates.length > 0) {
        const duplicateContent = listAInfo.value.duplicates
            .map((item) => `${item.name} (输入 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 名单 A 中的重复输入 ---",
            content: duplicateContent,
        });
    }

    if (listBInfo.value.duplicates.length > 0) {
        const duplicateContent = listBInfo.value.duplicates
            .map((item) => `${item.name} (输入 ${item.count} 次)`)
            .join("\n");

        sections.push({
            title: "--- 名单 B 中的重复输入 ---",
            content: duplicateContent,
        });
    }

    // 添加"无效格式"提示信息（如果有）
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

    // 如果没有任何内容可导出
    if (sections.length === 0) {
        toast.add({
            title: "没有可导出的内容",
            description: "没有发现任何可导出的结果",
            color: "blue",
            icon: "i-heroicons-information-circle",
        });
        return;
    }

    // 合并所有部分，使用两个换行符分隔
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
            icon: "i-heroicons-check-circle",
            color: "green",
            timeout: 2000,
        });
    } catch (error) {
        console.error("导出失败:", error);
        toast.add({
            title: "导出失败",
            description: "无法生成下载文件",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
        });
    }
};

// --- Clipboard (No changes needed here) ---

const onlyInACopied = ref(false);
const inBothCopied = ref(false);
const onlyInBCopied = ref(false);

const copyToClipboard = async (items, type) => {
    if (!items || items.length === 0) {
        toast.add({
            title: "无可复制内容",
            description: "该名单为空。",
            color: "blue",
            icon: "i-heroicons-information-circle",
        });
        return;
    }
    const textToCopy = items.join("\n");
    try {
        await navigator.clipboard.writeText(textToCopy);
        onlyInACopied.value = false;
        inBothCopied.value = false;
        onlyInBCopied.value = false;
        if (type === "only-in-a") onlyInACopied.value = true;
        else if (type === "in-both") inBothCopied.value = true;
        else if (type === "only-in-b") onlyInBCopied.value = true;
        toast.add({
            title: "已复制到剪贴板!",
            icon: "i-heroicons-check-circle",
            color: "green",
            timeout: 1600,
        });
        setTimeout(() => {
            if (type === "only-in-a") onlyInACopied.value = false;
            else if (type === "in-both") inBothCopied.value = false;
            else if (type === "only-in-b") onlyInBCopied.value = false;
        }, 1600);
    } catch (err) {
        console.error("复制失败: ", err);
        toast.add({
            title: "复制失败",
            description: "无法将文本复制到剪贴板。",
            color: "red",
            icon: "i-heroicons-exclamation-triangle",
        });
        onlyInACopied.value = false;
        inBothCopied.value = false;
        onlyInBCopied.value = false;
    }
};

const removeDuplicates = (listType) => {
    let currentListRef = listType === "A" ? listA : listB;
    let listInfo = listType === "A" ? listAInfo.value : listBInfo.value;

    if (!currentListRef || !listInfo) return;

    if (listInfo.duplicateInfoCount === 0) {
        toast.add({
            title: `名单 ${listType} 中没有检测到重复姓名`,
            color: "blue",
            icon: "i-heroicons-information-circle",
        });
        return;
    }

    const items = getItemsFromString(currentListRef.value);
    if (items.length === 0) return;

    const uniqueItemsSet = new Set(items);
    const uniqueItemsArray = Array.from(uniqueItemsSet).sort();
    currentListRef.value = uniqueItemsArray.join("\n"); // Update list

    toast.add({
        title: `名单 ${listType} 的重复姓名已移除`,
        icon: "i-heroicons-check-circle",
        color: "green",
    });
};

const removeInvalidItems = (listType) => {
    let currentListRef = listType === "A" ? listA : listB;
    let listInfo = listType === "A" ? listAInfo.value : listBInfo.value;

    if (!currentListRef || !listInfo) return;

    if (listInfo.invalidCount === 0) {
        toast.add({
            title: `名单 ${listType} 中没有检测到特殊格式姓名`,
            color: "blue",
            icon: "i-heroicons-information-circle",
        });
        return;
    }

    // Use helper to get items
    const items = getItemsFromString(currentListRef.value);
    if (items.length === 0) return;

    // Filter out invalid items (keep only valid ones)
    const validItems = items.filter((item) => !isConsideredInvalid(item));

    // Sort the remaining valid items (optional)
    const sortedValidItems = validItems.sort();

    // Update the list ref
    currentListRef.value = sortedValidItems.join("\n");

    toast.add({
        title: `名单 ${listType} 的特殊格式姓名已移除`,
        icon: "i-heroicons-check-circle",
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
