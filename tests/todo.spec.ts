import { test, expect } from '@playwright/test';

test.describe('Todo UI Tests', () => {

  /**
   * TC01 - Add todo item
   * 測試目的：
   * 驗證使用者可以成功新增一筆待辦事項
   *
   * 測試重點：
   * - 輸入文字後按 Enter
   * - 清單中出現該待辦
   */
  test('TC01 - Add todo item', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const input = page.locator('.new-todo');

    await input.fill('New Task');
    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toContainText('New Task');
  });

  /**
   * TC02 - Prevent empty todo
   * 測試目的：
   * 驗證系統不允許新增空白待辦事項
   *
   * 測試重點：
   * - 不輸入內容直接按 Enter
   * - 清單不應新增任何項目
   */
  test('TC02 - Prevent empty todo', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const input = page.locator('.new-todo');

    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  /**
   * TC03 - Complete todo item
   * 測試目的：
   * 驗證使用者可以將待辦標記為完成
   *
   * 測試重點：
   * - 點擊 checkbox (.toggle)
   * - 該項目應套用 completed 狀態（例如 class 改變）
   */
  test('TC03 - Complete todo item', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const input = page.locator('.new-todo');

    await input.fill('Task to complete');
    await input.press('Enter');

    const item = page.locator('.todo-list li', { hasText: 'Task to complete' });

    await item.locator('.toggle').check();

    await expect(item).toHaveClass(/completed/);
  });

  /**
   * TC04 - Delete todo item
   * 測試目的：
   * 驗證使用者可以刪除待辦事項
   *
   * 測試重點：
   * - hover 顯示刪除按鈕
   * - 點擊刪除後該項目從清單消失
   */
  test('TC04 - Delete todo item', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const input = page.locator('.new-todo');

    await input.fill('Delete Me');
    await input.press('Enter');

    const item = page.locator('.todo-list li', { hasText: 'Delete Me' });

    await expect(item).toHaveCount(1);

    await item.hover();
    await item.locator('.destroy').click({ force: true });

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  /**
   * TC05 - Filter todo items
   * 測試目的：
   * 驗證 Active / Completed 篩選功能正確運作
   *
   * 測試重點：
   * - 建立 Active 與 Completed 兩種狀態資料
   * - 點擊 Active 時只顯示未完成項目
   * - 點擊 Completed 時只顯示已完成項目
   */
  test('TC05 - Filter todo items', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const input = page.locator('.new-todo');

    await input.fill('Active Task');
    await input.press('Enter');

    await input.fill('Completed Task');
    await input.press('Enter');

    const completedItem = page.locator('.todo-list li', { hasText: 'Completed Task' });
    await completedItem.locator('.toggle').check();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toContainText(['Active Task']);

    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toContainText(['Completed Task']);
  });

});