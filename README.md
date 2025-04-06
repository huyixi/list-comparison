<template>
    <UContainer class="py-8">
        <header class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">
                List Comparison Tool
            </h1>
            <p class="text-sm text-gray-500 mt-1">
                Compare two lists and identify unique and common items
            </p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">List A</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadA"
                            aria-label="Upload List A"
                        >
                        </UButton>
                        <input
                            type="file"
                            accept=".txt,.csv"
                            @change="handleFileUpload($event, 'A')"
                            class="hidden"
                            ref="fileInputA"
                        />
                        </div>
                </div>
                <textarea
                    v-model="listA"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="Enter the first list. Items can be separated by commas, semicolons, tabs, or new lines."
                ></textarea>
                <div
                    class="flex items-center justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                    <UPopover v-if="listAInfo.validUniqueNames.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                             <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                             <span class="text-gray-700">{{ listAInfo.validCount }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium mb-1">Valid Unique Items ({{ listAInfo.validCount }})</div>
                                 <ul class="space-y-0.5">
                                    <li v-for="(name, index) in listAInfo.validUniqueNames" :key="'valid-a-' + index">
                                        {{ name }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listAInfo.duplicates.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                            <span class="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                            <span class="text-gray-700">{{ listAInfo.duplicates.length }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium text-orange-600 mb-1">Duplicates Found ({{ listAInfo.duplicates.length }} types)</div>
                                 <ul class="space-y-0.5">
                                    <li v-for="(item, index) in listAInfo.duplicates" :key="'dup-a-' + index" class="flex items-center justify-between">
                                        <span>{{ item.name }}</span>
                                        <UBadge color="orange" variant="soft" size="xs" class="ml-2">
                                            {{ item.count }} times
                                        </UBadge>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listAInfo.invalidNames.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                            <span class="w-2 h-2 rounded-full bg-rose-500 mr-1"></span>
                            <span class="text-gray-700">{{ listAInfo.invalidCount }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium text-red-600 mb-1">Invalid / Skipped Items ({{ listAInfo.invalidCount }})</div>
                                 <ul class="space-y-0.5">
                                     <li v-for="(item, index) in listAInfo.invalidNames" :key="'invalid-a-' + index">
                                        '{{ item }}'
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">List B</h2>
                    <div class="flex items-center gap-2">
                        <UButton
                            icon="i-heroicons-document-arrow-up"
                            size="xs"
                            color="neutral"
                            variant="outline"
                            class="hover:cursor-pointer"
                            @click="triggerFileUploadB"
                             aria-label="Upload List B"
                        >
                        </UButton>
                        <input
                            type="file"
                             accept=".txt,.csv"
                             @change="handleFileUpload($event, 'B')"
                            class="hidden"
                            ref="fileInputB"
                        />
                         </div>
                </div>
                <textarea
                    v-model="listB"
                    class="w-full min-h-80 p-3 border-0 focus:ring-0 resize-none flex-1"
                    placeholder="Enter the second list. Items can be separated by commas, semicolons, tabs, or new lines."
                 ></textarea>
                 <div
                    class="flex items-center justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 text-xs"
                >
                     <UPopover v-if="listBInfo.validUniqueNames.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                             <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                             <span class="text-gray-700">{{ listBInfo.validCount }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium mb-1">Valid Unique Items ({{ listBInfo.validCount }})</div>
                                 <ul class="space-y-0.5">
                                    <li v-for="(name, index) in listBInfo.validUniqueNames" :key="'valid-b-' + index">
                                        {{ name }}
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listBInfo.duplicates.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                            <span class="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                            <span class="text-gray-700">{{ listBInfo.duplicates.length }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium text-orange-600 mb-1">Duplicates Found ({{ listBInfo.duplicates.length }} types)</div>
                                 <ul class="space-y-0.5">
                                    <li v-for="(item, index) in listBInfo.duplicates" :key="'dup-b-' + index" class="flex items-center justify-between">
                                        <span>{{ item.name }}</span>
                                        <UBadge color="orange" variant="soft" size="xs" class="ml-2">
                                            {{ item.count }} times
                                        </UBadge>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>

                    <UPopover v-if="listBInfo.invalidNames.length > 0" mode="hover">
                         <span class="flex items-center hover:cursor-pointer">
                            <span class="w-2 h-2 rounded-full bg-rose-500 mr-1"></span>
                            <span class="text-gray-700">{{ listBInfo.invalidCount }}</span>
                        </span>
                        <template #panel>
                             <div class="p-3 max-w-sm max-h-72 overflow-y-auto text-xs">
                                 <div class="font-medium text-red-600 mb-1">Invalid / Skipped Items ({{ listBInfo.invalidCount }})</div>
                                 <ul class="space-y-0.5">
                                    <li v-for="(item, index) in listBInfo.invalidNames" :key="'invalid-b-' + index">
                                       '{{ item }}'
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </UPopover>
                </div>
            </div>
        </div>

        <div
            v-if="!showResults"
            class="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center"
        >
            <div class="flex flex-col items-center justify-center">
                <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                    <UIcon name="i-heroicons-document-duplicate" class="text-gray-400 w-8 h-8" />
                 </div>
                <h3 class="text-lg font-medium text-gray-700 mb-2">
                    No comparison results yet
                </h3>
                <p class="text-sm text-gray-500 max-w-md mx-auto mb-4">
                    Enter or upload lists in the areas above to see the differences and similarities between them.
                </p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">
                        Only in List A
                    </h2>
                    <UButton
                        :icon="onlyInACopied ? 'i-heroicons-check-badge' : 'i-heroicons-clipboard-document'"
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInA, 'only-in-a')"
                        aria-label="Copy items only in List A"
                     />
                 </div>
                 <div class="min-h-64 max-h-64 overflow-y-auto">
                     <ul class="text-sm">
                        <li
                            v-for="(name, index) in onlyInA"
                            :key="'a-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                             {{ name }}
                        </li>
                        <li v-if="onlyInA.length === 0" class="px-3 py-4 text-center text-gray-400 text-xs">
                            No unique items found in List A.
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ onlyInA.length }} items
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                     <h2 class="text-base font-medium text-gray-700">
                         In Both Lists
                    </h2>
                    <UButton
                        :icon="inBothCopied ? 'i-heroicons-check-badge' : 'i-heroicons-clipboard-document'"
                        color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(inBoth, 'in-both')"
                        aria-label="Copy items present in both lists"
                    />
                </div>
                 <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="text-sm">
                        <li
                            v-for="(name, index) in inBoth"
                            :key="'both-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                         >
                             {{ name }}
                        </li>
                         <li v-if="inBoth.length === 0" class="px-3 py-4 text-center text-gray-400 text-xs">
                            No common items found.
                        </li>
                    </ul>
                </div>
                <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                >
                    {{ inBoth.length }} items
                </div>
            </div>

            <div
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col"
            >
                <div
                    class="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50"
                >
                    <h2 class="text-base font-medium text-gray-700">
                         Only in List B
                    </h2>
                    <UButton
                         :icon="onlyInBCopied ? 'i-heroicons-check-badge' : 'i-heroicons-clipboard-document'"
                         color="neutral"
                        size="xs"
                        variant="outline"
                        class="hover:cursor-pointer"
                        @click="copyToClipboard(onlyInB, 'only-in-b')"
                        aria-label="Copy items only in List B"
                    />
                </div>
                <div class="min-h-64 max-h-64 overflow-y-auto">
                    <ul class="text-sm">
                         <li
                            v-for="(name, index) in onlyInB"
                            :key="'b-' + index"
                            class="px-3 py-1.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                            {{ name }}
                        </li>
                         <li v-if="onlyInB.length === 0" class="px-3 py-4 text-center text-gray-400 text-xs">
                             No unique items found in List B.
                         </li>
                     </ul>
                 </div>
                 <div
                    class="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500"
                 >
                    {{ onlyInB.length }} items
                </div>
            </div>
        </div>

        <div v-if="showResults" class="text-center my-6">
            <UButton
                @click="exportResults"
                color="primary"
                icon="i-heroicons-arrow-down-tray"
                 class="font-semibold"
            >
                Export Results
            </UButton>
        </div>
    </UContainer>
</template>

<script setup>
import { ref, watch, computed } from "vue";

// Assuming Nuxt UI context for useToast
const toast = useToast();

const listA = ref("");
const listB = ref("");
const onlyInA = ref([]);
const onlyInB = ref([]);
const inBoth = ref([]);
const showResults = ref(false);

const fileInputA = ref(null);
const fileInputB = ref(null);

// --- Helper Functions ---

// Checks if a name is potentially invalid (empty or only symbols/whitespace)
// Allows letters (incl. Unicode), numbers, Han characters.
const isValidName = (name) => {
    if (!name || typeof name !== 'string') {
        return false;
    }
    const trimmedName = name.trim();
    if (trimmedName === "") {
        return false; // Empty or only whitespace is invalid
    }
    // Check if it contains at least one valid character (letter, number, Han)
    const validCharPattern = /[\p{L}\p{N}\p{Script=Han}]/u;
    return validCharPattern.test(trimmedName);
};

// --- Parsing and Analysis ---

// Parses raw text input into structured list information
const parseNameList = (text) => {
    const result = {
        rawCount: 0,          // Total items after splitting
        validCount: 0,        // Count of unique valid items
        invalidCount: 0,      // Count of invalid items
        duplicateInfoCount: 0, // Count of item types that have duplicates
        allNames: [],         // All non-empty strings after splitting and trimming
        validUniqueNames: [], // Array of unique, valid names
        invalidNames: [],     // Array of invalid/skipped names (non-empty)
        duplicates: [],       // Array of objects { name, count } for duplicated valid names
    };

    if (!text || typeof text !== 'string' || !text.trim()) {
        return result;
    }

    // Split by new lines first, then by common delimiters (comma, semicolon, tab)
    // Regex: Matches one or more occurrences of newline, comma, semicolon, or tab
    const items = text
        .split(/[\n,;、\t]+/) // Split by delimiters
        .map(name => name.trim()) // Trim whitespace from each potential item
        .filter(name => name !== ""); // Remove empty strings resulting from split/trim

    result.rawCount = items.length;
    result.allNames = items; // Store all non-empty trimmed items

    const nameCountMap = {};
    const validNamesSet = new Set();
    const tempInvalidNames = [];

    items.forEach(name => {
        if (isValidName(name)) {
            // Count occurrences for duplicate check
            nameCountMap[name] = (nameCountMap[name] || 0) + 1;
            // Add to set for unique valid list
            validNamesSet.add(name);
        } else {
             // Store invalid/skipped items
             tempInvalidNames.push(name);
        }
    });

    // Finalize results
    result.validUniqueNames = Array.from(validNamesSet).sort(); // Sorted unique valid names
    result.validCount = result.validUniqueNames.length;

    result.invalidNames = tempInvalidNames; // Assign collected invalid names
    result.invalidCount = result.invalidNames.length;

    // Calculate duplicates based on the counts of *valid* names
    result.duplicates = Object.entries(nameCountMap)
        .filter(([_, count]) => count > 1)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)); // Sort by count desc, then name asc

    result.duplicateInfoCount = result.duplicates.length; // How many types of items were duplicated

    return result;
};

// --- Computed Properties ---

const listAInfo = computed(() => parseNameList(listA.value));
const listBInfo = computed(() => parseNameList(listB.value));

// --- File Handling ---

const handleFileUpload = (event, listType) => {
    const file = event.target.files[0];
    if (file) {
        // Basic check for text file types (can be expanded)
        if (file.type === 'text/plain' || file.type === 'text/csv' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
             const reader = new FileReader();
             reader.onload = (e) => {
                if (listType === "A") {
                    listA.value = e.target.result;
                 } else if (listType === "B") {
                    listB.value = e.target.result;
                }
                // Reset file input value to allow uploading the same file again
                 event.target.value = '';
            };
            reader.onerror = (e) => {
                console.error("File reading error:", e);
                toast.add({ title: "Error Reading File", color: "red", icon: "i-heroicons-exclamation-triangle" });
                 event.target.value = '';
             };
            reader.readAsText(file);
        } else {
            // Handle other file types (like XLSX) if needed, possibly with a library
            // For now, show a warning for unsupported types
             console.warn(`Unsupported file type: ${file.type || file.name}`);
             toast.add({ title: "Unsupported File Type", description: "Please upload a .txt or .csv file.", color: "orange", icon: "i-heroicons-exclamation-triangle" });
             event.target.value = ''; // Reset file input
        }
    }
};

const triggerFileUploadA = () => {
    fileInputA.value?.click(); // Use optional chaining
};
const triggerFileUploadB = () => {
    fileInputB.value?.click(); // Use optional chaining
};

// --- Comparison Logic ---

const compareNames = () => {
    // Use the valid unique names for comparison
    const namesA = listAInfo.value.validUniqueNames;
    const namesB = listBInfo.value.validUniqueNames;

    // Reset results
    onlyInA.value = [];
    onlyInB.value = [];
    inBoth.value = [];

    // Only proceed if both lists have valid names to compare
    if (namesA.length === 0 && namesB.length === 0) {
        showResults.value = false;
        return;
    }

    const setA = new Set(namesA);
    const setB = new Set(namesB);

    // Find items only in A
    onlyInA.value = namesA.filter((name) => !setB.has(name));

    // Find items only in B
    onlyInB.value = namesB.filter((name) => !setA.has(name));

    // Find items in both A and B
    inBoth.value = namesA.filter((name) => setB.has(name));

    // Show results grid (even if one list was empty, to show the contents of the other as "Only in X")
     showResults.value = true;

    // Optional: Provide feedback if one list was empty but the other wasn't
    // if ((listA.value.trim() !== "" && listB.value.trim() === "") || (listA.value.trim() === "" && listB.value.trim() !== "")) {
    //    toast.add({ title: "Info", description: "One list is empty. Showing items from the other list.", color: "blue", icon: "i-heroicons-information-circle"});
    // }
};

// --- Export ---

const exportResults = () => {
    let content = "--- Only in List A ---\n";
    content += onlyInA.value.length > 0 ? onlyInA.value.join("\n") : "(None)";
    content += "\n\n--- In Both Lists ---\n";
    content += inBoth.value.length > 0 ? inBoth.value.join("\n") : "(None)";
    content += "\n\n--- Only in List B ---\n";
    content += onlyInB.value.length > 0 ? onlyInB.value.join("\n") : "(None)";

     // Add duplicate info if present
    if (listAInfo.value.duplicates.length > 0) {
        content += "\n\n--- Duplicates in List A ---\n";
        listAInfo.value.duplicates.forEach((item) => {
             content += `${item.name} (${item.count} times)\n`;
        });
    } else {
        content += "\n\n--- Duplicates in List A ---\n(None)";
    }

    if (listBInfo.value.duplicates.length > 0) {
        content += "\n\n--- Duplicates in List B ---\n";
        listBInfo.value.duplicates.forEach((item) => {
            content += `${item.name} (${item.count} times)\n`;
        });
    } else {
         content += "\n\n--- Duplicates in List B ---\n(None)";
    }

    // Add invalid info if present
    if (listAInfo.value.invalidNames.length > 0) {
        content += "\n\n--- Invalid/Skipped in List A ---\n";
        content += listAInfo.value.invalidNames.join("\n");
    } else {
        content += "\n\n--- Invalid/Skipped in List A ---\n(None)";
    }
     if (listBInfo.value.invalidNames.length > 0) {
        content += "\n\n--- Invalid/Skipped in List B ---\n";
        content += listBInfo.value.invalidNames.join("\n");
    } else {
        content += "\n\n--- Invalid/Skipped in List B ---\n(None)";
    }


    try {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
        link.download = `List_Comparison_${timestamp}.txt`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link); // Clean up
         URL.revokeObjectURL(url); // Free up memory
         toast.add({ title: "Export Successful", icon:"i-heroicons-check-circle", color:"green" });
    } catch (error) {
        console.error("Export failed:", error);
        toast.add({ title: "Export Failed", description: "Could not generate the download file.", color: "red", icon:"i-heroicons-exclamation-triangle" });
     }
};

// --- Clipboard ---

const onlyInACopied = ref(false);
const inBothCopied = ref(false);
const onlyInBCopied = ref(false);

const copyToClipboard = async (items, type) => { // Made async
    if (!items || items.length === 0) {
        toast.add({
            title: "Nothing to Copy",
            description: "The list is empty.",
            color: "blue",
             icon: "i-heroicons-information-circle"
        });
        return;
    }

    const textToCopy = items.join("\n");

    try {
        await navigator.clipboard.writeText(textToCopy); // Use await

        // Reset all copy states first
        onlyInACopied.value = false;
        inBothCopied.value = false;
        onlyInBCopied.value = false;

        // Set the appropriate copy state based on type
         if (type === "only-in-a") {
            onlyInACopied.value = true;
        } else if (type === "in-both") {
            inBothCopied.value = true;
        } else if (type === "only-in-b") {
            onlyInBCopied.value = true;
        }

        toast.add({ title: "Copied to Clipboard!", icon:"i-heroicons-check-circle", color:"green", timeout: 1600 });


        // Reset the copy state after timeout
        setTimeout(() => {
            if (type === "only-in-a") onlyInACopied.value = false;
            else if (type === "in-both") inBothCopied.value = false;
            else if (type === "only-in-b") onlyInBCopied.value = false;
         }, 1600);

    } catch (err) {
        console.error("Copy failed: ", err);
        toast.add({
            title: "Copy Failed",
             description: "Could not copy text to clipboard.",
            color: "red",
            icon: "i-heroicons-exclamation-triangle"
        });
        // Reset all copy states in case of error
        onlyInACopied.value = false;
        inBothCopied.value = false;
        onlyInBCopied.value = false;
    }
};

// --- Watcher ---

watch([listA, listB], () => {
    // Perform comparison whenever either list changes
    // compareNames function now handles logic for empty lists
    compareNames();
}, { immediate: false }); // Don't run immediately on component mount, wait for user input

</script>

<style scoped>
/* Optional: Add specific styles if needed */
textarea {
    outline: none; /* Ensure no default outline */
}
/* Add subtle focus ring for accessibility if default is removed */
textarea:focus-visible {
     box-shadow: 0 0 0 2px theme('colors.primary.500' / 50%); /* Example focus ring */
}

/* Style for list items in results */
.results-list li {
     padding: 6px 12px;
     border-bottom: 1px solid #eee; /* Example border */
}
.results-list li:last-child {
    border-bottom: none;
}
.results-list li:hover {
    background-color: #f9f9f9; /* Example hover */
}
</style>
