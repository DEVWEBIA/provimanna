# 10 — Fichier de reprise (état au 08/11/2026)

> À lire en début de nouvelle conversation, après `CLAUDE.md`. Il dit où on en est, ce qui a été décidé, ce qui bloque et comment reprendre.
> Détail des décisions : `docs/09-plan-action.md` (section « Journal des décisions techniques »). Lots : `docs/08-roadmap-claude-code.md`.

## Message à coller pour reprendre

```
Lis CLAUDE.md, puis docs/10-reprise.md et docs/09-plan-action.md.
On reprend le projet là où il s'est arrêté. Tu as les droits pour avancer en mode auto, lot par lot
(un commit par lot, vérifications typecheck / lint / tests / e2e à chaque fois).
Commence par me confirmer l'état et la prochaine étape.
```

## Contexte en bref

- Projet personnel d'Emmanuel avec son/sa conjoint·e. Web app de plans de repas + comparaison de prix dans 6 enseignes.
- Mode de travail validé : Claude avance **en autonomie, lot par lot**, et s'arrête pour demander dès qu'il faut un compte ou une clé, une décision produit, ou une migration SQL qui change le modèle de données. Point d'étape aux jalons.
- L'app mobile (Expo) est hors périmètre pour l'instant.

## Où on en est

| Lot | État |
|---|---|
| 0 Monorepo | ✅ |
| 1 Supabase | ✅ (+ migrations 0003 privilèges, 0004 temps de cuisine) |
| 2 Design system | ✅ |
| 3 Landing + socle SEO | ✅, puis landing **entièrement refaite** à la demande (voir plus bas) |
| 4 Connexion + onboarding | ✅, puis parcours **questionnaire avant compte** (`/commencer`) |
| **5 Génération du plan** | ⏳ **bloqué : réponse attendue sur le catalogue de recettes** |
| 6 → 13 | à faire |

Dernier commit : `60fe4da Affiche les logos des enseignes dans le bandeau…` (13 commits sur `main`, rien en attente).

## La question en attente (bloque le lot 5)

Le seed ne contient **qu'une recette** (velouté de potimarron) : impossible de composer 14 repas. Proposition faite à Emmanuel, sans réponse encore :
1. **(recommandé)** Claude rédige un catalogue de départ d'environ 40 recettes automne/hiver (ingrédients reliés aux produits, étapes, régimes, saisons), avec des prix de démo clairement marqués, relu ensuite depuis le BO ;
2. Emmanuel fournit ses recettes (tableur/document) à importer ;
3. Petit jeu de test (~20 recettes simples) pour faire tourner l'algorithme.

Autre point ouvert : **logo Carrefour** (aucun fichier réutilisable trouvé ; le bandeau affiche « Carrefour » en lettres grises en attendant un SVG).

## Ce qui existe

**Site public (`apps/web`, route `/`)** — page d'accueil refaite plusieurs fois à la demande d'Emmanuel (la maquette `Main.dc.html` n'est plus la référence pour la landing) :
- menu flottant (`components/site/site-header.tsx`) : large et transparent en haut, pastille de verre au défilement, section active surlignée, « Créer mon plan » visible seulement après le hero, panneau mobile ;
- hero : titre animé, trait orange sous « Tu choisis. », ticket comparateur interactif (taille du foyer) qui flotte, 2 étiquettes flottantes, **buddha bowl détouré en cercle** qui sort à droite et tourne lentement ;
- bandeau défilant des enseignes avec **vrais logos en gris** (exception autorisée, voir décisions) ;
- « Comment ça marche » (3 cartes), panneau photo famille + 3 garanties, 4 recettes en photos avec prix/part, FAQ en cartes, CTA final en ticket aubergine, pied de page minimal ;
- apparitions au défilement (`components/site/reveal.tsx`), halos flous, ~130 px entre sections ;
- SEO : metadata, JSON-LD (Organization, WebSite, SoftwareApplication, FAQPage), image OG/Twitter, `robots.ts`, sitemap segmenté (`/sitemap.xml` → `/sitemap/pages.xml`), `/llms.txt`.

**Parcours d'inscription**
- `/commencer` : questionnaire **sans compte** (foyer, préférences, enseigne + CP), étape 4 = estimation + email + CGU → lien magique. Les réponses partent dans `user_metadata.onboarding` et sont **appliquées au foyer au premier accès** (`lib/household.ts > getAccount`), même si le lien est ouvert sur un autre appareil.
- `/connexion` : lien magique **ou code à 6 chiffres** (crée le compte si besoin), Google/Apple prêts mais désactivés (`supabase/config.toml`, identifiants à fournir).
- `/app/bienvenue` : même questionnaire (`components/onboarding/wizard.tsx`, mode `account`) pour les comptes créés via « Se connecter ».
- `/app` : tableau de bord **provisoire** dans l'AppShell (le vrai arrive au lot 5). Garde : session (proxy) + onboarding terminé (layout `app/app/(main)`).

**Back-office (`apps/admin`)** : coquille seulement (page d'accueil + `/connexion` d'attente, tout est protégé par session). Le vrai BO = lot 9.

**Packages** : `packages/core` (moteur de prix + `priceSpread`, `scaleCents`, `householdFactor`, préférences ↔ `diet`/`exclusions`, `trialDaysLeft`), `packages/ui` (19 composants, `TicketCard` avec `edge="cutout"` et `tone="brand"`), `packages/eslint-config`.

**Tests** : core 10 node:test + 13 Vitest, ui 16, web 7 Vitest, **16 tests RLS pgTAP**, **6 e2e Playwright** (desktop + mobile). Lighthouse landing : desktop 100 partout, mobile 94-95 en performance (le bol est l'élément le plus lourd en 4G simulée).

## Décisions clés (à ne pas défaire sans demander)

- **Couleur de marque : aubergine `#6B3868`** (éclaircie à la demande, ancienne `#4A2545` encore dans les maquettes).
- **Logos d'enseignes** : uniquement dans le bandeau de la landing, en gris, avec « Marques et logos © leurs propriétaires respectifs » ; sources dans `apps/web/src/assets/logos/SOURCES.md`. Partout ailleurs : pastilles neutres. (`CLAUDE.md` mis à jour.)
- **Inscription directe** (pas de liste d'attente). Tous les CTA → `/commencer`.
- **Migration 0003** : Supabase ne donne plus de droits par défaut → GRANT explicites colonne par colonne. A fermé une faille réelle (un utilisateur pouvait rejoindre le foyer d'un autre via `profiles.household_id`).
- **Migration 0004** : `households.cooking_time` (enum `moins_30 | 30_45 | peu_importe`).
- **Régimes multiples** : `diet` = régime principal (végétarien > halal > sans porc), le reste dans `exclusions` (conversion dans `core`).
- « 16 % » de la maquette remplacé par une valeur calculée (19 %, `priceSpread`).
- Textes en français directement dans les composants ; `next-intl` gère locale/fuseau (extraction des messages quand un 2ᵉ marché arrive).
- Photos : Unsplash (licence gratuite, vérifiée « Free Photo », pas Unsplash+), crédits dans `apps/web/src/assets/photos/CREDITS.md`. Provisoires : à remplacer par de vraies photos des recettes.

## Environnement local

```bash
pnpm install
supabase start              # API :55321, Studio :55323, boîte mail (Mailpit) :55324, DB :55322
supabase db reset           # migrations + seed
pnpm dev                    # web :3000, admin :3001
pnpm lint && pnpm typecheck && pnpm test
pnpm db:test                # tests RLS
pnpm --filter @repas/web test:e2e   # nécessite supabase start
```

- `apps/web/.env.local` et `apps/admin/.env.local` existent (non commités), générés depuis `supabase status`.
- **Une autre stack Supabase (« masonate ») tourne sur la machine** sur les ports 543xx : ne pas y toucher. Ce projet est sur **553xx** et **Postgres 17**.
- Captures de contrôle : `node apps/web/scripts/screenshots.mjs <dossier> /chemin` (options `STEPS=n`, `WAIT=ms`, `BASE_URL`). Playwright + Chromium installés. Lighthouse : `npx lighthouse@13.6.0` (Chrome est installé).

## Pièges déjà rencontrés (gagner du temps)

- **Tailwind + couleurs en variables CSS** : l'opacité (`bg-surface-50/80`) ne marche pas sur les tokens définis en `var(--…)`. Utiliser les couleurs `raw-*` du preset (ex. `from-raw-sable/90`, `bg-raw-peche`) ou `bg-white/70`.
- **`typedRoutes`** : les liens vers des routes pas encore créées échouent au typecheck → passer par `href()` de `apps/web/src/lib/site.ts`. Le script `typecheck` fait `next typegen` avant `tsc`.
- **React 19 réinitialise les formulaires** après une action `<form action>` : pour garder la saisie en cas d'erreur, soumettre via `onSubmit` + `startTransition` (voir le wizard).
- **Animations et `transform`** : une animation qui anime `transform` écrase les classes `translate`/`rotate` du même élément → séparer positionnement et animation sur deux éléments (cas du bol du hero).
- **`opengraph-image`** doit être dans le même segment que la page qui déclare `openGraph` (sinon l'image disparaît).
- Next 16 : `middleware` s'appelle **`proxy.ts`**.
- Prettier (plugin Tailwind) réordonne les classes : les remplacements de texte par script échouent souvent → relire le fichier avant d'éditer.
- Sites qui bloquent les robots (notretemps.com, API interne Unsplash, API Wikipédia) : ne pas contourner.
- `body` a `suppressHydrationWarning` (extension ColorZilla de l'utilisateur).

## Prochaines étapes

1. Obtenir la réponse sur le **catalogue de recettes**, puis **lot 5** : `generatePlan()` pur et testé dans `packages/core` (régime, exclusions, saison, variété, verrouillages, seed aléatoire injectable), Server Actions « générer / régénérer un repas », vrais écrans `AppDashboard`/`MDashboard` et `AppPlan`/`MPlan` ; remettre à l'étape 4 du questionnaire le texte de la maquette (« Plan généré · Ta semaine NN est prête ») et brancher les vrais totaux ; capture de l'appli dans un téléphone pour la landing (idée validée en principe).
2. Lots 6 → 13 dans l'ordre (`docs/08`). Comptes à demander au moment voulu : Stripe (lot 7), fournisseur OCR (lot 10), Resend + domaine (lot 11), Vercel / Supabase prod / PostHog / Sentry + nom et domaine (lot 13). Le journal d'audit du BO sera la migration **0005** (0003 et 0004 sont prises).
3. Idée proposée, non tranchée : une photo de saison qui change automatiquement sur la landing.
