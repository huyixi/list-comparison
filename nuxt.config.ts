// https://nuxt.com/docs/api/configuration/nuxt-config
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  site: {
    url: "https://list.huyixi.com",
    name: "名单比对",
    description: "比对两份名单列表，找出各自独有及共有的项。",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ui: {
    colorMode: false,
  },
  modules: ["@nuxt/ui", "nuxt-site-config", "nuxt-og-image"],
  plugins: [{ src: "~/plugins/clipboard.js", mode: "client" }],
});
