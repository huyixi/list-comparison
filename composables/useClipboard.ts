// composables/useClipboard.ts
export const useClipboard = () => {
  return useNuxtApp().$clipboard;
};
