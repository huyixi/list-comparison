// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ui: {
    colorMode: false,
  },
  modules: ["@nuxt/ui", "nuxt-og-image"],
  plugins: [{ src: "~/plugins/clipboard.js", mode: "client" }],
  site: {
    url: "https://list.huyixi.com",
    name: "名单比对工具",
  },
});
