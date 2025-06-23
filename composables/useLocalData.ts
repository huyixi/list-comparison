// composable/useLocalData.ts
export const useLocalData = () => {
  return useNuxtApp().$localData;
};
