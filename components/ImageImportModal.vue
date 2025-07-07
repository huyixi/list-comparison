<template>
    <UModal
        v-model:open="isModalOpen"
        :ui="{ body: 'p-4 sm:p-4', footer: 'justify-between p-4 sm:p-4' }"
        title="图片识别"
    >
        <template #body> </template>
        <template #footer>
            <UButton
                color="primary"
                variant="solid"
                size="sm"
                class="hover:cursor-pointer"
                @click="importSelectedData"
            >
                识别文字并导入
            </UButton>
        </template>
    </UModal>
</template>
<script setup lang="ts">
const isModalOpen = ref(true);
</script>
