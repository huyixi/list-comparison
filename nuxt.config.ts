// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  site: {
    url: "https://list.huyixi.com",
    name: "列表比对",
    description: "比对两个列表，找出各自独有及共有的项。",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: ["~/assets/css/main.css", "~/assets/css/cropper.css"],
  icon: {
    customCollections: [{ prefix: "custom", dir: "./assets/icons" }],
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/cropper.scss" as *;`,
        },
      },
    },
  },
  ui: {
    colorMode: false,
  },
  modules: ["@nuxt/ui", "nuxt-site-config", "@nuxtjs/device"],
});
