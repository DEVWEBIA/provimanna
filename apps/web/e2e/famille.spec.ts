import { expect, test } from '@playwright/test';
import { signUp, uniqueEmail } from './helpers';

test('famille : inviter, rejoindre par le lien, quitter', async ({ page, browser }, info) => {
  const owner = uniqueEmail(`famille-a-${info.project.name}`);
  const guest = uniqueEmail(`famille-b-${info.project.name}`);
  await signUp(page, owner);
  await page.goto('/app/famille');
  await expect(page.getByRole('heading', { level: 1, name: 'Famille et parrainage' })).toBeVisible();
  await page.getByLabel('Inviter par email').fill(guest);
  await page.getByRole('button', { name: 'Créer l’invitation' }).click();
  const link = await page.getByLabel('Lien d’invitation').inputValue();
  expect(link).toMatch(/\/invitation\/[0-9a-f]{48}$/);
  await expect(page.getByText(`${guest}`)).toBeVisible();

  const other = await browser.newContext();
  const p2 = await other.newPage();
  await signUp(p2, guest);
  await p2.goto(new URL(link).pathname);
  await expect(p2.getByRole('heading', { name: /t’invite dans son foyer$/ })).toBeVisible();
  await p2.getByRole('button', { name: 'Rejoindre ce foyer' }).click();
  await expect(p2).toHaveURL(/\/app\/famille$/);
  await expect(p2.getByText('2 / 6 membres')).toBeVisible();
  await expect(p2.getByText('Titulaire · gère l’abonnement')).toBeVisible();

  // Le lien ne sert qu'une fois.
  await p2.goto(new URL(link).pathname);
  await expect(p2.getByRole('heading', { name: 'Ce lien a expiré ou a déjà servi.' })).toBeVisible();

  await p2.goto('/app/famille');
  await p2.getByRole('button', { name: 'Quitter ce foyer' }).click();
  await expect(p2.getByText(/^Tu as quitté le foyer\./)).toBeVisible();
  await expect(p2.getByText('1 / 6 membres')).toBeVisible();
  await other.close();
});

test('économies, série et thème sombre', async ({ page }, info) => {
  await signUp(page, uniqueEmail(`eco-${info.project.name}`));
  await page.goto('/app/economies');
  await expect(page.getByRole('heading', { name: 'Tes économies apparaîtront ici.' })).toBeVisible();

  // Valider la semaine : la série démarre, la semaine apparaît dans les économies.
  await page.goto('/app/comparateur');
  await page.getByRole('button', { name: 'Garder Lidl' }).click();
  await expect(page).toHaveURL(/\/app\/liste$/);
  await page.goto('/app/economies');
  await expect(page.getByRole('heading', { name: 'Semaine par semaine' })).toBeVisible();
  await expect(page.getByText(/^1\s*semaine d’affilée$/)).toBeVisible();

  await page.goto('/app/profil');
  await page.getByRole('radio', { name: 'Sombre' }).click();
  await expect(page.locator('[data-theme="dark"]').first()).toBeAttached();
  await page.getByRole('radio', { name: 'Auto' }).click();
  await expect(page.locator('[data-theme="system"]').first()).toBeAttached();
});
