// pages/index.vue
<template>
    <div class="w-full min-h-screen bg-[#f8fafc]">
        <main class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6 text-[#3b82f6] text-center">名单对比工具</h1>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
                <!-- 第一份名单 -->
                <div class="rounded bg-white p-4 shadow-md">
                    <h2 class="text-lg font-semibold mb-2">名单 A</h2>
                    <textarea v-model="listA" class="w-full h-128 border rounded p-2"
                        placeholder="请输入第一份名单，每行一个名字"></textarea>
                    <div class="mt-2">
                        <input type="file" @change="handleFileA" class="hidden" id="fileA" accept=".txt" />
                        <label for="fileA" class="secondary-btn">
                            上传文件
                        </label>
                    </div>
                </div>

                <!-- 第二份名单 -->
                <div class="rounded bg-white p-4 shadow-md">
                    <h2 class="text-lg font-semibold mb-2">名单 B</h2>
                    <textarea v-model="listB" class="w-full h-128 border rounded p-2"
                        placeholder="请输入第二份名单，每行一个名字"></textarea>
                    <div class="mt-2">
                        <input type="file" @change="handleFileB" class="hidden" id="fileB" accept=".txt" />
                        <label for="fileB" class="secondary-btn">
                            上传文件
                        </label>
                    </div>
                </div>
            </div>

            <div class="text-center mb-6">
                <button @click="compareNames" class="primary-btn text-white px-6 py-2 rounded font-semibold">
                    对比名单
                </button>
            </div>

            <div v-if="showResults" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 只在A中存在的名字 -->
                <div class=" rounded p-4">
                    <h2 class="text-lg font-semibold mb-2">
                        仅在名单 A 中存在 ({{ onlyInA.length }})
                    </h2>
                    <div class="max-h-64 overflow-y-auto">
                        <ul class="list-disc pl-6">
                            <li v-for="(name, index) in onlyInA" :key="'a-' + index" class="mb-1">
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- 只在B中存在的名字 -->
                <div class=" rounded p-4">
                    <h2 class="text-lg font-semibold mb-2">
                        仅在名单 B 中存在 ({{ onlyInB.length }})
                    </h2>
                    <div class="max-h-64 overflow-y-auto">
                        <ul class="list-disc pl-6">
                            <li v-for="(name, index) in onlyInB" :key="'b-' + index" class="mb-1">
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 导出结果 -->
            <div v-if="showResults" class="mt-6 text-center">
                <button @click="exportResults" class="bg-purple-500 text-white px-6 py-2 rounded font-semibold">
                    导出结果
                </button>
            </div>
        </main>


    </div>

</template>

<script setup>
import { ref } from "vue";

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const showResults = ref(false);

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
    // 将输入的文本分割成数组，并去除空行和空格
    const namesA = listA.value
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name !== "");

    const namesB = listB.value
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name !== "");

    // 转换为Set，便于快速查找
    const setA = new Set(namesA);
    const setB = new Set(namesB);

    // 找出只在A中存在的名字
    onlyInA.value = [...setA].filter((name) => !setB.has(name));

    // 找出只在B中存在的名字
    onlyInB.value = [...setB].filter((name) => !setA.has(name));

    // 显示结果
    showResults.value = true;
};

// 导出结果
const exportResults = () => {
    let content = "仅在名单A中存在的名字：\n";
    content += onlyInA.value.join("\n");
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
</script>
