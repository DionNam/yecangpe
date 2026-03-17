import { test, expect } from '@playwright/test';

test.describe('HangulJobs E2E Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/HangulJobs/);

    // Check for hero section elements
    await expect(page.getByRole('main')).toBeVisible();

    // Check for navigation or key elements
    const heroText = page.getByText('한국어 가능한 외국인');
    await expect(heroText.first()).toBeVisible();
  });

  test('can navigate to login page', async ({ page }) => {
    await page.goto('/login');

    // Check for login page elements
    await expect(page.getByText('환영합니다')).toBeVisible();

    // Check for Google login button
    const googleButton = page.getByRole('button', { name: /Google/i });
    await expect(googleButton).toBeVisible();
  });

  test('can navigate to jobs page', async ({ page }) => {
    await page.goto('/jobs');

    // Check for jobs page heading
    await expect(page.getByRole('heading', { name: /채용 공고|맞춤형/ })).toBeVisible();
  });

  test('login with Google OAuth', async ({ page }) => {
    await page.goto('/login');

    // Click Google login button
    const googleButton = page.getByRole('button', { name: /Google/i });
    await expect(googleButton).toBeVisible();

    // Click and wait for OAuth redirect
    await googleButton.click();

    // Should redirect to Google OAuth page
    await page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });

    // Verify we're on Google's login page
    await expect(page.url()).toContain('accounts.google.com');
  });
});
