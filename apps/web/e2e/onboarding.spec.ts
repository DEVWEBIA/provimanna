import { expect, test, type Page } from '@playwright/test';
import { extractCode, extractLink, waitForEmail } from './mailbox';

// SHOTS=<dossier> : captures d'écran de contrôle visuel aux étapes clés.
const shot = async (page: Page, name: string, project: string) => {
  if (process.env.SHOTS)
    await page.screenshot({ path: `${process.env.SHOTS}/${project}-${name}.png`, fullPage: true });
};

const uniqueEmail = (tag: string) =>
  `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

test('nouvel utilisateur : lien magique → onboarding 4 étapes → espace client', async ({ page }, info) => {
  const email = uniqueEmail(info.project.name);

  // Arrivée depuis la landing : email pré-rempli, mode inscription.
  await page.goto('/');
  await page.getByLabel('Ton adresse email').first().fill(email);
  await page.getByRole('button', { name: 'Créer mon plan gratuit' }).click();
  await expect(page.getByRole('heading', { name: 'Crée ton compte.' })).toBeVisible();
  await shot(page, 'connexion', info.project.name);

  // Sans les conditions acceptées : message d'erreur utile.
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page.getByText('Coche la case pour accepter les conditions d’utilisation.')).toBeVisible();

  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Créer mon compte' }).click();
  await expect(page.getByRole('heading', { name: 'Regarde tes emails.' })).toBeVisible();
  await shot(page, 'envoye', info.project.name);

  const mail = await waitForEmail(email);
  await page.goto(extractLink(mail.html));

  // Foyer incomplet → onboarding.
  await expect(page).toHaveURL(/\/app\/bienvenue/);
  await expect(page.getByRole('heading', { name: 'Vous êtes combien à table ?' })).toBeVisible();
  await shot(page, 'etape1', info.project.name);
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  await expect(page.getByRole('heading', { name: 'Des choses à éviter ?' })).toBeVisible();
  await shot(page, 'etape2', info.project.name);
  await page.getByText('Sans porc', { exact: true }).click();
  await page.getByLabel('Temps de cuisine en semaine').selectOption('moins_30');
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Retour arrière sans perte : le choix « Sans porc » est conservé.
  await expect(page.getByRole('heading', { name: 'Où fais-tu tes courses ?' })).toBeVisible();
  await page.getByRole('link', { name: '← Retour' }).click();
  await expect(page.getByRole('checkbox', { name: 'Sans porc' })).toBeChecked();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Code postal invalide → erreur, puis valide.
  await page.getByText('Auchan', { exact: true }).click();
  await page.getByLabel('Code postal').fill('690');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByText('Le code postal fait 5 chiffres, par exemple 69003.')).toBeVisible();
  await shot(page, 'etape3', info.project.name);
  // La saisie survit à l'erreur (React réinitialise les formulaires après une action).
  await expect(page.getByRole('radio', { name: 'Auchan' })).toBeChecked();
  await expect(page.getByLabel('Code postal')).toHaveValue('690');
  await page.getByLabel('Code postal').fill('69003');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();

  await expect(page.getByText('14 repas pour 4 personnes, de saison, chez Auchan.')).toBeVisible();
  await shot(page, 'etape4', info.project.name);
  await page.getByRole('link', { name: 'Voir mon plan →' }).click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { name: /^Bonjour/ })).toBeVisible();
  await shot(page, 'app', info.project.name);

  // Connecté : /connexion renvoie vers l'espace client.
  await page.goto('/connexion');
  await expect(page).toHaveURL(/\/app$/);
});

test('connexion par code à 6 chiffres', async ({ page }, info) => {
  const email = uniqueEmail(`code-${info.project.name}`);
  await page.goto('/connexion');
  await expect(page.getByRole('heading', { name: 'Content de te revoir.' })).toBeVisible();
  await page.getByLabel('Adresse email').fill('pas-un-email');
  await page.getByRole('button', { name: 'Recevoir mon lien de connexion' }).click();
  await expect(page.getByText('Vérifie l’adresse : il manque le @ ou le domaine.')).toBeVisible();

  await page.getByLabel('Adresse email').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon lien de connexion' }).click();
  await expect(page.getByRole('heading', { name: 'Regarde tes emails.' })).toBeVisible();

  const mail = await waitForEmail(email);
  await page.getByLabel('Ou saisis le code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Valider' }).click();
  await expect(page).toHaveURL(/\/app\/bienvenue/);
});

test('/app sans session → connexion', async ({ page }) => {
  await page.goto('/app/plan');
  await expect(page).toHaveURL(/\/connexion\?suite=%2Fapp%2Fplan/);
});
