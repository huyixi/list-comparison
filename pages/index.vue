<template>
    <UContainer class="py-8">
        <header class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">
                List Comparison Tool
            </h1>
            <p class="text-sm text-gray-500 mt-1">
                Compare two lists and identify unique and common items
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- 名单 A -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">List A</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadA"
                        >
                        </UButton>
                        <input
                            type="file"
                            accept=".txt,.csv,xlsx"
                            @change="handleFileUpload($event, 'A')"
                            class="hidden"
                            ref="fileInputA"
                        />
                    </div>
                </div>
                <textarea
                    v-model="listA"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="输入第一份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                ></textarea>
                <div
                    class="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <span class="text-gray-500">
                        {{ namesAInfo.validCount }} items</span
                    >
                    <div class="flex items-center gap-2">
                        <UPopover
                            v-if="
                                namesAInfo.invalidNames.length > 0 ||
                                namesAInfo.duplicates.length > 0
                            "
                        >
                            <UButton
                                v-if="
                                    namesAInfo.invalidNames.length > 0 ||
                                    namesAInfo.duplicates.length > 0
                                "
                                variant="ghost"
                                size="xs"
                                color="gray"
                                :icon="
                                    showListADetails
                                        ? 'i-heroicons-eye-slash'
                                        : 'i-heroicons-eye'
                                "
                                class="hover:cursor-pointer p-0"
                                @click="showListADetails = !showListADetails"
                            />
                            <template #content>
                                <div
                                    class="p-4 max-w-sm max-h-72 overflow-y-auto"
                                >
                                    <div
                                        v-if="
                                            namesAInfo.invalidNames.length > 0
                                        "
                                        class="mb-4"
                                    >
                                        <div
                                            class="text-sm font-medium text-red-600 mb-2"
                                        >
                                            无效姓名：
                                        </div>
                                        <ul class="space-y-1">
                                            <li
                                                v-for="(
                                                    name, index
                                                ) in namesAInfo.invalidNames"
                                                :key="'invalid-a-' + index"
                                                class="text-sm flex items-center justify-between"
                                            >
                                                {{ name }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div
                                        v-if="namesAInfo.duplicates.length > 0"
                                    >
                                        <div
                                            class="text-sm font-medium text-orange-600 mb-2"
                                        >
                                            重复姓名：
                                        </div>
                                        <ul class="space-y-1">
                                            <li
                                                v-for="(
                                                    item, index
                                                ) in namesAInfo.duplicates"
                                                :key="'dupe-a-' + index"
                                                class="text-sm flex items-center justify-between"
                                            >
                                                {{ item.name }}
                                                <span
                                                    color="orange"
                                                    size="sm"
                                                    class="ml-2"
                                                >
                                                    {{ item.count }} repeat
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-emerald-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesAInfo.validCount
                            }}</span>
                        </span>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesAInfo.duplicates.length
                            }}</span>
                        </span>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesAInfo.invalidNames.length
                            }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <!-- 名单 B -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">List B</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadB"
                        >
                        </UButton>
                        <input
                            type="file"
                            accept=".txt,.csv,xlsx"
                            @change="handleFileUpload($event, 'B')"
                            class="hidden"
                            ref="fileInputB"
                        />
                    </div>
                </div>
                <textarea
                    v-model="listB"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="输入第二份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                ></textarea>
                <div
                    class="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <span class="text-gray-500">
                        {{ namesBInfo.validCount }} items</span
                    >
                    <div class="flex items-center gap-2">
                        <UPopover
                            v-if="
                                namesBInfo.invalidNames.length > 0 ||
                                namesBInfo.duplicates.length > 0
                            "
                        >
                            <UButton
                                v-if="
                                    namesBInfo.invalidNames.length > 0 ||
                                    namesBInfo.duplicates.length > 0
                                "
                                variant="ghost"
                                size="xs"
                                color="gray"
                                :icon="
                                    showListBDetails
                                        ? 'i-heroicons-eye-slash'
                                        : 'i-heroicons-eye'
                                "
                                class="hover:cursor-pointer p-0"
                                @click="showListBDetails = !showListBDetails"
                            />
                            <template #content>
                                <div
                                    class="p-4 max-w-sm max-h-72 overflow-y-auto"
                                >
                                    <div
                                        v-if="
                                            namesBInfo.invalidNames.length > 0
                                        "
                                        class="mb-4"
                                    >
                                        <div
                                            class="text-sm font-medium text-red-600 mb-2"
                                        >
                                            无效姓名：
                                        </div>
                                        <ul class="space-y-1">
                                            <li
                                                v-for="(
                                                    name, index
                                                ) in namesBInfo.invalidNames"
                                                :key="'invalid-b-' + index"
                                                class="text-sm"
                                            >
                                                {{ name }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div
                                        v-if="namesBInfo.duplicates.length > 0"
                                    >
                                        <div
                                            class="text-sm font-medium text-orange-600 mb-2"
                                        >
                                            重复姓名：
                                        </div>
                                        <ul class="space-y-1">
                                            <li
                                                v-for="(
                                                    item, index
                                                ) in namesBInfo.duplicates"
                                                :key="'dupe-b-' + index"
                                                class="text-sm flex items-center"
                                            >
                                                {{ item.name }}
                                                <UBadge
                                                    color="orange"
                                                    size="sm"
                                                    class="ml-2"
                                                >
                                                    出现 {{ item.count }} 次
                                                </UBadge>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </template>
                        </UPopover>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-emerald-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesBInfo.validCount
                            }}</span>
                        </span>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-yellow-400 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesBInfo.duplicates.length
                            }}</span>
                        </span>
                        <span class="flex items-center">
                            <span
                                class="w-2 h-2 rounded-full bg-rose-500 mr-1"
                            ></span>
                            <span class="text-gray-700">{{
                                namesBInfo.invalidNames.length
                            }}</span>
                        </span>
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
                    <div
                        class="i-heroicons-document-duplicate text-gray-400 w-8 h-8"
                    ></div>
                </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">
                    No comparison results yet
                </h3>
                <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
                    Enter your lists in the text areas above and click "Validate
                    & Compare" to see the differences and similarities
                </p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <!-- 只在A中存在的名字 -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <div class="flex items-center gap-2">
                        <h2 class="text-base font-medium text-gray-700">
                            仅在名单 A 中存在
                        </h2>
                    </div>
                    <UButton
                        :icon="
                            onlyInACopied
                                ? 'i-lucide-copy-check'
                                : 'i-lucide-copy'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInA, 'only-in-a')"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="divide-dashed divide-gray-200">
                        <li
                            v-for="(name, index) in onlyInA"
                            :key="'a-' + index"
                            class="px-2 py-1 flex items-center hover:bg-gray-50"
                        >
                            <span class="flex-grow">{{ name }}</span>
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ onlyInA.length }} items
                </div>
            </div>

            <!-- 在A和B中都存在的名字 -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <div class="flex items-center gap-2">
                        <h2 class="text-base font-medium text-gray-700">
                            在名单 A 和 B 中都存在
                        </h2>
                    </div>

                    <UButton
                        :icon="
                            inBothCopied
                                ? 'i-lucide-copy-check'
                                : 'i-lucide-copy'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(inBoth, 'in-both')"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto p-3">
                    <ul class="divide-dashed divide-gray-200">
                        <li
                            v-for="(name, index) in inBoth"
                            :key="'both-' + index"
                            class="px-2 py-1 flex items-center hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ inBoth.length }} items
                </div>
            </div>

            <!-- 只在B中存在的名字 -->
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <div class="flex items-center gap-2">
                        <h2 class="text-base font-medium text-gray-700">
                            仅在名单 B 中存在
                        </h2>
                    </div>
                    <UButton
                        :icon="
                            onlyInBCopied
                                ? 'i-lucide-copy-check'
                                : 'i-lucide-copy'
                        "
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInB, 'only-in-b')"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto p-3">
                    <ul class="divide-dashed divide-red-500">
                        <li
                            v-for="(name, index) in onlyInB"
                            :key="'b-' + index"
                            class="px-2 py-1 flex items-center hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ onlyInB.length }} items
                </div>
            </div>
        </div>

        <div v-if="showResults" class="text-center my-6">
            <UButton
                @click="exportResults"
                color="primary"
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

// 控制显示/隐藏无效和重复名单
const showListADetails = ref(true);
const showListBDetails = ref(true);

const fileInputA = ref(null);
const fileInputB = ref(null);

// 检查名字是否只包含符号
const isOnlySymbols = (name) => {
    // 匹配任何非字母、非数字、非汉字的字符
    const symbolPattern = /^[^\p{L}\p{N}\p{Script=Han}]+$/u;
    return symbolPattern.test(name);
};

// 判断一个名字是否有效
const isValidName = (name) => {
    return name !== "" && !isOnlySymbols(name);
};

// 解析和分析名单
const parseNameList = (text) => {
    const result = {
        allNames: [], // 所有拆分后的名字
        validNames: [], // 有效的名字
        invalidNames: [], // 无效的名字
        duplicates: [], // 重复的名字及其出现次数
        validCount: 0, // 有效名字数量
    };

    if (!text.trim()) {
        return result;
    }

    // 先用换行分割
    let allNames = text.split(/\n/);

    // 对每个结果再用各种分隔符分割
    allNames = allNames.flatMap((line) =>
        line.split(/[,，、;;\s\.。\/\\\(\)\[\]\{\}【】（）]+/),
    );

    // 预处理所有名字
    result.allNames = allNames.map((name) => name.trim());

    // 过滤有效和无效名字
    result.validNames = result.allNames.filter((name) => isValidName(name));
    result.invalidNames = result.allNames.filter(
        (name) => name !== "" && !isValidName(name),
    );

    // 统计重复名字
    const nameCountMap = {};
    result.validNames.forEach((name) => {
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
    });

    // 提取重复的名字
    result.duplicates = Object.entries(nameCountMap)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // 更新有效名字计数
    result.validCount = result.validNames.length;

    return result;
};

// 计算属性 - 名单 A 的分析结果
const namesAInfo = computed(() => parseNameList(listA.value));

// 计算属性 - 名单 B 的分析结果
const namesBInfo = computed(() => parseNameList(listB.value));

// 处理文件上传 - 名单A
// 封装通用的文件处理函数
const handleFileUpload = (event, listType) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (listType === "A") {
                listA.value = e.target.result;
            } else if (listType === "B") {
                listB.value = e.target.result;
            }
        };
        reader.readAsText(file);
    }
};
const triggerFileUploadA = () => {
    fileInputA.value.click();
};
const triggerFileUploadB = () => {
    fileInputB.value.click();
};

// 对比两份名单
const compareNames = () => {
    const namesA = namesAInfo.value.validNames;
    const namesB = namesBInfo.value.validNames;

    // 转换为Set，便于快速查找
    const setA = new Set(namesA);
    const setB = new Set(namesB);

    // 找出只在A中存在的名字
    onlyInA.value = [...setA].filter((name) => !setB.has(name));

    // 找出只在B中存在的名字
    onlyInB.value = [...setB].filter((name) => !setA.has(name));

    // 找出在A和B中都存在的名字
    inBoth.value = [...setA].filter((name) => setB.has(name));

    // 显示结果
    if (namesA.length > 0 && namesB.length > 0) {
        showResults.value = true;
    }
};

// 导出结果
const exportResults = () => {
    let content = "仅在名单A中存在的名字：\n";
    content += onlyInA.value.join("\n");
    content += "\n\n在名单A和B中都存在的名字：\n";
    content += inBoth.value.join("\n");
    content += "\n\n仅在名单B中存在的名字：\n";
    content += onlyInB.value.join("\n");

    // 添加重复姓名信息
    if (namesAInfo.value.duplicates.length > 0) {
        content += "\n\n名单A中的重复姓名：\n";
        namesAInfo.value.duplicates.forEach((item) => {
            content += `${item.name} (出现${item.count}次)\n`;
        });
    }

    if (namesBInfo.value.duplicates.length > 0) {
        content += "\n\n名单B中的重复姓名：\n";
        namesBInfo.value.duplicates.forEach((item) => {
            content += `${item.name} (出现${item.count}次)\n`;
        });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "名单对比结果.txt";
    link.click();

    URL.revokeObjectURL(url);
};

const onlyInACopied = ref(false);
const inBothCopied = ref(false);
const onlyInBCopied = ref(false);

const copyToClipboard = (items, type) => {
    if (items.length === 0) {
        toast.add({
            title: "Notice",
            description: "No content to copy",
            color: "blue",
        });
        return;
    }

    const textToCopy = items.join("\n");

    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
            // Reset all copy states first
            onlyInACopied.value = false;
            inBothCopied.value = false;
            onlyInBCopied.value = false;

            // Set the appropriate copy state based on type
            if (type === "only-in-a") {
                onlyInACopied.value = true;
            } else if (type === "in-both") {
                inBothCopied.value = true;
            } else if (type === "only-in-b") {
                onlyInBCopied.value = true;
            }

            // Reset the copy state after 2 seconds
            setTimeout(() => {
                onlyInACopied.value = false;
                inBothCopied.value = false;
                onlyInBCopied.value = false;
            }, 1600);
        })
        .catch((err) => {
            console.error("Copy failed: ", err);
            toast.add({
                title: "Error",
                description: "Copy failed",
                color: "red",
            });
        });
};

// 监听表单变化
watch([listA, listB], () => {
    // 如果两个列表都有内容，进行比较
    if (listA.value.trim() !== "" && listB.value.trim() !== "") {
        compareNames();
    } else {
        showResults.value = false;
    }
});
</script>
