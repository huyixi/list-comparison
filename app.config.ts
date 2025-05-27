export default defineAppConfig({
  head: {
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon-96x96.png",
        sizes: "96x96",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    meta: [{ name: "apple-mobile-web-app-title", content: "列表比对" }],
  },
  ui: {
    toast: {
      slots: {
        progress: "hidden",
      },
    },
  },
});
