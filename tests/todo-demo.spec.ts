import { test, expect, Page, Locator } from '@playwright/test';

test.setTimeout(60000);

const steps = [
  'Add one',
  'Mark completed',
  'Add another',
  'Filter Active',
  'Filter Completed',
  'Delete completed',
];

async function initGuide(page: Page) {
  await page.evaluate((stepList) => {
    if (document.getElementById('demo-guide')) return;

    const card = document.createElement('div');
    card.id = 'demo-guide';

    const itemsHtml = stepList
      .map(
        (label, i) => `
          <div class="demo-step" data-step="${i + 1}">
            <div class="demo-step-icon">○</div>
            <div class="demo-step-text">Step ${i + 1} ${label}</div>
          </div>
        `
      )
      .join('');

    card.innerHTML = `
      <div class="demo-head">
        <div class="demo-badge">Product Demo</div>
        <div class="demo-count">Step 1 / ${stepList.length}</div>
      </div>

      <div class="demo-progress">
        <div class="demo-progress-bar"></div>
      </div>

      <div class="demo-steps">
        ${itemsHtml}
      </div>
    `;

    Object.assign(card.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: '99999',
      width: '360px',
      padding: '18px',
      borderRadius: '18px',
      background: '#ffffff',
      color: '#111827',
      boxShadow: '0 18px 48px rgba(15, 23, 42, 0.16)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    });

    document.body.appendChild(card);

    const head = card.querySelector('.demo-head') as HTMLElement;
    const badge = card.querySelector('.demo-badge') as HTMLElement;
    const count = card.querySelector('.demo-count') as HTMLElement;
    const progress = card.querySelector('.demo-progress') as HTMLElement;
    const bar = card.querySelector('.demo-progress-bar') as HTMLElement;
    const stepsWrap = card.querySelector('.demo-steps') as HTMLElement;

    Object.assign(head.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '14px',
      gap: '12px',
    });

    Object.assign(badge.style, {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 10px',
      fontSize: '12px',
      fontWeight: '700',
      borderRadius: '999px',
      background: '#EEF2FF',
      color: '#4338CA',
    });

    Object.assign(count.style, {
      fontSize: '13px',
      fontWeight: '600',
      color: '#6B7280',
    });

    Object.assign(progress.style, {
      width: '100%',
      height: '10px',
      background: '#E5E7EB',
      borderRadius: '999px',
      overflow: 'hidden',
      marginBottom: '16px',
    });

    Object.assign(bar.style, {
      width: `${100 / stepList.length}%`,
      height: '100%',
      background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
      borderRadius: '999px',
      transition: 'width 0.35s ease',
    });

    Object.assign(stepsWrap.style, {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    });

    Array.from(card.querySelectorAll('.demo-step')).forEach((el) => {
      const row = el as HTMLElement;
      const icon = row.querySelector('.demo-step-icon') as HTMLElement;
      const text = row.querySelector('.demo-step-text') as HTMLElement;

      Object.assign(row.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '12px',
        background: '#F9FAFB',
        border: '1px solid transparent',
        transition: 'all 0.2s ease',
      });

      Object.assign(icon.style, {
        width: '24px',
        height: '24px',
        borderRadius: '999px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F3F4F6',
        color: '#9CA3AF',
        fontSize: '14px',
        fontWeight: '700',
        flexShrink: '0',
      });

      Object.assign(text.style, {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
      });
    });
  }, steps);
}

async function setStep(page: Page, current: number) {
  await initGuide(page);

  await page.evaluate(
    ({ current, total }) => {
      const count = document.querySelector('.demo-count') as HTMLElement | null;
      const bar = document.querySelector('.demo-progress-bar') as HTMLElement | null;
      const rows = Array.from(document.querySelectorAll('.demo-step'));

      if (count) count.textContent = `Step ${current} / ${total}`;
      if (bar) bar.style.width = `${(current / total) * 100}%`;

      rows.forEach((row, index) => {
        const stepNo = index + 1;
        const icon = row.querySelector('.demo-step-icon') as HTMLElement;
        const text = row.querySelector('.demo-step-text') as HTMLElement;
        const el = row as HTMLElement;

        if (stepNo < current) {
          el.style.background = '#F0FDF4';
          el.style.border = '1px solid #BBF7D0';
          icon.textContent = '✓';
          icon.style.background = '#DCFCE7';
          icon.style.color = '#16A34A';
          text.style.color = '#166534';
        } else if (stepNo === current) {
          el.style.background = '#EEF2FF';
          el.style.border = '1px solid #C7D2FE';
          icon.textContent = '●';
          icon.style.background = '#E0E7FF';
          icon.style.color = '#4F46E5';
          text.style.color = '#312E81';
        } else {
          el.style.background = '#F9FAFB';
          el.style.border = '1px solid transparent';
          icon.textContent = '○';
          icon.style.background = '#F3F4F6';
          icon.style.color = '#9CA3AF';
          text.style.color = '#374151';
        }
      });
    },
    { current, total: steps.length }
  );
}

async function completeStep(page: Page, current: number) {
  await page.evaluate((currentStep) => {
    const row = document.querySelector(
      `.demo-step[data-step="${currentStep}"]`
    ) as HTMLElement | null;

    if (!row) return;

    const icon = row.querySelector('.demo-step-icon') as HTMLElement;
    const text = row.querySelector('.demo-step-text') as HTMLElement;

    row.style.background = '#F0FDF4';
    row.style.border = '1px solid #BBF7D0';
    icon.textContent = '✓';
    icon.style.background = '#DCFCE7';
    icon.style.color = '#16A34A';
    text.style.color = '#166534';
  }, current);
}

async function flashLocator(target: Locator) {
  await target.evaluate((el) => {
    const node = el as HTMLElement;
    node.style.transition = 'box-shadow 0.2s ease, outline 0.2s ease';
    node.style.outline = '3px solid rgba(99, 102, 241, 0.75)';
    node.style.boxShadow = '0 0 0 8px rgba(99, 102, 241, 0.16)';
  });

  await target.page().waitForTimeout(700);

  await target.evaluate((el) => {
    const node = el as HTMLElement;
    node.style.outline = '';
    node.style.boxShadow = '';
  });
}

test('Todo UI Demo Flow - Product Timeline Guide', async ({ page }) => {
  const item1 = 'Demo item 1 - to be completed and deleted';
  const item2 = 'Demo item 2 - to filter active';

  await page.goto('https://demo.playwright.dev/todomvc');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const input = page.locator('.new-todo');
  const list = page.locator('.todo-list li');
  const visibleList = page.locator('.todo-list li:visible');

  await test.step('Step 1 Add', async () => {
    await setStep(page, 1);
    await flashLocator(input);

    await input.fill(item1);
    await input.press('Enter');

    const row = page.locator('.todo-list li', { hasText: item1 });

    await expect(row).toBeVisible();
    await expect(row).not.toHaveClass(/completed/);
    await expect(list).toHaveCount(1);

    await completeStep(page, 1);
    await page.waitForTimeout(600);
  });

  await test.step(
  'Step 2 Mark complete',
  async () => {
    await setStep(page, 2);

    const row = page.locator('.todo-list li', { hasText: item1 }).first();
    const toggle = row.locator('.toggle');

    await expect(row).toBeVisible();
    await expect(toggle).toBeVisible();

    await flashLocator(row);

    await toggle.evaluate((el) => {
      (el as HTMLInputElement).click();
    });

    await expect(row).toHaveClass(/completed/);

    await completeStep(page, 2);
    await page.waitForTimeout(300);
  },
  { timeout: 15000 }
);

  await test.step('Step 3 Add another', async () => {
    await setStep(page, 3);
    await flashLocator(input);

    await input.fill(item2);
    await input.press('Enter');

    const row = page.locator('.todo-list li', { hasText: item2 });

    await expect(row).toBeVisible();
    await expect(row).not.toHaveClass(/completed/);
    await expect(list).toHaveCount(2);

    await completeStep(page, 3);
    await page.waitForTimeout(600);
  });

  await test.step('Step 4 Show Active', async () => {
    await setStep(page, 4);

    const activeLink = page.getByRole('link', { name: 'Active' });
    await flashLocator(activeLink);
    await activeLink.click();

    const row = page.locator('.todo-list li:visible', { hasText: item2 });

    await expect(visibleList).toHaveCount(1);
    await expect(row).toBeVisible();
    await expect(visibleList).toContainText(item2);
    await expect(visibleList).not.toContainText(item1);

    await completeStep(page, 4);
    await page.waitForTimeout(600);
  });

  await test.step('Step 5 Show Completed', async () => {
    await setStep(page, 5);

    const completedLink = page.getByRole('link', { name: 'Completed' });
    await flashLocator(completedLink);
    await completedLink.click();

    const row = page.locator('.todo-list li:visible', { hasText: item1 });

    await expect(visibleList).toHaveCount(1);
    await expect(row).toBeVisible();
    await expect(visibleList).toContainText(item1);
    await expect(visibleList).not.toContainText(item2);

    await completeStep(page, 5);
    await page.waitForTimeout(600);
  });

  await test.step('Step 6 Delete completed', async () => {
    await setStep(page, 6);

    const row = page.locator('.todo-list li:visible', { hasText: item1 });
    const destroy = row.locator('.destroy');

    await row.hover();
    await flashLocator(destroy);
    await destroy.click({ force: true });

    await expect(visibleList).toHaveCount(0);
    await expect(page.locator('.todo-list')).not.toContainText(item1);

    await completeStep(page, 6);
    await page.waitForTimeout(1000);
  });
});