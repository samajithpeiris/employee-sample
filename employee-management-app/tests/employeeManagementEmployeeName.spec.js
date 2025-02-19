import { test, expect } from '@playwright/test';

test('Form validation: empty employee name', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Fill out the form with an empty name field.
  await page.fill('input[name="employeeId"]', 'EMP005');
  await page.fill('input[name="name"]', '');
  await page.fill('input[name="address"]', 'Test Address');
  await page.fill('input[name="salary"]', '30000');
  
  // Listen for the alert message
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain("Please enter employee's name");
    await dialog.accept();
  });
  
  // Click Save (which should trigger validation)
  await page.click('text=Save');
  
  // Verify no employee was added (the list should be empty)
  await expect(page.locator('ul li')).toHaveCount(0);
});
