<template>
    <UTooltip text="添加分隔符">
        <p
            class="text-gray-700 p-2 hover:cursor-pointer flex items-center gap-1"
            @click="openSeparatorPopover"
        >
            <span>检测到 {{ props.totalCount }} 项</span>
            <UIcon name="i-lucide-settings-2" class="size-3" />
        </p>
    </UTooltip>

    <UModal
        v-model:open="isModalOpen"
        :ui="{ body: 'p-0 sm:p-0', footer: 'justify-between p-0 sm:p-0' }"
        title="添加分隔符"
    >
        <template #body>
            <UInput
                v-model="separatorQuery"
                placeholder="添加或搜索分隔符"
                size="xl"
                variant="soft"
                :ui="{
                    root: 'flex',
                    base: 'rounded-none px-6',
                }"
                class="border-b-1 border-[var(--ui-border)]"
                @keydown.enter="addCustomSeparator"
            />
            <div class="flex flex-wrap gap-2 px-6 py-4">
                <UBadge
                    v-for="separator in separators"
                    :key="separator.id"
                    size="lg"
                    :variant="
                        selectedSeparatorIds.includes(separator.id)
                            ? 'solid'
                            : 'outline'
                    "
                    class="rounded-full pl-3 hover:cursor-pointer"
                    @click="handleSeparatorClick(separator)"
                >
                    <div class="inline-flex items-center gap-1">
                        <span>
                            {{ separator.label }}
                        </span>

                        <span
                            v-if="
                                separator.description &&
                                separator.description !== 'Custom Separator'
                            "
                            >{{ separator.description }}</span
                        >

                        <UIcon
                            v-if="isCustom(separator)"
                            name="i-lucide-x"
                            class="size-3 cursor-pointer"
                            @click.stop="removeCustomSeparator(separator)"
                        />
                    </div>
                </UBadge>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { SeparatorItem } from "@/types/index";
const props = defineProps({
    totalCount: {
        type: Number,
        required: true,
    },
});

const isModalOpen = ref(true);
const separatorQuery = ref("");

const separators = ref([
    { label: ",", description: "英文逗号", id: "comma" },
    { label: ".", description: "英文句点", id: "dot" },
    { label: " ", description: "空格", id: "space" },
    { label: ";", description: "英文分号", id: "semicolon" },
    { label: ":", description: "英文冒号", id: "colon" },

    { label: "，", description: "中文逗号", id: "ch-comma" },
    { label: "。", description: "中文句号", id: "ch-dot" },
    { label: "　", description: "全角空格", id: "full-space" },
    { label: "；", description: "中文分号", id: "ch-semicolon" },
    { label: "：", description: "中文冒号", id: "ch-colon" },

    { label: "|", description: "竖线", id: "pipe" },
    { label: "/", description: "斜杠", id: "slash" },
    { label: "\\", description: "反斜杠", id: "backslash" },
] as { label: string; description: string; id: string }[]);

const selectedSeparatorIds = ref<string[]>(separators.value.map((s) => s.id));

const openSeparatorPopover = () => {
    isModalOpen.value = true;
};

const addCustomSeparator = () => {
    console.log("Add Custom Separator", selectedSeparatorIds.value);
    const trimmed = separatorQuery.value.trim();
    if (!trimmed) return;

    const exists = separators.value.some((s) => s.label === trimmed);
    if (!exists) {
        const newId = `custom-${Date.now()}`;
        separators.value.push({
            label: trimmed,
            description: "Custom Separator",
            id: newId,
        });

        selectedSeparatorIds.value.push(newId);
    } else {
        console.log("Separator already exists");
    }

    separatorQuery.value = "";
};

const removeCustomSeparator = (separator: SeparatorItem) => {
    if (!isCustom(separator)) return;

    separators.value = separators.value.filter((s) => s.id !== separator.id);
    selectedSeparatorIds.value = selectedSeparatorIds.value.filter(
        (id) => id !== separator.id,
    );
};

const isCustom = (separator: SeparatorItem) =>
    separator.id.startsWith("custom-");

const handleSeparatorClick = (separator: {
    label: string;
    description?: string;
    id: string;
}) => {
    console.log("handleSeparatorClick", separator, selectedSeparatorIds);
    if (selectedSeparatorIds.value.includes(separator.id)) {
        selectedSeparatorIds.value = selectedSeparatorIds.value.filter(
            (id) => id !== separator.id,
        );
    } else {
        selectedSeparatorIds.value.push(separator.id);
    }
};

const emit = defineEmits<{
    (e: "updateSeparators", value: string[]): void;
}>();

const selectedSeparatorLabels = computed(() =>
    separators.value
        .filter((s) => selectedSeparatorIds.value.includes(s.id))
        .map((s) => s.label),
);
</script>
