import { test, expect } from "@nuxt/test-utils/playwright";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("上传文件后只打开弹窗，不进行确认", async ({ page, goto }) => {
  await goto("/", { waitUntil: "domcontentloaded" });

  const filePath = path.resolve(__dirname, "./fixtures/test.xlsx");

  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: "上传文件" }).first().click(),
  ]);

  await fileChooser.setFiles(filePath);

  const dialog = page.getByRole("dialog", { name: "导入数据" });
  await expect(dialog).toBeVisible({ timeout: 10000 });
});
