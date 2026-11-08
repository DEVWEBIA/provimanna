import { expect, test, type Page } from '@playwright/test';
import { nextQuestion, signUp } from './helpers';
import { extractCode, extractLink, waitForEmail } from './mailbox';

// SHOTS=<dossier> : captures d'écran de contrôle visuel aux étapes clés.
const shot = async (page: Page, name: string, project: string) => {
  if (process.env.SHOTS)
    await page.screenshot({ path: `${process.env.SHOTS}/${project}-${name}.png`, fullPage: true });
};

const uniqueEmail = (tag: string) =>
  `e2e-${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/**
 * Questionnaire complet (foyer 2 + 2, midi et soir du lundi au vendredi, Auchan 69003, budget,
 * sans porc, moins de 30 min, styles, un ingrédient évité, plaques seulement).
 */
async function fillQuestionnaire(page: Page, project: string) {
  await expect(page.getByRole('heading', { name: 'Qu’est-ce qui t’amène ?' })).toBeVisible();
  await page.getByText('Mes courses me coûtent trop cher').click();
  await shot(page, 'motivations', project);
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Vous êtes combien à table ?' })).toBeVisible();
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await page.getByRole('button', { name: 'Ajouter un enfant' }).click();
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Quels repas on prévoit ?' })).toBeVisible();
  await page.getByRole('button', { name: 'samedi' }).click();
  await page.getByRole('button', { name: 'dimanche' }).click();
  await expect(page.getByText('Du lundi au vendredi')).toBeVisible();
  await expect(page.getByText('10 repas', { exact: true })).toBeVisible();
  await shot(page, 'repas', project);
  await nextQuestion(page);

  // Retour arrière sans perte.
  await expect(page.getByRole('heading', { name: 'Où fais-tu tes courses ?' })).toBeVisible();
  await page.getByRole('button', { name: 'Question précédente' }).click();
  await expect(page.getByRole('button', { name: 'samedi' })).toHaveAttribute('aria-pressed', 'false');
  await nextQuestion(page);

  // Erreurs utiles, saisie conservée.
  await nextQuestion(page);
  await expect(page.getByText('Choisis ton enseigne habituelle.')).toBeVisible();
  // Picard (assortiment partiel) est proposé, avec un avertissement une fois choisi.
  await page.getByText('Picard', { exact: true }).click();
  await expect(page.getByText('Picard ne vend pas tout')).toBeVisible();
  // Outre-mer : seules les enseignes présentes sur place.
  await page.getByLabel('Code postal').fill('97400');
  await expect(page.getByRole('radio')).toHaveCount(4);
  await expect(page.getByRole('radio', { name: 'Lidl' })).toHaveCount(0);
  await expect(
    page.getByText('Les prix affichés sont pour l’instant ceux de la métropole', { exact: false }),
  ).toBeVisible();
  await page.getByLabel('Code postal').fill('');
  await page.getByText('Auchan', { exact: true }).click();
  await page.getByLabel('Code postal').fill('690');
  await nextQuestion(page);
  await expect(page.getByText('Le code postal fait 5 chiffres, par exemple 69003.')).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Auchan' })).toBeChecked();
  await page.getByLabel('Code postal').fill('69003');
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Quel budget pour tes courses ?' })).toBeVisible();
  await page.getByLabel('Budget par semaine').fill('60');
  await shot(page, 'budget', project);
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Un régime ou des allergies ?' })).toBeVisible();
  await page.getByText('Sans porc', { exact: true }).click();
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Quelle ambiance à table ?' })).toBeVisible();
  await page.getByText('Gourmand', { exact: true }).click();
  await page.getByText('Rapide & facile', { exact: true }).click();
  await page.getByText('En famille', { exact: true }).click();
  // 3 styles au plus : les autres se désactivent.
  await expect(page.getByRole('checkbox', { name: /Saveurs du monde/ })).toBeDisabled();
  await page.getByText('Moins de 30 min', { exact: true }).click();
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Quelles cuisines te font envie ?' })).toBeVisible();
  await page.getByText('Réunionnaise', { exact: true }).click();
  await page.getByText('Italienne', { exact: true }).click();
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Des ingrédients à éviter ?' })).toBeVisible();
  await page.getByLabel('Chercher un ingrédient').fill('champ');
  await page.getByText('Champignons de Paris', { exact: true }).click();
  await expect(page.getByText('1 ingrédient évité')).toBeVisible();
  await nextQuestion(page);

  await expect(page.getByRole('heading', { name: 'Ton équipement ?' })).toBeVisible();
  await page.getByText('Four', { exact: true }).click();
  await page.getByText('Plaques', { exact: true }).click();
  await nextQuestion(page);
  await expect(page.getByText('Choisis au moins un équipement : plaques, four ou air fryer.')).toBeVisible();
  await page.getByText('Plaques', { exact: true }).click();
  await shot(page, 'equipement', project);
  await page.getByRole('button', { name: 'Composer ma semaine' }).click();
  // Écran de composition : les critères appliqués.
  await expect(page.getByRole('heading', { name: 'On compose ta semaine…' })).toBeVisible();
  await expect(page.getByText('Régime respecté : Sans porc')).toBeVisible();
  await expect(page.getByText('Faisable avec : Plaques')).toBeVisible();
  await expect(page.getByText('10 repas pour 4 personnes, de saison, chez Auchan.')).toBeVisible();
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

  // Et elles sont bien enregistrées dans le foyer (profil).
  await page.goto('/app/profil');
  const answers = page.getByRole('heading', { name: 'Tes réponses' }).locator('..');
  await expect(answers).toContainText('2 adultes, 2 enfants');
  await expect(answers).toContainText('10 repas · midi et soir · du lundi au vendredi');
  await expect(answers).toContainText('Auchan · 69003');
  await expect(answers).toContainText('60,00 €');
  await expect(answers).toContainText('Sans porc');
  await expect(answers).toContainText('Gourmand, Rapide & facile, En famille');
  await expect(answers).toContainText('Champignons de Paris');
  await expect(answers).toContainText('Réunionnaise, Italienne');
  await expect(answers).toContainText('Plaques');

  // Plan : 10 repas, aucun le week-end.
  await page.goto('/app/plan');
  await expect(page.getByText(/· 10 repas$/)).toBeVisible();
  const criteria = page.getByRole('region', { name: 'Ce que respecte ta semaine' });
  await expect(criteria).toContainText('Sans porc');
  await expect(criteria).toContainText('Sans four');
  await expect(criteria).toContainText('1 ingrédient évité');

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
  // Compte connecté : la semaine est générée après la dernière question.
  await expect(page.getByText('Plan généré')).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Ta semaine \d+ est prête\.$/ })).toBeVisible();
  await page.getByRole('link', { name: 'Voir mon plan →' }).click();
  await expect(page).toHaveURL(/\/app$/);
});

test('/app sans session → connexion', async ({ page }) => {
  await page.goto('/app/plan');
  await expect(page).toHaveURL(/\/connexion\?suite=%2Fapp%2Fplan/);
});

test('profil : modifier une réponse recompose la semaine', async ({ page }, info) => {
  await signUp(page, uniqueEmail(`profil-${info.project.name}`));
  await page.goto('/app/profil');
  await page.getByRole('link', { name: /Modifier : Repas/ }).click();
  await expect(page.getByRole('heading', { name: 'Quels repas on prévoit ?' })).toBeVisible();
  await page.getByText('Le soir', { exact: true }).click();
  await page.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page).toHaveURL(/\/app\/profil\?fait=recomposee/);
  await expect(page.getByText('Ta semaine a été recomposée avec tes nouvelles réponses.')).toBeVisible();
  await page.goto('/app/plan');
  await expect(page.getByText(/· 7 repas$/)).toBeVisible();
});
