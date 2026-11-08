// Photos des recettes (Unsplash, licence gratuite) : télécharge, recadre en carré, met à jour les crédits.
// Usage : node scripts/recipe-photos.mjs [--force]
// Entrée : supabase/catalogue/photos.json  [{ slug, id, url, author, note }]
// Sorties : public/recettes/<slug>.jpg, public/recettes/CREDITS.md, src/lib/recipe-photos.ts
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const list = JSON.parse(readFileSync(join(root, '../../supabase/catalogue/photos.json'), 'utf8'));
const out = join(root, 'public/recettes');
mkdirSync(out, { recursive: true });
const force = process.argv.includes('--force');

const ok = [];
for (const p of list) {
  if (!p.id) continue;
  const file = join(out, `${p.slug}.jpg`);
  if (existsSync(file) && !force) {
    ok.push(p);
    continue;
  }
  // Point de téléchargement officiel (compte le téléchargement pour l'auteur), puis recadrage par le CDN d'Unsplash.
  const res = await fetch(`https://unsplash.com/photos/${p.id}/download?force=true`, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (!location) {
    console.error(`✗ ${p.slug} : pas de redirection (${res.status})`);
    continue;
  }
  const base = location.split('?')[0];
  const img = await fetch(`${base}?w=900&h=900&fit=crop&crop=entropy&q=78&fm=jpg`);
  if (!img.ok || !img.headers.get('content-type')?.startsWith('image/')) {
    console.error(`✗ ${p.slug} : image indisponible (${img.status})`);
    continue;
  }
  writeFileSync(file, Buffer.from(await img.arrayBuffer()));
  ok.push(p);
  console.log(`✓ ${p.slug}`);
}

writeFileSync(
  join(out, 'CREDITS.md'),
  `# Crédits des photos de recettes\n\nPhotos sous [licence Unsplash](https://unsplash.com/license) : usage commercial gratuit, attribution non obligatoire (mais appréciée). À remplacer à terme par de vraies photos des recettes du catalogue.\n\n| Recette | Photo | Auteur |\n| --- | --- | --- |\n${ok
    .map((p) => `| ${p.slug} | ${p.url} | ${p.author} |`)
    .join('\n')}\n`,
);
writeFileSync(
  join(root, 'src/lib/recipe-photos.ts'),
  `// GÉNÉRÉ par apps/web/scripts/recipe-photos.mjs : recettes qui ont une photo dans public/recettes/<slug>.jpg.\nexport const RECIPE_PHOTOS: ReadonlySet<string> = new Set<string>([\n${ok
    .map((p) => `  '${p.slug}',`)
    .join('\n')}\n]);\n`,
);
console.log(`${ok.length} photos sur ${list.length} recettes`);
