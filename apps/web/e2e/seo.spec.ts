import { expect, test } from '@playwright/test';

test('pages SEO : observatoire, enseigne, menu, guide, 404, sitemap', async ({ page, request }) => {
  await page.goto('/comparatif-prix-supermarches');
  await expect(
    page.getByRole('heading', { level: 1, name: /^Quel supermarché est le moins cher en / }),
  ).toBeVisible();
  await expect(page.getByText(/^Sur notre panier type de 14 repas pour 4 personnes, /).first()).toBeVisible();
  await expect(page.getByRole('list').filter({ hasText: 'Indice 100' }).getByRole('listitem')).toHaveCount(6);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
    (t) => JSON.parse(t) as { '@type': string },
  );
  expect(ld.some((d) => d['@type'] === 'Dataset')).toBe(true);

  await page.goto('/enseignes/lidl');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Lidl est-il vraiment le moins cher ?' }),
  ).toBeVisible();
  expect((await request.get('/enseignes/inconnue')).status()).toBe(404);

  await page.goto('/menus/menu-semaine-60-euros-4-personnes');
  await expect(page.getByRole('heading', { name: 'Les 14 repas' })).toBeVisible();
  await expect(page.locator('a[href^="/recettes/"]')).toHaveCount(14);

  await page.goto('/guide/batch-cooking');
  await expect(
    page.getByRole('heading', { level: 1, name: /^Batch cooking : 5 repas en 2 heures pour / }),
  ).toBeVisible();

  // Pas de page ville sans assez de relevés locaux.
  expect((await request.get('/prix-courses/lyon')).status()).toBe(404);

  await page.goto('/une-page-qui-nexiste-pas');
  await expect(page.getByRole('heading', { name: 'Cette page est partie faire les courses.' })).toBeVisible();
  await page.getByLabel('Rechercher une recette').fill('potimarron');
  await page.getByRole('button', { name: 'Rechercher' }).click();
  await expect(page).toHaveURL(/\/recettes\?q=potimarron/);
  await expect(page.getByText(/recettes affichées pour « potimarron »/)).toBeVisible();

  const index = await (await request.get('/sitemap.xml')).text();
  expect(index).toContain('/sitemap/recettes.xml');
  const recettes = await (await request.get('/sitemap/recettes.xml')).text();
  expect(recettes).toContain('/recettes/veloute-potimarron');
});
