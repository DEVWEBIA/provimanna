import { expect, test, type Page } from '@playwright/test';
import { extractCode, extractLink, waitForEmail } from './mailbox';

// SHOTS=<dossier> : captures d'écran de contrôle visuel aux étapes clés.
const shot = async (page: Page, name: string, project: string) => {
  if (process.env.SHOTS)
    await page.screenshot({ path: `${process.env.SHOTS}/${project}-${name}.png`, fullPage: true });
};

const uniqueEmail = (tag: string) =>
  `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Étapes 1 à 3 du questionnaire (foyer 2 + 2, sans porc, moins de 30 min, Auchan 69003). */
async function fillQuestionnaire(page: Page, project: string) {
  await expect(page.getByRole('heading', { name: 'Vous êtes combien à table ?' })).toBeVisible();
  await shot(page, 'etape1', project);
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();

  await expect(page.getByRole('heading', { name: 'Des choses à éviter ?' })).toBeVisible();
  await page.getByText('Sans porc', { exact: true }).click();
  await page.getByLabel('Temps de cuisine en semaine').selectOption('moins_30');
  await shot(page, 'etape2', project);
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Retour arrière sans perte.
  await expect(page.getByRole('heading', { name: 'Où fais-tu tes courses ?' })).toBeVisible();
  await page.getByRole('button', { name: '← Retour' }).click();
  await expect(page.getByRole('checkbox', { name: 'Sans porc' })).toBeChecked();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Erreurs utiles, saisie conservée.
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByText('Choisis ton enseigne habituelle.')).toBeVisible();
  await page.getByText('Auchan', { exact: true }).click();
  await page.getByLabel('Code postal').fill('690');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByText('Le code postal fait 5 chiffres, par exemple 69003.')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Auchan' })).toBeChecked();
  await shot(page, 'etape3', project);
  await page.getByLabel('Code postal').fill('69003');
  await page.getByRole('button', { name: 'Générer ma semaine' }).click();
  await expect(page.getByText('14 repas pour 4 personnes, de saison, chez Auchan.')).toBeVisible();
}

test('visiteur : questionnaire sans compte → email → espace client déjà configuré', async ({
  page,
}, info) => {
  const email = uniqueEmail(info.project.name);
  await page.goto('/');
  await page.getByRole('link', { name: 'Créer mon plan gratuit' }).first().click();
  await expect(page).toHaveURL(/\/commencer$/);

  await fillQuestionnaire(page, info.project.name);
  await shot(page, 'etape4', info.project.name);

  await page.getByLabel('Adresse email').fill(email);
  await page.getByRole('button', { name: 'Recevoir ma semaine' }).click();
  await expect(page.getByText('Coche la case pour accepter les conditions d’utilisation.')).toBeVisible();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Recevoir ma semaine' }).click();
  await expect(page.getByRole('heading', { name: 'Regarde tes emails.' })).toBeVisible();
  await shot(page, 'envoye', info.project.name);

  const mail = await waitForEmail(email);
  await page.goto(extractLink(mail.html));

  // Les réponses ont été appliquées : on arrive directement dans l'espace client.
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole('heading', { name: /^(Bonjour|Bonsoir)/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Ton menu de la semaine est prêt.' })).toBeVisible();
  await shot(page, 'app', info.project.name);

  // Et elles sont bien enregistrées dans le foyer.
  await page.goto('/app/bienvenue');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('checkbox', { name: 'Sans porc' })).toBeChecked();
  await expect(page.getByLabel('Temps de cuisine en semaine')).toHaveValue('moins_30');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('radio', { name: 'Auchan' })).toBeChecked();
  await expect(page.getByLabel('Code postal')).toHaveValue('69003');

  // Connecté : /commencer et /connexion renvoient vers l'espace client.
  await page.goto('/commencer');
  await expect(page).toHaveURL(/\/app$/);
  await page.goto('/connexion');
  await expect(page).toHaveURL(/\/app$/);
});

test('connexion directe par code → questionnaire du compte → espace client', async ({ page }, info) => {
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
  await fillQuestionnaire(page, `${info.project.name}-compte`);
  // Compte connecté : la semaine est générée dès l'étape 3 (texte de la maquette).
  await expect(page.getByText('Plan généré')).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Ta semaine \d+ est prête\.$/ })).toBeVisible();
  await page.getByRole('link', { name: 'Voir mon plan →' }).click();
  await expect(page).toHaveURL(/\/app$/);
});

test('/app sans session → connexion', async ({ page }) => {
  await page.goto('/app/plan');
  await expect(page).toHaveURL(/\/connexion\?suite=%2Fapp%2Fplan/);
});
