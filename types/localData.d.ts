// types/localData.d.ts
export interface LocalData {
  get<T>(key: string, fallback: T): T;
  set(key: string, value: any): void;
  remove(key: string): void;
}

declare module "#app" {
  interface NuxtApp {
    $localData: LocalData;
  }
}

export {};
