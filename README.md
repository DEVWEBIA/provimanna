# Appli Repas — package de démarrage

Tout ce qu'il faut pour lancer (ou reprendre) le développement dans **Cursor avec Claude Code** : contexte projet, maquettes, design tokens, schéma de base de données, moteur de prix testé et feuille de route découpée en lots avec des prompts prêts à coller.

## Démarrer en 5 minutes

1. **Dézippe** le dossier et ouvre-le dans Cursor (`File → Open Folder`).
2. **Initialise git** : `git init && git add . && git commit -m "Initialise le projet"`.
3. Ouvre le terminal intégré de Cursor et lance **Claude Code** : `claude`.
   (Claude Code lit `CLAUDE.md` automatiquement ; Cursor lit `.cursor/rules/projet.mdc` pour son propre agent.)
4. Vérifie que le moteur de prix passe : `node --test packages/core/src/*.test.ts` (Node ≥ 22.18, voir `.nvmrc`).
5. Colle ce premier message à Claude Code :

   > Lis CLAUDE.md et docs/08-roadmap-claude-code.md, puis attaque le lot 0. Propose-moi ton plan avant de coder.

Ensuite, un lot par session, dans l'ordre. Chaque lot se termine par un commit.

## Prérequis sur ta machine

- Node 22 (≥ 22.18) et pnpm 9 : `corepack enable`
- Docker (pour Supabase en local) et la CLI Supabase : `brew install supabase/tap/supabase`
- Comptes à créer au moment du lot concerné : Supabase (lot 1, prod au lot 13), Stripe (lot 7), Resend (lot 11), PostHog et Sentry (lot 13), Vercel (lot 13).
- Copie `.env.example` en `.env.local` dans chaque app quand le lot le demande.

## Contenu

```
CLAUDE.md                     contexte + règles lus par Claude Code à chaque session
.cursor/rules/projet.mdc      mêmes règles pour l'agent Cursor
docs/
  05-plan-action-site-bo-webapp.md   règles métier (prix, économies, gratuit/premium, tickets…)
  06-seo-geo.md               checklist SEO/GEO, JSON-LD, robots, llms.txt
  07-ecrans-et-routes.md      chaque maquette → sa route Next.js
  08-roadmap-claude-code.md   13 lots avec prompts prêts à coller
  reference/                  brief produit, plan business, plan de dev, brief design d'origine
design/
  maquettes/                  67 écrans (.dc.html) + canvas.json — la référence visuelle
  tokens.css · tokens.json · tailwind-preset.ts
  legacy-maquettes/           anciennes maquettes, pour mémoire uniquement
supabase/
  migrations/0001_schema.sql  22 tables, fonctions is_premium / has_role, trigger d'inscription
  migrations/0002_rls.sql     RLS sur toutes les tables + Storage privé des tickets
  seed.sql                    données des maquettes (Marion, Auchan, 69003, velouté 4,06 €…)
  config.toml
packages/core/                moteur de prix en TypeScript pur + 10 tests
package.json · pnpm-workspace.yaml · turbo.json · .env.example
```

## Voir les maquettes

Les fichiers `.dc.html` ne s'ouvrent pas seuls dans un navigateur : ce sont des sources lisibles (HTML + styles inline + données d'exemple). Pour les voir rendues et cliquables, ouvre le canevas :
**https://claude.ai/artifact/5jZWZN62kmmSBaSMTJarG2**

Plan d'action d'origine : https://claude.ai/artifact/1pKfZiHWrAnhMPQ5pmm7iq

## Ce qui est déjà vérifié

- `packages/core` : 10 tests passent, typecheck strict OK. Les chiffres des maquettes (velouté 4,06 € / 4,96 €, écart 11,50 €, économies 58,30 €) sont verrouillés par `seed-consistency.test.ts`.
- `supabase/migrations` + `seed.sql` : exécutés sans erreur sur PostgreSQL 16 (38 policies RLS).

## À trancher (voir la fin de CLAUDE.md)

Nom et domaine, logo, récompense de parrainage, mention TVA, licences Open Prices (ODbL) et Open Food Facts.

## Conseils pour travailler avec Claude Code

- Une session = un lot. Si la session s'allonge, `/compact` puis continue.
- Demande toujours le plan avant le code sur les lots 1, 5, 7 et 10 (base de données, algorithme, paiement, OCR).
- Pour un écran : « Ouvre design/maquettes/AppListe.dc.html et liste ce que tu vas reproduire avant de coder. »
- Si Claude Code propose de changer une décision figée, refuse ou demande pourquoi : `CLAUDE.md` fait foi.
