import { test, expect } from '@playwright/test';

test('click button updates message', async ({ page }) => {
  await page.goto('http://localhost:3000/livelink/ai');
  await page.waitForSelector('#clickButton');

  await page.click('#clickButton');

  // Check visible change
  await expect(page.locator('#output')).toHaveText('Button clicked!');
});
