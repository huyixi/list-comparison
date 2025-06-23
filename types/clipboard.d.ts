export {};

declare module "#app" {
  interface NuxtApp {
    $clipboard: {
      readText: () => Promise<string>;
      writeText: (text: string) => Promise<void>;
    };
  }
}
