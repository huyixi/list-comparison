<!-- ./components/image-import/Preview.vue -->
<template>
    <UModal
        :ui="{
            content:
                'bg-elevated/75 rounded-none border-none shadow-none ring-0',
        }"
        v-model:open="isOpen"
    >
        <template #content>
            <ImageImportEditor @close="isOpen = false" />
        </template>
    </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(true);
</script>
