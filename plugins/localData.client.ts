// plugins/useLocalData.client.ts
export default defineNuxtPlugin(() => {
  const get = <T>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  const set = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const remove = (key: string) => {
    localStorage.removeItem(key);
  };

  return {
    provide: {
      localData: {
        get,
        set,
        remove,
      },
    },
  };
});
