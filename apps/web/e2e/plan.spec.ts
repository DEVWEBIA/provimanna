import { expect, test, type Page } from '@playwright/test';
import { extractCode, waitForEmail } from './mailbox';

const uniqueEmail = (tag: string) =>
  `e2e-plan-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Nouveau compte par code, questionnaire rapide (2 adultes, végétarien, Lidl 75011). */
async function signUp(page: Page, email: string) {
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

test('plan : 14 repas, comparateur, remplacer, verrouiller, varier la semaine', async ({
  page,
  isMobile,
}, info) => {
  await signUp(page, uniqueEmail(info.project.name));
  await page.goto('/app/plan');
  await expect(page.getByRole('heading', { name: /^Semaine \d+$/ })).toBeVisible();

  // Comparateur : 6 enseignes, date des relevés, le choix reste libre.
  const stores = page.getByRole('radiogroup', { name: 'Enseigne' }).getByRole('radio');
  await expect(stores).toHaveCount(6);
  await expect(page.getByText(/^Prix relevés le \d{2}\/\d{2}$/).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Garder Lidl et voir ma liste' })).toBeVisible();
  await expect(page.getByText('Ton choix reste libre, même plus cher.')).toBeVisible();

  if (!isMobile) {
    const cells = page.locator('section[aria-label="Grille des repas"] button[aria-haspopup="menu"]');
    await expect(cells).toHaveCount(14);
    const first = cells.first();
    const before = (await first.textContent()) ?? '';
    await first.click();
    await page.getByRole('menuitem', { name: '↻ Remplacer' }).click();
    await expect(first).not.toHaveText(before);

    // Verrouiller le 2e repas, puis varier la semaine : il ne bouge pas.
    const second = cells.nth(1);
    await second.click();
    await page.getByRole('menuitem', { name: 'Verrouiller' }).click();
    await expect(second).toContainText('Verrouillé');
    const kept = (await second.textContent()) ?? '';
    await page.getByRole('button', { name: 'Varier la semaine' }).click();
    await expect(page.getByRole('button', { name: 'Varier la semaine' })).toBeEnabled({ timeout: 15_000 });
    await expect(cells.nth(1)).toHaveText(kept);
  } else {
    const panel = page.getByRole('tabpanel');
    await page.getByRole('tab').first().click();
    const title = panel.locator('article').first().locator('a').first();
    const before = (await title.textContent()) ?? '';
    await panel.getByRole('button', { name: '↻ Remplacer' }).first().click();
    await expect(title).not.toHaveText(before);

    await panel.getByRole('button', { name: 'Verrouiller' }).first().click();
    await expect(panel.getByRole('button', { name: 'Verrouillé' }).first()).toBeVisible();
    const kept = (await title.textContent()) ?? '';
    await page.getByRole('button', { name: 'Varier la semaine' }).click();
    await expect(page.getByRole('button', { name: 'Varier la semaine' })).toBeEnabled({ timeout: 15_000 });
    await expect(title).toHaveText(kept);
  }

  // Le tableau de bord montre le total de la semaine dans l'enseigne du foyer.
  await page.goto('/app');
  await expect(page.getByRole('heading', { name: 'Ton menu de la semaine est prêt.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Au menu aujourd’hui' })).toBeVisible();
});

test('comparateur → garder son enseigne → liste cochée, partagée en lecture seule', async ({
  page,
  browser,
}, info) => {
  await signUp(page, uniqueEmail(`liste-${info.project.name}`));

  // Comparateur détaillé : 6 enseignes, détail produit par produit (essai = Premium).
  await page.goto('/app/comparateur');
  await expect(page.getByRole('heading', { name: 'Où ta semaine coûte le moins' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Total par enseigne' }).getByRole('button')).toHaveCount(6);
  await expect(page.getByRole('heading', { name: /^Produit par produit · Lidl vs / })).toBeVisible();
  await expect(page.getByRole('table').getByRole('row')).not.toHaveCount(0);

  // « Garder Lidl » : la semaine est validée et la liste s'ouvre.
  await page.getByRole('button', { name: 'Garder Lidl' }).click();
  await expect(page).toHaveURL(/\/app\/liste$/);
  await expect(page.getByRole('heading', { name: 'Ma liste de courses' })).toBeVisible();
  const first = page.getByRole('checkbox').first();
  await first.check();
  await expect(page.getByText(/^1 articles sur \d+$/)).toBeVisible();

  // Enregistré : toujours coché après rechargement.
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();

  // Lien de partage : lisible sans compte.
  await page
    .context()
    .grantPermissions(['clipboard-read', 'clipboard-write'])
    .catch(() => undefined);
  const token = await page.evaluate(async () => {
    const res = await fetch(location.href);
    const html = await res.text();
    return /\/liste\/([0-9a-f]{32,})/.exec(html)?.[1] ?? null;
  });
  expect(token).not.toBeNull();
  const visitor = await browser.newContext();
  const shared = await visitor.newPage();
  await shared.goto(`/liste/${token}`);
  await expect(shared.getByRole('heading', { name: 'Liste de courses partagée' })).toBeVisible();
  await expect(shared.getByText('(déjà pris)')).toHaveCount(1);
  await visitor.close();
});
