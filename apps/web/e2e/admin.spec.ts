import { expect, test, type Page } from '@playwright/test';
import { extractCode, waitForEmail } from './mailbox';

const ADMIN = process.env.ADMIN_URL ?? 'http://localhost:3001';

async function staffLogin(page: Page, email: string) {
  await page.goto(`${ADMIN}/connexion`);
  await page.getByLabel('Adresse email professionnelle').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon code' }).click();
  await expect(page.getByRole('status')).toContainText(email);
  const mail = await waitForEmail(email);
  await page.getByLabel('Code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Se connecter' }).click();
}

// Le back-office est desktop ; un seul passage suffit (et évite deux demandes de code en 30 s).
test.describe('back-office', () => {
  test.skip(({ isMobile }) => isMobile, 'parcours desktop');

  test('admin : vue d’ensemble, modération d’un prix, journal', async ({ page }) => {
    await staffLogin(page, 'admin@example.com');
    await expect(page.getByRole('heading', { level: 1, name: 'Vue d’ensemble' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Couverture des prix (relevés de moins de 7 jours)' }),
    ).toBeVisible();

    await page.getByRole('navigation', { name: 'Back-office' }).getByRole('link', { name: /^Prix/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Prix' })).toBeVisible();
    const first = page.locator('tbody tr').first();
    const product = (await first.locator('button').first().textContent()) ?? '';
    await page.getByRole('button', { name: 'Valider (V)' }).click();
    await expect(page.getByText('Prix validé : il entre dans la médiane.')).toBeVisible();

    await page
      .getByRole('navigation', { name: 'Back-office' })
      .getByRole('link', { name: 'Rôles et journal' })
      .click();
    await expect(page.getByText('a validé un prix').first()).toBeVisible();
    expect(product.length).toBeGreaterThan(0);
  });

  test('un compte sans rôle staff est refusé', async ({ page }) => {
    await staffLogin(page, 'marion@example.com');
    await expect(page.getByRole('heading', { name: 'Accès réservé à l’équipe' })).toBeVisible();
  });
});
