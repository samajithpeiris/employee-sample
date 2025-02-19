import { test, expect } from '@playwright/test';

test.describe('Employee Management System', () => {
  
  test('Add, edit, and delete an employee', async ({ page }) => {
    // Navigate to your React app
    await page.goto('http://localhost:3000');
    
    // Verify that the header is visible
    await expect(page.locator('h1')).toHaveText('Employee Management System');

    // Add a new employee
    await page.fill('input[name="employeeId"]', 'EMP100');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="salary"]', '50000');
    await page.click('text=Save');

    // Verify the new employee appears in the list
    await expect(page.locator('ul li')).toContainText('John Doe');

    // Edit the employee:
    // Click the "Edit" button next to the employee (assuming there's only one in the list)
    await page.click('text=Edit');

    // Update employee details in the form
    await page.fill('input[name="name"]', 'John Smith');
    await page.fill('input[name="address"]', '456 Oak Ave');
    await page.click('text=Update');

    // Verify the updated details appear in the list
    await expect(page.locator('ul li')).toContainText('John Smith');

    // Delete the employee:
    await page.click('text=Delete');

    // Confirm that the employee is removed from the list
    await expect(page.locator('ul li')).toHaveCount(0);

  });

});
