import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

/** Variables de apps/web/.env.local (clé serveur locale), pour préparer des données de test. */
function localEnv(): Record<string, string> {
  const file = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local'), 'utf8');
  return Object.fromEntries(
    file
      .split('\n')
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
  );
}

/** Crée un relevé aberrant à modérer (base locale uniquement), pour que la file du back-office ne soit jamais vide. */
export async function seedAberrantPrice() {
  const env = localEnv();
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/prices`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: '00000000-0000-0000-0000-000000000107',
      store_id: 'auchan',
      cents: 777,
      observed_at: new Date().toISOString(),
      source: 'ticket',
      flagged_aberrant: true,
    }),
  });
  if (!res.ok) throw new Error(`Relevé de test non créé : ${res.status}`);
}
