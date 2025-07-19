<!-- ./components/image-import/Preview.vue -->
<script setup lang="ts"></script>
<template>
    <UModal
        :ui="{
            content:
                'bg-elevated/75 rounded-none border-none shadow-none ring-0',
        }"
    >
        <template #content>
            <ImageImportCropper />
        </template>
    </UModal>
</template>
