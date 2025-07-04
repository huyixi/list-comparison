<template>
    <UModal>
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
