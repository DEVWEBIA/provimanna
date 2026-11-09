import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, type Page } from '@playwright/test';
import { extractCode, waitForEmail } from './mailbox';

export const uniqueEmail = (tag: string) =>
  `e2e-plan-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Passe un écran du questionnaire (bouton du bas, toujours visible). */
export const nextQuestion = (page: Page) =>
  page.getByRole('button', { name: /^(Continuer|Composer ma semaine)$/ }).click();

/**
 * Questionnaire rapide d'un compte connecté : 2 adultes, midi et soir toute la semaine,
 * Lidl 75011, pas de budget précis, végétarien, four et plaques.
 */
export async function quickQuestionnaire(page: Page) {
  await expect(page.getByRole('heading', { name: 'Qu’est-ce qui t’amène ?' })).toBeVisible();
  await nextQuestion(page); // motivations
  await nextQuestion(page); // foyer
  await nextQuestion(page); // repas
  await page.getByText('Lidl', { exact: true }).click();
  await page.getByLabel('Code postal').fill('75011');
  await nextQuestion(page);
  await page.getByText('Je n’ai pas de budget précis').click();
  await nextQuestion(page);
  await page.getByText('Végétarien', { exact: true }).click();
  await nextQuestion(page); // régime
  await nextQuestion(page); // ambiance
  await nextQuestion(page); // cuisines
  await nextQuestion(page); // ingrédients
  await page.getByRole('button', { name: 'Composer ma semaine' }).click();
}

/** Nouveau compte par code, questionnaire rapide (voir quickQuestionnaire). */
export async function signUp(page: Page, email: string) {
  await page.goto('/connexion');
  await page.getByLabel('Adresse email').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon lien de connexion' }).click();
  const mail = await waitForEmail(email);
  await page.getByLabel('Ou saisis le code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Valider' }).click();
  await expect(page).toHaveURL(/\/app\/bienvenue/);
  await quickQuestionnaire(page);
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

/** Crée un compte staff « modérateur prix » (base locale uniquement) et renvoie son adresse. */
export async function createModerator(tag: string): Promise<string> {
  const env = localEnv();
  const email = uniqueEmail(`moderateur-${tag}`);
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
  const user = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, email_confirm: true, user_metadata: { name: 'Modératrice test' } }),
  });
  if (!user.ok) throw new Error(`Modérateur non créé : ${user.status}`);
  const { id } = (await user.json()) as { id: string };
  const role = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/roles`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: id, role: 'moderateur_prix' }),
  });
  if (!role.ok) throw new Error(`Rôle non attribué : ${role.status}`);
  return email;
}

/** Identifiant du dernier ticket envoyé (base locale), pour l'ouvrir directement dans le back-office. */
export async function latestReceiptId(): Promise<string> {
  const env = localEnv();
  const res = await fetch(
    `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/receipts?select=id&order=created_at.desc&limit=1`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    },
  );
  const [row] = (await res.json()) as { id: string }[];
  if (!row) throw new Error('Aucun ticket en base');
  return row.id;
}
