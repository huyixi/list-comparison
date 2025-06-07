<template>
    <UTooltip text="自定义分隔符">
        <UButton
            type="button"
            icon="i-lucide-circle-ellipsis"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="separator-popover"
            class="hover:cursor-pointer"
            @click="openSeparatorPopover"
            :ui="{ base: 'gap-0.5 p-0' }"
        />
    </UTooltip>

    <UModal
        v-model:open="isModalOpen"
        :ui="{ body: 'p-4 sm:p-4', footer: 'justify-between p-4 sm:p-4' }"
        title="自定义分隔符"
    >
        <template #body>
            <UCard :ui="{ body: 'p-0 sm:p-0' }">
                <UCheckboxGroup
                    v-model="selectedSeparators"
                    :items="separators"
                    value-key="id"
                    label-key="label"
                    description-key="description"
                    :ui="{
                        fieldset: 'grid grid-cols-4 p-4 max-h-[200px]',
                        item: 'flex',
                        wrapper: 'flex flex-row gap-2',
                        label: 'w-2',
                        description: 'text-sm text-gray-400',
                    }"
                />
            </UCard>

            <div class="flex justify-end mt-4">
                <UInput
                    v-model="customSeparator"
                    placeholder="添加自定义分隔符"
                    size="md"
                    :ui="{ trailing: 'pr-0.5' }"
                    @keydown.enter="addCustomSeparator"
                >
                    <template #trailing>
                        <UTooltip text="添加自定义分隔符">
                            <UButton
                                :color="added ? 'success' : 'neutral'"
                                variant="link"
                                size="sm"
                                :icon="
                                    added
                                        ? 'i-lucide-circle-check'
                                        : 'i-lucide-circle-plus'
                                "
                                aria-label="添加自定义分隔符"
                                @click="addCustomSeparator"
                                class="hover:cursor-pointer"
                            />
                        </UTooltip>
                    </template>
                </UInput>
            </div>
        </template>

        <template #footer>
            <div class="flex gap-2 items-center">
                <UCheckbox
                    label="全选"
                    size="sm"
                    :ui="{
                        root: 'p-1.25 hover:cursor-pointer',
                        wrapper: 'ms-1',
                    }"
                    indicator="start"
                />
                <UCheckbox
                    label="应用于列表 B"
                    size="sm"
                    :ui="{
                        root: 'p-1.25 hover:cursor-pointer',
                        wrapper: 'ms-1',
                    }"
                    indicator="start"
                />
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref } from "vue";

const added = ref(false);
const isModalOpen = ref(true);
const customSeparator = ref("");

const separators = ref([
    { label: " ", description: "空格", id: "space" },
    { label: ",", description: "逗号", id: "comma" },
    { label: "|", description: "竖线", id: "pipe" },
    { label: ".", description: "句点", id: "dot" },
    { label: ";", description: "分号", id: "semicolon" },
    { label: ":", description: "冒号", id: "colon" },
    { label: "/", description: "斜杠", id: "slash" },
    { label: "\\", description: "反斜杠", id: "backslash" },
    { label: "-", description: "连字符", id: "dash" },
    { label: "_", description: "下划线", id: "underscore" },
    { label: "↵", description: "换行符", id: "newline" },
    { label: "↹", description: "制表符", id: "tab" },
] as { label: string; description: string; id: string }[]);

const selectedSeparators = ref<string[]>(separators.value.map((s) => s.id));

const openSeparatorPopover = () => {
    isModalOpen.value = true;
};

const addCustomSeparator = () => {
    const trimmed = customSeparator.value.trim();
    if (!trimmed) return;

    const exists = separators.value.some((s) => s.label === trimmed);
    if (!exists) {
        const newId = `custom-${Date.now()}`;
        separators.value.push({
            label: trimmed,
            description: "",
            id: newId,
        });

        selectedSeparators.value.push(newId);

        added.value = true;
        setTimeout(() => (added.value = false), 1000);
    }

    customSeparator.value = "";
};

const emit = defineEmits<{
    (e: "updateSeparators", value: string[]): void;
}>();

watch(selectedSeparators, (newValue) => {
    const selectedLabels = separators.value
        .filter((s) => newValue.includes(s.id))
        .map((s) => s.label);

    emit("updateSeparators", selectedLabels);
});
</script>
