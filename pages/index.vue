<template>
    <UContainer class="py-8">
        <header class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">
                列表对比工具
            </h1>
            <p class="text-sm text-gray-500 mt-1">
                对比两个列表，找出各自独有及共有的条目，并提示重复项和特殊格式项。
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">列表 A</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadA"
                            aria-label="上传列表 A"
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
                    placeholder="输入第一个列表。条目可用逗号、分号、制表符或换行分隔。"
                ></textarea>
                <div
                    class="flex items-center justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <UPopover v-if="listAInfo.allUniqueNames.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-blue-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listAInfo.allUniqueNames.length
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium mb-1">
                                    输入中去重后的条目 ({{
                                        listAInfo.allUniqueNames.length
                                    }})
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            name, index
                                        ) in listAInfo.allUniqueNames"
                                        :key="'all-unique-a-' + index"
                                    >
                                        {{ name }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listAInfo.duplicates.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listAInfo.duplicateInfoCount
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium text-orange-600 mb-1">
                                    检测到重复输入 ({{
                                        listAInfo.duplicateInfoCount
                                    }}
                                    种)
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            item, index
                                        ) in listAInfo.duplicates"
                                        :key="'dup-a-' + index"
                                        class="flex items-center justify-between"
                                    >
                                        <span>{{ item.name }}</span>
                                        <UBadge
                                            color="orange"
                                            variant="soft"
                                            size="xs"
                                            class="ml-2"
                                        >
                                            出现 {{ item.count }} 次
                                        </UBadge>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listAInfo.invalidNames.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listAInfo.invalidCount
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium text-red-600 mb-1">
                                    特殊格式或空条目 ({{
                                        listAInfo.invalidCount
                                    }})
                                </div>
                                <div class="text-gray-500 mb-1 text-[10px]">
                                    注：这些条目仍会参与对比，此处仅作提示。
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            item, index
                                        ) in listAInfo.invalidNames"
                                        :key="'invalid-a-' + index"
                                    >
                                        '{{ item }}'
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">列表 B</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadB"
                            aria-label="上传列表 B"
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
                    placeholder="输入第二个列表。条目可用逗号、分号、制表符或换行分隔。"
                ></textarea>
                <div
                    class="flex items-center justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <UPopover v-if="listBInfo.allUniqueNames.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-blue-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listBInfo.allUniqueNames.length
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium mb-1">
                                    输入中去重后的条目 ({{
                                        listBInfo.allUniqueNames.length
                                    }})
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            name, index
                                        ) in listBInfo.allUniqueNames"
                                        :key="'all-unique-b-' + index"
                                    >
                                        {{ name }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listBInfo.duplicates.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listBInfo.duplicateInfoCount
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium text-orange-600 mb-1">
                                    检测到重复输入 ({{
                                        listBInfo.duplicateInfoCount
                                    }}
                                    种)
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            item, index
                                        ) in listBInfo.duplicates"
                                        :key="'dup-b-' + index"
                                        class="flex items-center justify-between"
                                    >
                                        <span>{{ item.name }}</span>
                                        <UBadge
                                            color="orange"
                                            variant="soft"
                                            size="xs"
                                            class="ml-2"
                                        >
                                            出现 {{ item.count }} 次
                                        </UBadge>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listBInfo.invalidNames.length > 0">
                        <span class="flex items-center hover:cursor-pointer">
                            <span
                                class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                listBInfo.invalidCount
                            }}</span>
                        </span>
                        <template #content>
                            <div
                                class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs"
                            >
                                <div class="font-medium text-red-600 mb-1">
                                    特殊格式或空条目 ({{
                                        listBInfo.invalidCount
                                    }})
                                </div>
                                <div class="text-gray-500 mb-1 text-[10px]">
                                    注：这些条目仍会参与对比，此处仅作提示。
                                </div>
                                <ul class="space-y-0.5">
                                    <li
                                        v-for="(
                                            item, index
                                        ) in listBInfo.invalidNames"
                                        :key="'invalid-b-' + index"
                                    >
                                        '{{ item }}'
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>
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
                    尚未生成对比结果
                </h3>
                <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
                    在上方区域输入或上传列表以查看它们之间的差异和相同之处。
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
                        仅在列表 A
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
                        aria-label="复制仅在列表A中的条目"
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
                            列表 A 中没有独有条目。
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
                        aria-label="复制同时存在于两个列表中的条目"
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
                        仅在列表 B
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
                        aria-label="复制仅在列表B中的条目"
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
                            列表 B 中没有独有条目。
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
                class="font-semibold"
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
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

const fileInputA = ref(null);
const fileInputB = ref(null);

// --- Helper Functions ---

// 检查名称是否“无效”（仅用于提示目的）
// 定义：空、仅空格、或不包含任何字母/数字/汉字
const isPotentiallyInvalidForReporting = (name) => {
    if (!name || typeof name !== "string") {
        return true; // Treat null/undefined etc as invalid for reporting
    }
    const trimmedName = name.trim();
    if (trimmedName === "") {
        return true; // Empty or only whitespace is invalid
    }
    // Check if it contains *at least one* letter, number, or Han character
    const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
    return !validCharPattern.test(trimmedName);
};

// --- Parsing and Analysis ---

const parseNameList = (text) => {
    const result = {
        rawCount: 0, // 原始分割出的条目数 (包括空) -> 改为非空条目数
        totalEnteredCount: 0, // 非空条目总数
        invalidCount: 0, // 被视为“无效”格式的条目数 (用于提示)
        duplicateInfoCount: 0, // 有重复的条目种类数
        allNames: [], // 所有非空、trim后的原始输入条目 (用于对比)
        allUniqueNames: [], // 所有非空、trim后、去重的输入条目 (用于信息展示)
        invalidNames: [], // “无效”格式的条目列表 (用于提示)
        duplicates: [], // 重复条目列表 { name, count } (基于allNames)
    };

    if (!text || typeof text !== "string" || !text.trim()) {
        return result;
    }

    const items = text
        .split(/[\n,;、\t]+/)
        .map((name) => name.trim())
        .filter((name) => name !== ""); // *关键*: 只保留非空条目

    result.totalEnteredCount = items.length; // 总共输入的非空条目数
    result.allNames = items; // 所有用于对比的条目

    const nameCountMap = {};
    const allNamesSet = new Set(); // 用于获取去重后的所有输入
    const tempInvalidNames = [];

    items.forEach((name) => {
        // 检查是否“无效”用于报告
        if (isPotentiallyInvalidForReporting(name)) {
            tempInvalidNames.push(name);
        }
        // 统计所有非空条目的出现次数
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
        // 添加到 Set 以获取去重列表
        allNamesSet.add(name);
    });

    // Finalize results
    result.allUniqueNames = Array.from(allNamesSet).sort(); // 去重后的所有输入条目
    result.invalidNames = tempInvalidNames; // 收集到的“无效”格式条目
    result.invalidCount = result.invalidNames.length;

    // 计算重复项 (基于所有非空输入)
    result.duplicates = Object.entries(nameCountMap)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    result.duplicateInfoCount = result.duplicates.length;

    return result;
};

// --- Computed Properties ---

const listAInfo = computed(() => parseNameList(listA.value));
const listBInfo = computed(() => parseNameList(listB.value));

// --- File Handling (No changes needed here) ---

const handleFileUpload = (event, listType) => {
    const file = event.target.files[0];
    if (file) {
        if (
            file.type === "text/plain" ||
            file.type === "text/csv" ||
            file.name.endsWith(".txt") ||
            file.name.endsWith(".csv")
        ) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (listType === "A") {
                    listA.value = e.target.result;
                } else if (listType === "B") {
                    listB.value = e.target.result;
                }
                event.target.value = "";
            };
            reader.onerror = (e) => {
                console.error("File reading error:", e);
                toast.add({
                    title: "读取文件出错",
                    color: "red",
                    icon: "i-heroicons-exclamation-triangle",
                });
                event.target.value = "";
            };
            reader.readAsText(file);
        } else {
            console.warn(`Unsupported file type: ${file.type || file.name}`);
            toast.add({
                title: "不支持的文件类型",
                description: "请上传 .txt 或 .csv 文件。",
                color: "orange",
                icon: "i-heroicons-exclamation-triangle",
            });
            event.target.value = "";
        }
    }
};

const triggerFileUploadA = () => {
    fileInputA.value?.click();
};
const triggerFileUploadB = () => {
    fileInputB.value?.click();
};

// --- Comparison Logic ---

const compareNames = () => {
    // ***核心改变***: 使用 allNames 进行对比
    const namesA = listAInfo.value.allNames;
    const namesB = listBInfo.value.allNames;

    onlyInA.value = [];
    onlyInB.value = [];
    inBoth.value = [];

    // 只要有任何一个列表有输入（即使是“无效”输入），就进行对比并显示结果区
    if (namesA.length === 0 && namesB.length === 0) {
        showResults.value = false; // 只有两个列表都完全为空时才不显示结果区
        return;
    }

    // 使用 Set 来获取每个列表中的 *独一无二* 的条目（包括“无效”条目）
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

// --- Export (No significant changes needed, reflects current results) ---

const exportResults = () => {
    let content = "--- 仅在列表 A 中存在的条目 ---\n";
    content += onlyInA.value.length > 0 ? onlyInA.value.join("\n") : "(无)";
    content += "\n\n--- 同时存在于列表 A 和 B 中的条目 ---\n";
    content += inBoth.value.length > 0 ? inBoth.value.join("\n") : "(无)";
    content += "\n\n--- 仅在列表 B 中存在的条目 ---\n";
    content += onlyInB.value.length > 0 ? onlyInB.value.join("\n") : "(无)";

    // 添加重复信息
    if (listAInfo.value.duplicates.length > 0) {
        content += "\n\n--- 列表 A 中的重复输入 ---\n";
        listAInfo.value.duplicates.forEach((item) => {
            content += `${item.name} (输入 ${item.count} 次)\n`;
        });
    } else {
        content += "\n\n--- 列表 A 中的重复输入 ---\n(无)";
    }
    if (listBInfo.value.duplicates.length > 0) {
        content += "\n\n--- 列表 B 中的重复输入 ---\n";
        listBInfo.value.duplicates.forEach((item) => {
            content += `${item.name} (输入 ${item.count} 次)\n`;
        });
    } else {
        content += "\n\n--- 列表 B 中的重复输入 ---\n(无)";
    }

    // 添加“无效格式”提示信息
    if (listAInfo.value.invalidNames.length > 0) {
        content += "\n\n--- 列表 A 中检测到的特殊格式或空条目 (仅提示) ---\n";
        content += listAInfo.value.invalidNames.join("\n");
    } else {
        content +=
            "\n\n--- 列表 A 中检测到的特殊格式或空条目 (仅提示) ---\n(无)";
    }
    if (listBInfo.value.invalidNames.length > 0) {
        content += "\n\n--- 列表 B 中检测到的特殊格式或空条目 (仅提示) ---\n";
        content += listBInfo.value.invalidNames.join("\n");
    } else {
        content +=
            "\n\n--- 列表 B 中检测到的特殊格式或空条目 (仅提示) ---\n(无)";
    }

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
        link.download = `列表对比结果_${timestamp}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.add({
            title: "导出成功",
            icon: "i-heroicons-check-circle",
            color: "green",
        });
    } catch (error) {
        console.error("导出失败:", error);
        toast.add({
            title: "导出失败",
            description: "无法生成下载文件。",
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
            description: "该列表为空。",
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

// --- Watcher (No changes needed here) ---

watch(
    [listA, listB],
    () => {
        compareNames();
    },
    { immediate: false },
);
</script>
