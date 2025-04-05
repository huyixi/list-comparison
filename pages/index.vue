<template>
    <UContainer class="py-8">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-primary">名单对比工具</h1>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <!-- 名单 A -->
            <UCard>
                <div class="text-lg font-semibold mb-2">名单 A</div>
                <UTextarea
                    v-model="listA"
                    :rows="12"
                    class="w-full h-full"
                    placeholder="请输入第一份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                />
                <div class="mt-2 flex items-center justify-between">
                    <div>
                        <UInput
                            type="file"
                            accept=".txt,.csv"
                            @change="handleFileA"
                            icon="i-heroicons-document-arrow-up"
                            size="sm"
                            class="w-50"
                        />
                    </div>
                    <p class="text-sm text-gray-600" v-if="listA.trim()">
                        已检测到
                        <UBadge color="primary" variant="subtle">{{
                            namesAInfo.validCount
                        }}</UBadge>
                        个有效姓名
                        <template v-if="namesAInfo.invalidNames.length > 0">
                            ，
                            <UBadge color="error" variant="subtle">{{
                                namesAInfo.invalidNames.length
                            }}</UBadge>
                            个无效姓名
                        </template>

                        <template v-if="namesAInfo.duplicates.length > 0">
                            ，<UBadge color="warning" variant="subtle">{{
                                namesAInfo.duplicates.length
                            }}</UBadge>
                            个重复姓名
                        </template>

                        <UButton
                            v-if="
                                namesAInfo.invalidNames.length > 0 ||
                                namesAInfo.duplicates.length > 0
                            "
                            variant="ghost"
                            size="xs"
                            :color="showListADetails ? 'gray' : 'primary'"
                            :icon="
                                showListADetails
                                    ? 'i-heroicons-eye-slash'
                                    : 'i-heroicons-eye'
                            "
                            class="align-middle"
                            style="padding: 4px"
                            @click="showListADetails = !showListADetails"
                        />
                    </p>
                </div>

                <div
                    v-if="
                        showListADetails &&
                        (namesAInfo.invalidNames.length > 0 ||
                            namesAInfo.duplicates.length > 0)
                    "
                    class="mt-3 rounded p-2 max-h-36 overflow-y-auto ring-1 ring-gray-200 dark:ring-gray-700"
                >
                    <div v-if="namesAInfo.invalidNames.length > 0">
                        <div class="text-sm font-medium text-red-600 mb-1">
                            无效姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(name, index) in namesAInfo.invalidNames"
                                :key="'invalid-a-' + index"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="namesAInfo.duplicates.length > 0">
                        <div class="text-sm font-medium text-orange-600 mb-1">
                            重复姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) in namesAInfo.duplicates"
                                :key="'dupe-a-' + index"
                            >
                                {{ item.name }}
                                <UBadge color="orange" size="xs" class="ml-2">
                                    出现 {{ item.count }} 次
                                </UBadge>
                            </li>
                        </ul>
                    </div>
                </div>
            </UCard>

            <!-- 名单 B -->
            <UCard>
                <div class="text-lg font-semibold mb-2">名单 B</div>
                <UTextarea
                    v-model="listB"
                    :rows="12"
                    class="w-full h-full"
                    placeholder="请输入第二份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                />
                <div class="mt-2 flex items-center justify-between">
                    <div>
                        <UInput
                            type="file"
                            accept=".txt,.csv"
                            @change="handleFileB"
                            icon="i-heroicons-document-arrow-up"
                            size="sm"
                            class="w-50"
                        />
                    </div>
                    <p class="text-sm text-gray-600" v-if="listB.trim()">
                        已检测到
                        <UBadge color="primary" variant="subtle">{{
                            namesBInfo.validCount
                        }}</UBadge>
                        个有效姓名
                        <template v-if="namesBInfo.invalidNames.length > 0">
                            ，
                            <UBadge color="error" variant="subtle">{{
                                namesBInfo.invalidNames.length
                            }}</UBadge>
                            个无效姓名
                        </template>

                        <template v-if="namesBInfo.duplicates.length > 0">
                            ，<UBadge color="warning" variant="subtle">{{
                                namesBInfo.duplicates.length
                            }}</UBadge>
                            个重复姓名
                        </template>

                        <UButton
                            v-if="
                                namesBInfo.invalidNames.length > 0 ||
                                namesBInfo.duplicates.length > 0
                            "
                            variant="ghost"
                            size="xs"
                            :color="showListBDetails ? 'gray' : 'primary'"
                            :icon="
                                showListBDetails
                                    ? 'i-heroicons-eye-slash'
                                    : 'i-heroicons-eye'
                            "
                            class="align-middle"
                            style="padding: 4px"
                            @click="showListBDetails = !showListBDetails"
                        />
                    </p>
                </div>

                <div
                    v-if="
                        showListBDetails &&
                        (namesBInfo.invalidNames.length > 0 ||
                            namesBInfo.duplicates.length > 0)
                    "
                    class="mt-3 rounded p-2 max-h-36 overflow-y-auto ring-1 ring-gray-200 dark:ring-gray-700"
                >
                    <div v-if="namesBInfo.invalidNames.length > 0">
                        <div class="text-sm font-medium text-red-600 mb-1">
                            无效姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(name, index) in namesBInfo.invalidNames"
                                :key="'invalid-b-' + index"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="namesBInfo.duplicates.length > 0">
                        <div class="text-sm font-medium text-orange-600 mb-1">
                            重复姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) in namesBInfo.duplicates"
                                :key="'dupe-b-' + index"
                            >
                                {{ item.name }}
                                <UBadge color="orange" size="xs" class="ml-2">
                                    出现 {{ item.count }} 次
                                </UBadge>
                            </li>
                        </ul>
                    </div>
                </div>
            </UCard>
        </div>

        <div
            v-if="showResults"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
            <!-- 只在A中存在的名字 -->
            <UCard>
                <div class="flex items-center justify-between mb-2">
                    <div class="text-lg font-semibold">仅在名单 A 中存在</div>
                    <UBadge color="primary" variant="subtle">{{
                        onlyInA.length
                    }}</UBadge>
                </div>
                <div class="max-h-64 overflow-y-auto">
                    <ul>
                        <li
                            v-for="(name, index) in onlyInA"
                            :key="'a-' + index"
                        >
                            {{ name }}
                        </li>
                    </ul>
                </div>
            </UCard>

            <!-- 在A和B中都存在的名字 -->
            <UCard>
                <div class="flex items-center justify-between mb-2">
                    <div class="text-lg font-semibold">
                        在名单 A 和 B 中都存在
                    </div>
                    <UBadge color="green" variant="solid" size="sm">{{
                        inBoth.length
                    }}</UBadge>
                </div>
                <div class="max-h-64 overflow-y-auto">
                    <ul>
                        <li
                            v-for="(name, index) in inBoth"
                            :key="'both-' + index"
                        >
                            {{ name }}
                        </li>
                    </ul>
                </div>
            </UCard>

            <!-- 只在B中存在的名字 -->
            <UCard>
                <div class="flex items-center justify-between mb-2">
                    <div class="text-lg font-semibold">仅在名单 B 中存在</div>
                    <UBadge color="primary" variant="subtle">{{
                        onlyInB.length
                    }}</UBadge>
                </div>
                <div class="max-h-64 overflow-y-auto">
                    <ul>
                        <li
                            v-for="(name, index) in onlyInB"
                            :key="'b-' + index"
                        >
                            {{ name }}
                        </li>
                    </ul>
                </div>
            </UCard>
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
import { ref, watch, reactive, computed } from "vue";

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

// 控制显示/隐藏无效和重复名单
const showListADetails = ref(true);
const showListBDetails = ref(true);

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
const handleFileA = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            listA.value = e.target.result;
        };
        reader.readAsText(file);
    }
};

// 处理文件上传 - 名单B
const handleFileB = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            listB.value = e.target.result;
        };
        reader.readAsText(file);
    }
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
