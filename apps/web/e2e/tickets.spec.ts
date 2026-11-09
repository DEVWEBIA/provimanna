import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { createModerator, latestReceiptId, signUp, uniqueEmail } from './helpers';
import { extractCode, waitForEmail } from './mailbox';

const ADMIN = process.env.ADMIN_URL ?? 'http://localhost:3001';
const PHOTO = fileURLToPath(new URL('./fixtures/ticket.jpg', import.meta.url));

// Lecteur de démo (sans clé Anthropic) : ticket Auchan de la maquette, 8 lignes.
test('ticket : envoi, lecture, modération puis jours de Premium', async ({ page, browser, isMobile }) => {
  test.skip(isMobile, 'le back-office est desktop ; le parcours mobile est couvert par l’envoi');
  test.setTimeout(120_000);
  await signUp(page, uniqueEmail('ticket'));

  await page.goto('/app/ticket');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('gagne 3 jours de Premium.');
  await page.locator('input[type="file"]').setInputFiles(PHOTO);
  await expect(page.getByText('ticket.jpg')).toBeVisible();
  await page.getByRole('button', { name: 'Envoyer mon ticket' }).click();
  await expect(page.getByText('8 lignes lues chez Auchan.')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/produits reconnus/)).toBeVisible();
  await expect(page.getByText(/arrivent dès que l’équipe a validé le ticket/)).toBeVisible();

  // Modération dans un autre contexte : sur localhost, les cookies sont partagés entre les ports.
  // Un compte dédié évite la limite d'un code par 30 s sur le compte admin.
  const moderator = await createModerator('ticket');
  const staffContext = await browser.newContext();
  const staff = await staffContext.newPage();
  await staff.goto(`${ADMIN}/connexion`);
  await staff.getByLabel('Adresse email professionnelle').fill(moderator);
  await staff.getByRole('button', { name: 'Recevoir mon code' }).click();
  const mail = await waitForEmail(moderator);
  await staff.getByLabel('Code reçu').fill(extractCode(mail.text));
  await staff.getByRole('button', { name: 'Se connecter' }).click();
  await staff
    .getByRole('navigation', { name: 'Back-office' })
    .getByRole('link', { name: /^Tickets/ })
    .click();
  await expect(staff.getByRole('heading', { level: 1 })).toContainText('Tickets à valider');
  // Ouvert par son identifiant : les tickets de démo de la file ont tous les mêmes lignes.
  const receiptId = await latestReceiptId();
  await staff.goto(`${ADMIN}/tickets?id=${receiptId}`);
  await expect(staff.locator(`a[href="/tickets?id=${receiptId}"]`)).toHaveAttribute('aria-current', 'page');
  await expect(staff.getByText('lu « FETA AOP 200G »')).toBeVisible();
  await expect(staff.getByText('lu « PROMO -30% COCO » · promo')).toBeVisible();
  await staff.getByRole('button', { name: 'Publier et ticket suivant →' }).click();
  await expect(staff.getByText(/prix publiés, \+3 jours offerts\./)).toBeVisible();

  await staffContext.close();

  await page.goto('/app/ticket');
  await expect(page.getByText('Validé').first()).toBeVisible();
  await expect(page.getByText('+3 jours').first()).toBeVisible();
});
