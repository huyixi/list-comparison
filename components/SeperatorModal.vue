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
                    v-for="separator in filteredSeparators"
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
                <p
                    v-if="filteredSeparators.length === 0"
                    class="text-sm text-gray-400"
                >
                    回车添加此分隔符。
                </p>
            </div>
        </template>
        <template #footer>
            <div class="px-6 py-2">
                <UButton
                    variant="ghost"
                    color="neutral"
                    leading-icon="i-lucide-rotate-cw"
                    :ui="{
                        base: 'p-0 gap-1 hover:cursor-pointer',
                        leadingIcon: 'size-3',
                    }"
                    @click="resetSeparators"
                >
                    重置
                </UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { useSeparators } from "~/composables/useSerapators";
import type { SeparatorItem } from "~/types/separators";

const props = defineProps({
    totalCount: Number,
});

const isModalOpen = ref(false);

const {
    separators,
    selectedSeparatorIds,
    separatorQuery,
    isCustom,
    addCustomSeparator,
    removeCustomSeparator,
    handleSeparatorClick,
    resetSeparators,
} = useSeparators();

const openSeparatorPopover = () => {
    isModalOpen.value = true;
};

const filteredSeparators = computed(() => {
    const query = separatorQuery.value.trim().toLowerCase();

    if (!query) return separators.value;

    return separators.value.filter((sep: SeparatorItem) => {
        const labelMatch = sep.label.toLowerCase().includes(query);

        if (isCustom(sep)) {
            return labelMatch;
        }

        const descriptionMatch = sep.description?.toLowerCase().includes(query);
        const idMatch = sep.id.toLowerCase().includes(query);

        return labelMatch || descriptionMatch || idMatch;
    });
});
</script>
