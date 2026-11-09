import { expect, test } from '@playwright/test';
import { createModerator, seedImportRun } from './helpers';
import { extractCode, waitForEmail } from './mailbox';

const ADMIN = process.env.ADMIN_URL ?? 'http://localhost:3001';

test('back-office : historique des imports Open Prices et détail d’un passage', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'le back-office est desktop');
  const runId = await seedImportRun();
  const email = await createModerator('imports');
  await page.goto(`${ADMIN}/connexion`);
  await page.getByLabel('Adresse email professionnelle').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon code' }).click();
  const mail = await waitForEmail(email);
  await page.getByLabel('Code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await page.getByRole('navigation', { name: 'Back-office' }).getByRole('link', { name: /^Prix/ }).click();
  await page.getByRole('link', { name: 'Imports Open Prices →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Imports de prix');
  await page.goto(`${ADMIN}/prix/imports?id=${runId}`);
  const detail = page.getByRole('complementary', { name: 'Détail de l’import' });
  await expect(detail.getByText('Prix lus')).toBeVisible();
  await expect(detail.getByText('520')).toBeVisible();
  await expect(detail.getByText('Voir les 2 alertes créées par cet import →')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lancer maintenant' })).toBeVisible();
  await expect(page.getByText('© Open Food Facts contributors (Open Prices, ODbL)')).toBeVisible();
});
