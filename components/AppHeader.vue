<script setup lang="ts">
const siteConfig = useSiteConfig();
</script>

<template>
    <header class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">
            {{ siteConfig.name }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
            {{ siteConfig.description }}
        </p>
    </header>
</template>
