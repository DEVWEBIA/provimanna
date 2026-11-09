import { expect, test } from '@playwright/test';
import { signUp, uniqueEmail } from './helpers';

test('site public : recettes, prix par enseigne, données structurées', async ({ page }) => {
  await page.goto('/recettes');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Recettes pas chères, prix compris.' }),
  ).toBeVisible();
  await page.getByRole('link', { name: /^Végétariennes/ }).click();
  await expect(page).toHaveURL(/filtre=vege/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Recettes végétariennes pas chères' }),
  ).toBeVisible();

  await page.goto('/recettes/veloute-potimarron');
  await expect(page.getByRole('heading', { level: 1, name: 'Velouté de potimarron' })).toBeVisible();
  await expect(page.getByText(/^Pour 4 personnes, cette recette coûte/)).toBeVisible();
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(14); // en-tête + 13 enseignes
  await page.getByRole('button', { name: 'Plus de parts' }).click();
  await expect(page.getByText('6 personnes')).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  const recipe = ld
    .map((t) => JSON.parse(t) as { '@type': string; estimatedCost?: { value: string } })
    .find((d) => d['@type'] === 'Recipe');
  expect(recipe?.estimatedCost?.value).toMatch(/^\d+\.\d{2}$/);
});

test('espace client : ajouter une recette à la semaine, fiche, mode cuisine', async ({
  page,
  isMobile,
}, info) => {
  await signUp(page, uniqueEmail(`recettes-${info.project.name}`));
  await page.goto('/app/recettes');
  await expect(page.getByRole('heading', { name: 'Recettes', level: 1 })).toBeVisible();
  // Recherche par ingrédient, puis ajout d'une recette qui n'est pas déjà dans la semaine tirée au hasard.
  await page.getByLabel('Rechercher une recette').fill('lentilles');
  await expect(page.getByRole('heading', { level: 2, name: 'Dahl de lentilles corail' })).toBeVisible();
  await page.getByLabel('Rechercher une recette').fill('');
  const add = page.getByRole('button', { name: '+ Ajouter à ma semaine' }).first();
  await add.click();
  await expect(page.getByText(/^1 recette à placer dans ta semaine \d+$/)).toBeVisible();
  await page.getByRole('button', { name: 'Les placer dans mon plan' }).click();
  await expect(page).toHaveURL(/\/app\/plan$/);
  if (!isMobile) await expect(page.getByText('Verrouillé').first()).toBeAttached();

  await page.goto('/app/recettes/dahl-lentilles-corail');
  await expect(page.getByRole('heading', { name: 'Dahl de lentilles corail' })).toBeVisible();
  await page.waitForLoadState('networkidle'); // page interactive (hydratée) avant de cocher
  await page.getByRole('checkbox').first().check();
  await expect(page.getByText('1 ingrédient déjà dans tes placards')).toBeVisible();
  await page.getByRole('tab', { name: 'Étapes' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Émince');

  await page.getByRole('link', { name: 'Mode cuisine' }).click();
  await expect(page.getByText(/^ÉTAPE 1 SUR \d+$/)).toBeVisible();
  await page.getByRole('button', { name: 'Étape suivante →' }).click();
  await expect(page.getByText(/^ÉTAPE 2 SUR \d+$/)).toBeVisible();
  await page.getByRole('link', { name: 'Quitter le mode cuisine' }).click();
  await expect(page).toHaveURL(/\/app\/recettes\/dahl-lentilles-corail$/);
});
