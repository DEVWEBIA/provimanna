import { expect, type Page } from '@playwright/test';
import { extractCode, waitForEmail } from './mailbox';

export const uniqueEmail = (tag: string) =>
  `e2e-plan-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Nouveau compte par code, questionnaire rapide (2 adultes, végétarien, Lidl 75011). */
export async function signUp(page: Page, email: string) {
  await page.goto('/connexion');
  await page.getByLabel('Adresse email').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon lien de connexion' }).click();
  const mail = await waitForEmail(email);
  await page.getByLabel('Ou saisis le code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Valider' }).click();
  await expect(page).toHaveURL(/\/app\/bienvenue/);
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByText('Végétarien', { exact: true }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByText('Lidl', { exact: true }).click();
  await page.getByLabel('Code postal').fill('75011');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByText('Plan généré')).toBeVisible();
}
