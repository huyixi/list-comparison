<template>
    <UModal
        :ui="{
            content:
                'bg-elevated/75 rounded-none border-none shadow-none ring-0',
        }"
    >
        <template #content>
            <img
                :src="props.selectedImageUrl"
                alt="preview"
                class="max-w-[50svh] max-h-[50svh] object-contain"
            />
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
    selectedImageUrl: {
        type: String,
        required: true,
    },
});
</script>
