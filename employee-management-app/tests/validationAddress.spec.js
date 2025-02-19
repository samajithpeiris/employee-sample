import { test, expect } from '@playwright/test';

test('Form validation: empty address', async ({ page }) => {
    await page.goto('http://localhost:3000');
  
    // Fill out the form with an empty Address but valid data in other fields
    await page.fill('input[name="employeeId"]', 'EMP010');
    await page.fill('input[name="name"]', 'Test Name');
    await page.fill('input[name="address"]', '');
    await page.fill('input[name="salary"]', '30000');
    
    // Listen for the alert
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain("Please enter employee's address.");
      await dialog.accept();
    });
    
    // Click Save to trigger the validation
    await page.click('text=Save');
    
    // Verify that no employee was added
    await expect(page.locator('ul li')).toHaveCount(0);
  });
  
  