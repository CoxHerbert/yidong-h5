import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

function encode(payload: Record<string, any>) {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

test.describe('Workflow regression flow', () => {
  test('allows starting a process with dynamic form fields', async ({ page }) => {
    const startParam = encode({ processId: 'mock-expense-process' });
    await page.goto(`${baseUrl}/workflow/form/start?p=${startParam}`);

    await page.waitForSelector('[data-testid="wf-field-title"] input');

    await page.fill('[data-testid="wf-field-title"] input', '自动化测试报销');
    await page.click('button:has-text("新增")');
    await page.fill('[data-testid="wf-field-item"] input', '差旅费');
    await page.fill('[data-testid="wf-field-cost"] input', '450');
    await page.fill('[data-testid="wf-field-amount"] input', '1450');

    await page.click('button:has-text("提交")');
    await page.waitForURL('**/workflow/mine**');
  });

  test('renders workflow detail with actions and timeline', async ({ page }) => {
    const detailParam = encode({ taskId: 'task-1', processInsId: 'pi-1' });
    await page.goto(`${baseUrl}/workflow/form/detail?p=${detailParam}`);

    await page.waitForSelector('[data-testid="workflow-actions"]');
    await expect(page.locator('[data-testid="workflow-actions"]')).toBeVisible();
    await expect(page.locator('[data-testid="workflow-timeline"]')).toBeVisible();
    await expect(page.locator('[data-testid="workflow-exam-form"]')).toBeVisible();
  });
});
