import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e", // 你测试文件的存放目录
  fullyParallel: true,

  // 如果在 CI 环境中，不允许遗留 test.only
  forbidOnly: !!process.env.CI,

  // CI 环境重试失败测试 2 次，本地不重试
  retries: process.env.CI ? 2 : 0,

  // CI 环境串行执行测试，本地使用默认并发
  workers: process.env.CI ? 1 : undefined,

  // 使用 HTML 报告查看测试详情
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: true, // 默认无头模式运行，如需本地调试可设为 false
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // 自动启动 Nuxt 本地开发服务
  webServer: {
    command: "npm run dev", // 你 Nuxt 项目启动命令
    url: "http://localhost:3000", // 启动后访问的地址
    reuseExistingServer: !process.env.CI, // 本地重复运行时复用已有服务
    timeout: 60 * 1000, // 最长等待服务启动的时间（60 秒）
  },
});
