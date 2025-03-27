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
                            listAStats.valid
                        }}</UBadge>
                        个有效姓名
                        <template v-if="listAStats.invalid > 0">
                            ，
                            <UBadge color="error" variant="subtle">{{
                                listAStats.invalid
                            }}</UBadge>
                            个无效姓名
                        </template>

                        <template v-if="listAStats.duplicates > 0">
                            ，<UBadge color="warning" variant="subtle">{{
                                listAStats.duplicates
                            }}</UBadge>
                            个重复姓名
                        </template>

                        <UButton
                            v-if="
                                listAStats?.invalid > 0 ||
                                listAStats?.duplicates > 0
                            "
                            variant="ghost"
                            size="xs"
                            :color="showListADetails ? 'gray' : 'primary'"
                            :icon="
                                showListADetails
                                    ? 'i-heroicons-eye-slash'
                                    : 'i-heroicons-eye'
                            "
                            class="align-middle p-0"
                            @click="showListADetails = !showListADetails"
                        />
                    </p>
                </div>

                <div
                    v-if="
                        showListADetails &&
                        (listAStats.invalid > 0 || listAStats.duplicates > 0)
                    "
                    class="mt-3 rounded p-2 max-h-36 overflow-y-auto ring-1 ring-gray-200 dark:ring-gray-700"
                >
                    <div v-if="listAStats.invalid > 0">
                        <div class="text-sm font-medium text-red-600 mb-1">
                            无效姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(name, index) in getInvalidNames(listA)"
                                :key="'invalid-a-' + index"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                    <div v-if="listAStats.duplicates > 0">
                        <div class="text-sm font-medium text-orange-600 mb-1">
                            重复姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) in getDuplicateNames(
                                    listADuplicates,
                                )"
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
                            listBStats.valid
                        }}</UBadge>
                        个有效姓名
                        <template v-if="listBStats.invalid > 0">
                            ，
                            <UBadge color="error" variant="subtle">{{
                                listBStats.invalid
                            }}</UBadge>
                            个无效姓名
                        </template>

                        <template v-if="listBStats.duplicates > 0">
                            ，<UBadge color="warning" variant="subtle">{{
                                listBStats.duplicates
                            }}</UBadge>
                            个重复姓名
                        </template>

                        <UButton
                            v-if="
                                listBStats?.invalid > 0 ||
                                listBStats?.duplicates > 0
                            "
                            variant="ghost"
                            size="xs"
                            :color="showListBDetails ? 'gray' : 'primary'"
                            :icon="
                                showListBDetails
                                    ? 'i-heroicons-eye-slash'
                                    : 'i-heroicons-eye'
                            "
                            class="align-middle p-0"
                            @click="showListBDetails = !showListBDetails"
                        />
                    </p>
                </div>

                <div
                    v-if="
                        showListBDetails &&
                        (listBStats.invalid > 0 || listBStats.duplicates > 0)
                    "
                    class="mt-3 rounded p-2 max-h-36 overflow-y-auto ring-1 ring-gray-200 dark:ring-gray-700"
                >
                    <div v-if="listBStats.invalid > 0">
                        <div class="text-sm font-medium text-red-600 mb-1">
                            无效姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(name, index) in getInvalidNames(listB)"
                                :key="'invalid-b-' + index"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="listBStats.duplicates > 0">
                        <div class="text-sm font-medium text-orange-600 mb-1">
                            重复姓名：
                        </div>
                        <ul>
                            <li
                                v-for="(item, index) in getDuplicateNames(
                                    listBDuplicates,
                                )"
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
                    <UBadge color="blue" variant="solid" size="sm">{{
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
                    <UBadge color="amber" variant="solid" size="sm">{{
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
import { ref, watch, reactive } from "vue";

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

// 保存重复姓名信息
const listADuplicates = ref({});
const listBDuplicates = ref({});

// 控制显示/隐藏无效和重复名单
const showListADetails = ref(true);
const showListBDetails = ref(true);

// 统计信息
const listAStats = reactive({ valid: 0, invalid: 0, duplicates: 0 });
const listBStats = reactive({ valid: 0, invalid: 0, duplicates: 0 });

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

// 获取一个列表中的无效姓名
const getInvalidNames = (text) => {
    if (text.trim() === "") {
        return [];
    }

    // 使用与parseNames相同的逻辑分割名字
    let allNames = text.split(/\n/);
    allNames = allNames.flatMap((line) =>
        line.split(/[,，、;;\s\.。\/\\\(\)\[\]\{\}【】（）]+/),
    );

    // 过滤出非空但无效的名字
    return allNames
        .map((name) => name.trim())
        .filter((name) => name !== "" && !isValidName(name));
};

// 将重复姓名对象转换为排序后的数组
const getDuplicateNames = (duplicatesObj) => {
    return Object.entries(duplicatesObj)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
};

// 将文本解析为名字数组，支持多种分隔符，并统计有效/无效名字
const parseNames = (text, stats = null, duplicatesObj = null) => {
    if (text.trim() === "") {
        if (stats) {
            stats.valid = 0;
            stats.invalid = 0;
            stats.duplicates = 0;
        }
        if (duplicatesObj) {
            Object.keys(duplicatesObj).forEach(
                (key) => delete duplicatesObj[key],
            );
        }
        return [];
    }

    // 先用换行分割
    let allNames = text.split(/\n/);

    // 对每个结果再用各种分隔符分割
    allNames = allNames.flatMap((line) =>
        line.split(/[,，、;;\s\.。\/\\\(\)\[\]\{\}【】（）]+/),
    );

    // 预处理所有名字
    allNames = allNames.map((name) => name.trim());

    // 过滤出有效和无效名字
    const validNames = allNames.filter(
        (name) => name !== "" && !isOnlySymbols(name),
    );
    const invalidCount =
        allNames.filter((name) => name !== "").length - validNames.length;

    // 检测重复名字
    const nameCount = {};
    validNames.forEach((name) => {
        nameCount[name] = (nameCount[name] || 0) + 1;
    });

    // 计算重复名字数量
    const duplicateNameCount = Object.values(nameCount).filter(
        (count) => count > 1,
    ).length;

    // 更新重复名字对象
    if (duplicatesObj) {
        Object.keys(duplicatesObj).forEach((key) => delete duplicatesObj[key]);
        Object.entries(nameCount).forEach(([name, count]) => {
            duplicatesObj[name] = count;
        });
    }

    // 更新统计信息
    if (stats) {
        stats.valid = validNames.length;
        stats.invalid = invalidCount;
        stats.duplicates = duplicateNameCount;
    }

    return validNames;
};

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
    // 使用增强的parseNames函数解析输入
    const namesA = parseNames(listA.value, listAStats, listADuplicates);
    const namesB = parseNames(listB.value, listBStats, listBDuplicates);

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
    if (listAStats.duplicates > 0) {
        content += "\n\n名单A中的重复姓名：\n";
        getDuplicateNames(listADuplicates).forEach((item) => {
            content += `${item.name} (出现${item.count}次)\n`;
        });
    }

    if (listBStats.duplicates > 0) {
        content += "\n\n名单B中的重复姓名：\n";
        getDuplicateNames(listBDuplicates).forEach((item) => {
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
    // 单独解析两个列表以获取统计数据
    parseNames(listA.value, listAStats, listADuplicates);
    parseNames(listB.value, listBStats, listBDuplicates);

    // 如果两个列表都有内容，进行比较
    if (listA.value.trim() !== "" && listB.value.trim() !== "") {
        compareNames();
    } else {
        showResults.value = false;
    }
});
</script>
