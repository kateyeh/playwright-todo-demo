# Playwright Todo Demo

此專案為一個以 **Playwright + TypeScript** 建立的 TodoMVC 自動化展示範例。除了驗證 TodoMVC 的基本功能外，也加入了較具產品展示感的 UI 流程導覽設計，讓非技術使用者也能清楚理解整體操作步驟。

## 專案亮點

- 使用 Playwright 撰寫 TodoMVC 自動化測試
- 以展示型 Demo 為目標，而不只是驗證測試是否通過
- 在頁面左上角加入產品風格的流程導覽卡片
- 顯示目前步驟、整體進度與完成狀態
- 每一步操作前會短暫高亮目標 UI 元素，提升展示清晰度

## 展示流程

此 Demo 主要展示以下流程：

- Step 1 Add
- Step 2 Mark complete
- Step 3 Add another
- Step 4 Show Active
- Step 5 Show Completed
- Step 6 Delete completed

## 使用技術

- Playwright
- TypeScript
- Node.js

## 專案結構

目前專案結構如下：

```text
tests/
  todo-demo.spec.ts
  todo.spec.ts
playwright.config.ts
package.json
.gitignore
README.md
```

若要安裝與執行此專案，請先執行以下指令安裝套件與 Playwright 瀏覽器：

```bash
npm install
npx playwright install
```

接著若要執行主要的 Demo 測試，請使用以下指令：

```bash
npx playwright test tests/todo-demo.spec.ts
```

若希望執行時顯示瀏覽器畫面，以便更清楚觀看展示流程，請使用以下指令：

```bash
npx playwright test tests/todo-demo.spec.ts --headed
```

測試完成後，若要查看 Playwright HTML Report，可使用以下指令開啟報表：

```bash
npx playwright show-report
```

作者：Kate Yeh