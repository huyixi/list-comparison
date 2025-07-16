// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      keyframes: {
        "flash-success": {
          "0%": { borderColor: "limegreen" },
          "100%": { borderColor: "transparent" },
        },
      },
      animation: {
        "flash-success": "flash-success 1s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
