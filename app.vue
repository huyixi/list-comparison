<template>
    <div class="w-full min-h-screen bg-[#f8fafc]">
        <main class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6 text-[#3b82f6] text-center">
                名单对比工具
            </h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <!-- 第一份名单 -->
                <div class="rounded-lg bg-white p-4 shadow-md">
                    <h2 class="text-lg font-semibold mb-2">名单 A</h2>
                    <textarea
                        v-model="listA"
                        class="w-full h-64 border rounded p-2"
                        placeholder="请输入第一份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                    ></textarea>
                    <div class="mt-2 flex items-center justify-between">
                        <div>
                            <input
                                type="file"
                                @change="handleFileA"
                                class="hidden"
                                id="fileA"
                                accept=".txt,.csv"
                            />
                            <label for="fileA" class="secondary-btn mr-2">
                                上传文件
                            </label>
                        </div>
                        <p class="text-sm text-gray-600" v-if="listA.trim()">
                            已检测到
                            <span class="font-semibold">{{
                                listAStats.valid
                            }}</span>
                            个有效姓名，
                            <span
                                v-if="listAStats.invalid > 0"
                                class="font-semibold text-red-500"
                            >
                                {{ listAStats.invalid }}
                            </span>
                            <span v-else class="font-semibold">{{
                                listAStats.invalid
                            }}</span>
                            个无效姓名
                            <span
                                v-if="
                                    !showInvalidNamesA && listAStats.invalid > 0
                                "
                                @click="toggleInvalidNames('A')"
                                class="font-semibold hover:cursor-pointer text-xl"
                            >
                                +
                            </span>
                            <span
                                v-if="
                                    showInvalidNamesA && listAStats.invalid > 0
                                "
                                @click="toggleInvalidNames('A')"
                                class="font-semibold hover:cursor-pointer text-xl"
                            >
                                -
                            </span>
                        </p>
                    </div>

                    <!-- 无效姓名折叠面板 -->
                    <div
                        v-if="showInvalidNamesA && listAStats.invalid > 0"
                        class="mt-3 p-3 bg-gray-50 rounded border border-gray-200 transition-all duration-300"
                    >
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-medium text-sm">无效姓名列表</div>
                        </div>
                        <ul class="max-h-36 overflow-y-auto list-disc pl-6">
                            <li
                                v-for="(name, index) in getInvalidNames(listA)"
                                :key="index"
                                class="py-1 px-2 text-sm border-gray-100 last:border-b-0"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 第二份名单 -->
                <div class="rounded-lg bg-white p-4 shadow-md">
                    <h2 class="text-lg font-semibold mb-2">名单 B</h2>
                    <textarea
                        v-model="listB"
                        class="w-full h-64 border rounded p-2"
                        placeholder="请输入第二份名单。可用逗号、空格、句号、斜杠、括号或换行分隔名字。"
                    ></textarea>
                    <div class="mt-2 flex items-center justify-between">
                        <div>
                            <input
                                type="file"
                                @change="handleFileB"
                                class="hidden"
                                id="fileB"
                                accept=".txt,.csv"
                            />
                            <label for="fileB" class="secondary-btn mr-2">
                                上传文件
                            </label>
                        </div>
                        <p class="text-sm text-gray-600" v-if="listB.trim()">
                            已检测到
                            <span class="font-semibold">{{
                                listBStats.valid
                            }}</span>
                            个有效姓名，
                            <span
                                v-if="listBStats.invalid > 0"
                                class="font-semibold text-red-500"
                            >
                                {{ listBStats.invalid }}
                            </span>
                            <span v-else class="font-semibold">{{
                                listBStats.invalid
                            }}</span>
                            个无效姓名
                            <span
                                v-if="
                                    !showInvalidNamesB && listBStats.invalid > 0
                                "
                                @click="toggleInvalidNames('B')"
                                class="font-semibold hover:cursor-pointer text-xl"
                            >
                                +
                            </span>
                            <span
                                v-if="
                                    showInvalidNamesB && listBStats.invalid > 0
                                "
                                @click="toggleInvalidNames('B')"
                                class="font-semibold hover:cursor-pointer text-xl"
                            >
                                -
                            </span>
                        </p>
                    </div>

                    <!-- 无效姓名折叠面板 -->
                    <div
                        v-if="showInvalidNamesB && listBStats.invalid > 0"
                        class="mt-3 p-3 bg-gray-50 rounded border border-gray-200 transition-all duration-300"
                    >
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-medium text-sm">无效姓名列表</div>
                        </div>
                        <ul class="max-h-36 overflow-y-auto list-disc pl-6">
                            <li
                                v-for="(name, index) in getInvalidNames(listB)"
                                :key="index"
                                class="py-1 px-2 text-sm border-gray-100 last:border-b-0"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div
                v-if="showResults"
                class="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <!-- 只在A中存在的名字 -->
                <div class="rounded-lg shadow-md p-4 bg-white">
                    <h2 class="text-lg font-semibold mb-2">
                        仅在名单 A 中存在 ({{ onlyInA.length }})
                    </h2>
                    <div class="max-h-64 overflow-y-auto">
                        <ul class="list-disc pl-6">
                            <li
                                v-for="(name, index) in onlyInA"
                                :key="'a-' + index"
                                class="mb-1"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 在A和B中都存在的名字 -->
                <div class="rounded-lg shadow-md p-4 bg-white">
                    <h2 class="text-lg font-semibold mb-2">
                        在名单 A 和 B 中都存在 ({{ inBoth.length }})
                    </h2>
                    <div class="max-h-64 overflow-y-auto">
                        <ul class="list-disc pl-6">
                            <li
                                v-for="(name, index) in inBoth"
                                :key="'both-' + index"
                                class="mb-1"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 只在B中存在的名字 -->
                <div class="rounded-lg shadow-md p-4 bg-white">
                    <h2 class="text-lg font-semibold mb-2">
                        仅在名单 B 中存在 ({{ onlyInB.length }})
                    </h2>
                    <div class="max-h-64 overflow-y-auto">
                        <ul class="list-disc pl-6">
                            <li
                                v-for="(name, index) in onlyInB"
                                :key="'b-' + index"
                                class="mb-1"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 导出结果 -->
            <div v-if="showResults" class="mt-6 text-center">
                <button
                    @click="exportResults"
                    class="bg-purple-500 text-white px-6 py-2 rounded font-semibold"
                >
                    导出结果
                </button>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, watch, reactive } from "vue";

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

// 统计信息
const listAStats = reactive({ valid: 0, invalid: 0 });
const listBStats = reactive({ valid: 0, invalid: 0 });

// 折叠面板状态
const showInvalidNamesA = ref(false);
const showInvalidNamesB = ref(false);

// 切换折叠面板
const toggleInvalidNames = (list) => {
    if (list === "A") {
        showInvalidNamesA.value = !showInvalidNamesA.value;
    } else if (list === "B") {
        showInvalidNamesB.value = !showInvalidNamesB.value;
    }
};

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

// 将文本解析为名字数组，支持多种分隔符，并统计有效/无效名字
const parseNames = (text, stats = null) => {
    if (text.trim() === "") {
        if (stats) {
            stats.valid = 0;
            stats.invalid = 0;
        }
        return [];
    }

    // 先用换行分割
    let allNames = text.split(/\n/);

    // 对每个结果再用各种分隔符分割
    // 包括: 逗号, 中文逗号, 顿号, 分号, 空格, 句号, 中文句号, 斜杠, 反斜杠, 括号等
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

    // 更新统计信息
    if (stats) {
        stats.valid = validNames.length;
        stats.invalid = invalidCount;
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
    const namesA = parseNames(listA.value, listAStats);
    const namesB = parseNames(listB.value, listBStats);

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
    parseNames(listA.value, listAStats);
    parseNames(listB.value, listBStats);

    // 如果两个列表都有内容，进行比较
    if (listA.value.trim() !== "" && listB.value.trim() !== "") {
        compareNames();
    } else {
        showResults.value = false;
    }
});
</script>
