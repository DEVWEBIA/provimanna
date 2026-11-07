// Captures d'écran de contrôle visuel (serveur de dev lancé sur :3000).
// Usage : node scripts/screenshots.mjs <dossier-de-sortie> [chemin...]
//   ex. node scripts/screenshots.mjs /tmp/shots /dev/ui /dev/ui/shell
// Chaque chemin est capturé en desktop (1280 px) et en mobile (390 px), page entière.
// STEPS=n : capture plutôt n écrans successifs (plus lisibles qu'une page entière très haute).
import { chromium } from '@playwright/test';

const [out, ...paths] = process.argv.slice(2);
if (!out) {
  console.error('Usage : node scripts/screenshots.mjs <dossier-de-sortie> [chemin...]');
  process.exit(1);
}
const base = process.env.BASE_URL ?? 'http://localhost:3000';
const viewports = { desktop: { width: 1280, height: 900 }, mobile: { width: 390, height: 844 } };

const browser = await chromium.launch();
for (const path of paths.length ? paths : ['/']) {
  for (const [name, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport });
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'accueil';
    const steps = Number(process.env.STEPS ?? 0);
    if (steps > 0) {
      for (let i = 0; i < steps; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * viewport.height);
        await page.waitForTimeout(150);
        const file = `${out}/${slug}-${name}-${i + 1}.png`;
        await page.screenshot({ path: file });
        console.log(file);
      }
    } else {
      const file = `${out}/${slug}-${name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    }
    await page.close();
  }
}
await browser.close();
