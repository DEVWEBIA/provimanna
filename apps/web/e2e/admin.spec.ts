import { expect, test, type Page } from '@playwright/test';
import { seedAberrantPrice } from './helpers';
import { extractCode, waitForEmail } from './mailbox';

const ADMIN = process.env.ADMIN_URL ?? 'http://localhost:3001';

async function staffLogin(page: Page, email: string) {
  await page.goto(`${ADMIN}/connexion`);
  await page.getByLabel('Adresse email professionnelle').fill(email);
  await page.getByRole('button', { name: 'Recevoir mon code' }).click();
  await expect(page.getByRole('status')).toContainText(email);
  const mail = await waitForEmail(email);
  await page.getByLabel('Code reçu').fill(extractCode(mail.text));
  await page.getByRole('button', { name: 'Se connecter' }).click();
}

// Le back-office est desktop ; un seul passage suffit (et évite deux demandes de code en 30 s).
test.describe('back-office', () => {
  test.skip(({ isMobile }) => isMobile, 'parcours desktop');

  test('admin : vue d’ensemble, modération d’un prix, journal', async ({ page }) => {
    await seedAberrantPrice();
    await staffLogin(page, 'admin@example.com');
    await expect(page.getByRole('heading', { level: 1, name: 'Vue d’ensemble' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Couverture des prix (relevés de moins de 7 jours)' }),
    ).toBeVisible();

    await page.getByRole('navigation', { name: 'Back-office' }).getByRole('link', { name: /^Prix/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Prix' })).toBeVisible();
    const first = page.locator('tbody tr').first();
    const product = (await first.locator('button').first().textContent()) ?? '';
    await page.getByRole('button', { name: 'Valider (V)' }).click();
    await expect(page.getByText('Prix validé : il entre dans la médiane.')).toBeVisible();

    expect(product.length).toBeGreaterThan(0);

    // Recettes : le coût se recalcule à chaque modification, l'enregistrement est journalisé.
    const nav = page.getByRole('navigation', { name: 'Back-office' });
    await nav.getByRole('link', { name: 'Recettes' }).click();
    await page.getByRole('link', { name: 'Velouté de potimarron' }).click();
    const cost = page.locator('section[aria-live="polite"] li').first();
    const before = (await cost.textContent()) ?? '';
    await page.getByLabel('Quantité 1').fill('2');
    await expect(cost).not.toHaveText(before);
    await page.getByLabel('Quantité 1').fill('1');
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Recette enregistrée.')).toBeVisible();

    // Produits : deux fiches identiques → doublon détecté → fusion.
    const name = `Produit test ${Date.now()}`;
    for (let i = 0; i < 2; i++) {
      await nav.getByRole('link', { name: 'Produits' }).click();
      await page.getByText('Nouvelle fiche').click();
      const form = page.locator('details form');
      await form.getByLabel('Nom').fill(name);
      await form.getByLabel('Format').fill('500 g');
      await form.getByRole('button', { name: 'Créer la fiche' }).click();
      await expect(page.getByRole('heading', { name, level: 2 })).toBeVisible();
    }
    await expect(page.getByText('Doublon probable')).toBeVisible();
    await page.getByRole('button', { name: 'Fusionner les fiches' }).click();
    await expect(page.getByText('Fiches fusionnées.')).toBeVisible();

    await nav.getByRole('link', { name: 'Rôles et journal' }).click();
    await expect(page.getByText('a validé un prix').first()).toBeVisible();
    await expect(page.getByText('produit.fusionner').first()).toBeVisible();
    await expect(page.getByText('recette.enregistrer').first()).toBeVisible();

    // Support : fiche utilisateur et jours offerts ; enseignes ; paramètres.
    await nav.getByRole('link', { name: 'Utilisateurs' }).click();
    await page.getByLabel('Rechercher un utilisateur').fill('marion');
    await page.getByLabel('Rechercher un utilisateur').press('Enter');
    await expect(page.getByRole('heading', { name: 'Marion D.', level: 2 })).toBeVisible();
    await page.getByRole('button', { name: 'Offrir 7 jours de Premium' }).click();
    await expect(page.getByText('7 jours de Premium offerts.')).toBeVisible();

    await nav.getByRole('link', { name: 'Enseignes' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Enseignes et magasins' })).toBeVisible();
    await page.getByRole('button', { name: 'Enregistrer' }).click();
    await expect(page.getByText('Enseigne enregistrée.')).toBeVisible();

    await nav.getByRole('link', { name: 'Paramètres' }).click();
    await expect(page.getByText('Alerte prix aberrant au-delà de')).toBeVisible();
  });

  test('un compte sans rôle staff est refusé', async ({ page }) => {
    await staffLogin(page, 'marion@example.com');
    await expect(page.getByRole('heading', { name: 'Accès réservé à l’équipe' })).toBeVisible();
  });
});
