# 10 — Fichier de reprise (état au 08/11/2026)

> À lire en début de nouvelle conversation, après `CLAUDE.md`. Il dit où on en est, ce qui a été décidé, ce qui attend une réponse et comment reprendre.
> Détail de chaque décision : `docs/09-plan-action.md` (section « Journal des décisions techniques »). Lots : `docs/08-roadmap-claude-code.md`.

## Message à coller pour reprendre

```
Lis CLAUDE.md, puis docs/10-reprise.md et docs/09-plan-action.md.
On reprend le projet là où il s'est arrêté. Tu as les droits pour avancer en mode auto, lot par lot
(un commit par lot, vérifications typecheck / lint / tests / e2e à chaque fois).
Commence par me confirmer l'état et la prochaine étape.
```

## Contexte en bref

- Projet personnel d'Emmanuel avec son/sa conjoint·e. Web app (PWA) de plans de repas + prix de la liste de courses dans 6 enseignes. Nom définitif pas encore choisi (`[Nom de l'appli]`, constante `APP_NAME`).
- Mode de travail validé : Claude avance **en autonomie, lot par lot** (un commit par lot), et s'arrête pour demander dès qu'il faut un compte ou une clé, une décision produit, ou une migration SQL qui change le modèle de données. Point d'étape aux jalons.
- L'app mobile (Expo) est hors périmètre pour l'instant.

## Où on en est

25 commits sur `main`, rien en attente. Dernier : `4425a27 Ajoute de vraies photos de plats aux recettes et ajuste les logos d'enseignes`.

| Lot | État |
|---|---|
| 0 Monorepo · 1 Supabase · 2 Design system | ✅ |
| 3 Landing + socle SEO | ✅ (landing refaite plusieurs fois à la demande) |
| 4 Connexion + onboarding | ✅ (questionnaire avant compte sur `/commencer`) |
| Harmonisation visuelle | ✅ effets de la page d'accueil étendus à tout le produit |
| 5 Génération du plan | ✅ |
| 6 Comparateur et liste | ✅ — jalon J3 |
| 8 Recettes et pages SEO | ✅ (fait avant le 7, avec accord) — jalon J5 |
| 9 Back-office | ✅ — jalon J6 (écrans Tickets et Imports reportés au lot 10) |
| 12 Famille, économies, mode sombre, états | ✅ (fait avant 10 et 11, avec accord) |
| Logos en couleur + vraies photos de plats | ✅ (demandes du 08/11) |
| Questionnaire enrichi (1 question par écran) | ✅ (demande du 08/11, migration 0008 ; recomposition en gratuit validée) |
| Landing animée (Motion) + accent Instrument Serif | ✅ (demandes du 08/11) |
| **7 Paiement** | ⏳ attend un compte Stripe |
| **10 Tickets et prix** | ⏳ attend un fournisseur OCR + vérification de licence |
| **11 Emails, notifications, PWA** | ⏳ attend Resend + un domaine |
| **13 Qualité et mise en ligne** | ⏳ attend les comptes de prod, le nom et le domaine |

**Tous les lots restants dépendent d'Emmanuel.** Sans réponse, il ne reste que des améliorations ponctuelles (voir « Prochaines étapes »).

## Ce qui attend une réponse d'Emmanuel

1. **Lot 7** : compte Stripe en mode test (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, 2 prix : 4,99 €/mois et 39,99 €/an) + décision sur la **mention TVA** des factures (micro-entreprise : « TVA non applicable, art. 293 B du CGI » ?).
2. ~~Lot 10~~ fait le 09/11. Reste : **clé Anthropic** pour lire de vrais tickets (`supabase/functions/.env` en local : `ANTHROPIC_API_KEY=…` ; en prod : `supabase secrets set ANTHROPIC_API_KEY=…`), et un **compte Open Prices** pour reverser les prix des tickets.
3. **Lot 11** : compte **Resend** (ou Brevo) + domaine d'envoi.
4. **Lot 13** : nom de l'appli, domaine, Vercel, Supabase prod (UE), PostHog, Sentry.
5. **Logos sur les pages éditoriales publiques** (observatoire, pages enseigne, tableaux de prix des recettes et menus) : encore en pastilles neutres. Les passer aussi en logos couleur ? (question posée, sans réponse)
6. ~~Logo Carrefour~~ : récupéré le 08/11 (fr.wikipedia), avec ceux des 6 nouvelles enseignes.
7. **Récompense de parrainage** : à décider (le lien et le rattachement du parrain fonctionnent, aucune récompense n'est promise).
8. Écarts de maquettes laissés de côté (à trancher si besoin) : droits par membre de la famille (« coche la liste seulement », demande une migration), règle des « jokers » de la série, badges de défis visuels, paramètres du BO modifiables (demande une table de réglages, donc une migration).

## Ce qui existe

**Site public (`apps/web`, :3000)**
- Accueil `/` : menu flottant, hero animé (ticket comparateur interactif, bol qui tourne), **bandeau des enseignes avec vrais logos en couleur**, « Comment ça marche », recettes en photos, FAQ, CTA en ticket.
- Pages : `/recettes` (filtres `?filtre=`, tri, recherche `?q=`) et `/recettes/[slug]` (réponse chiffrée, prix des 6 enseignes pour 2 à 8 personnes, JSON-LD `Recipe`), `/comparatif-prix-supermarches` (observatoire, `Dataset`), `/enseignes/[id]`, `/menus/[slug]` (2 menus), `/guide/batch-cooking`, `/methodologie`, `/comment-ca-marche` (`HowTo`), pages légales (gabarits avec mentions entre crochets), 404 avec recherche, `/prix-courses/[ville]` (publiée seulement au-delà de 30 relevés locaux récents : aucune aujourd'hui).
- Socle SEO : metadata, JSON-LD, OG, `robots.ts`, sitemap segmenté (pages + recettes), `/llms.txt`.
- Briques : gabarit `components/site/site-page.tsx`, blocs `components/seo/blocks.tsx`, panier type reproductible `lib/observatory.ts`, client anonyme sans cookies `lib/supabase/public.ts` (pages en ISR 24 h).

**Parcours et espace client (`/app`)**
- `/commencer` (questionnaire sans compte, **9 questions, une par écran** : motivations, foyer, jours et repas, enseigne, budget, régime, ambiance, ingrédients évités, équipement ; puis lien magique ; code de parrainage `?parrain=` transmis). Modifier une seule réponse : `/app/bienvenue?etape=<id>` depuis le profil, `/connexion` (lien ou code à 6 chiffres ; Google et Apple prêts mais désactivés), `/app/bienvenue` (questionnaire du compte, génère la semaine).
- `/app` tableau de bord (semaine, total, « Possible dès… », série, économies, défi, repas du jour), `/app/plan` (grille 7 × 2 avec glisser-déposer, remplacer, verrouiller, varier ; comparateur latéral), `/app/comparateur` (choisir son enseigne = **valider la semaine**, totaux figés côté serveur), `/app/liste` (par rayon, temps réel, file hors ligne, partage `/liste/[token]`), `/app/recettes` + fiche + **mode cuisine**, `/app/economies`, `/app/famille` (invitations par lien, `/invitation/[token]`), `/app/profil` (préférences, notifications, **thème auto / clair / sombre**). La page Notifications n'existe pas encore (lot 11).
- **Vraies photos de plats** : 47 recettes sur 53 (`components/recipes/recipe-photo.tsx`, repli sur l'illustration `<Plat>`). Sans photo : chou sauté, colin purée, gratin de butternut, saucisses aux lentilles, spaghetti épinards-tomate, tarte aux poireaux. Liste et crédits : `supabase/catalogue/photos.json`, `apps/web/public/recettes/CREDITS.md`, script `apps/web/scripts/recipe-photos.mjs` (télécharge, recadre, régénère `lib/recipe-photos.ts`).
- **Logos des enseignes en couleur** dans l'espace client : `components/store-logo.tsx` (vignette blanche, lisible en sombre).
- États : `loading.tsx`, `error.tsx`, bandeau hors ligne, encart « prix incomplets », encart « Prix de démonstration ».
- Logique : `lib/plan.ts` (`currentPlan`, `ensureWeekPlan`, `planView`), `lib/list.ts` (`validatePlan` + série, `syncShoppingList`), `lib/engagement.ts`, `lib/family.ts`, `lib/recipes.ts`. Écritures sensibles via `lib/supabase/admin.ts` (clé serveur, jamais côté client).

**Back-office (`apps/admin`, :3001)** : connexion staff par code (aucune création de compte), rôle vérifié par page (`lib/staff.ts`), journal d'audit (`log_action`). Rubriques : vue d'ensemble (chiffres réels), prix (modération des aberrants au clavier), produits (fusion de doublons), recettes (éditeur, **coût recalculé en direct**), utilisateurs (support), enseignes (**logos couleur**), contenu SEO, engagement, rôles et journal, paramètres (lecture).

**Données** : catalogue de 53 recettes et 76 produits, généré par `supabase/catalogue/generate.mjs` → `supabase/catalogue.sql` (régimes et allergènes déduits des ingrédients). **Prix de démonstration** (`source = 'manual'`) en attendant Open Prices et les tickets (lot 10), signalés dans l'appli.

**Packages** : `packages/core` (prix, `generatePlan` / `replaceMeal`, semaines à l'heure de Paris, coûts par recette et par ingrédient, comparaisons produit par produit, totaux par rayon, `savingsCents`, `nextStreak`, `challengeProgress`…), `packages/ui` (composants, briques de style : `Reveal`, `Glow`, `PageHeader`, `GlassCard`, `animDelay`, `inputClasses` ; `styles/motion.css`, `styles/dark.css`).

**Migrations** : 0001 schéma, 0002 RLS, 0003 droits colonne par colonne, 0004 temps de cuisine, 0005 familles et marqueurs des recettes, 0006 liste et validation (totaux écrits par le serveur, « coché par » posé par la base, temps réel, `shared_list`), 0007 journal d'audit, 0008 réponses enrichies du questionnaire (jours et repas, budget, styles, équipement, ingrédients évités, motivations). 0009 équipement élargi et cuisines. **Prochain numéro libre : 0010.**

**Tests** : core 10 node:test + 62 Vitest, ui 16, web 7 Vitest, **32 tests RLS** (`pnpm db:test`), **22 e2e Playwright** desktop + mobile (dont back-office, famille, recettes, SEO).

## Décisions clés (à ne pas défaire sans demander)

- **Aubergine `#6B3868`** (l'ancienne `#4A2545` reste dans les maquettes). Orange réservé aux économies, texte foncé dessus.
- **Logos d'enseignes en couleur** (décision du 08/11, remplace celle du 07/11) : bandeau de la landing, espace client, back-office. Pages éditoriales publiques : pastilles neutres pour l'instant. Mention « Marques et logos © leurs propriétaires respectifs » ; retirer immédiatement si une enseigne le demande. `CLAUDE.md` à jour.
- **Inscription directe**, tous les CTA mènent à `/commencer`.
- **Choisir son enseigne = valider la semaine** ; totaux figés par le serveur (base des économies). La bascule vers une autre enseigne que la sienne est Premium ; varier et remplacer aussi ; verrouiller et déplacer restent gratuits.
- **Économies** : uniquement sur les semaines validées, jamais d'économie hypothétique.
- Un enfant compte pour 0,7 part, arrondi à la part supérieure.
- Régimes multiples : `diet` = régime principal, le reste dans `exclusions`.
- Textes en français dans les composants ; `next-intl` gère locale et fuseau.
- Photos Unsplash (licence gratuite vérifiée, pas d'Unsplash+), provisoires.
- Ordre des lots modifié avec accord : 8, 9 et 12 faits avant 7, 10 et 11.

## Lot 10 en local

- Edge Functions : `supabase functions serve` (sert `ocr-receipt` et `import-open-prices`). Sans `ANTHROPIC_API_KEY`, la lecture utilise le ticket de démo.
- Import Open Prices : bouton « Lancer maintenant » dans BO › Prix › Imports (appelle l'API réelle).
- **Piège** : un `supabase db reset` lancé depuis un worktree fait perdre le modèle d'email (connexion sans code à 6 chiffres, e2e en échec « Code introuvable »). Remède : `supabase stop && supabase start` depuis le dossier principal, puis relancer `supabase functions serve`.
- Tests e2e : `tickets.spec.ts` (envoi → modération → +3 jours) et `imports.spec.ts` créent un modérateur de test dédié (évite la limite d'un code par 30 s sur `admin@example.com`) et ouvrent la modération dans un contexte séparé (cookies partagés entre ports sur localhost).

## Environnement local

```bash
pnpm install
supabase start              # API :55321, Studio :55323, boîte mail Mailpit :55324, DB :55322
supabase db reset           # migrations + seed + catalogue
pnpm dev                    # web :3000, admin :3001
pnpm lint && pnpm typecheck && pnpm test
pnpm db:test                # tests RLS (pgTAP)
pnpm --filter @repas/web test:e2e   # nécessite supabase start et pnpm dev
```

- Comptes de démo (connexion par code, lu dans Mailpit) : **`marion@example.com`** (espace client : Auchan, 2 adultes + 2 enfants, sans porc, 6 semaines validées, 58,30 € d'économies) et **`admin@example.com`** (back-office, rôle admin). N'importe quelle adresse inventée crée un compte en local.
- `apps/web/.env.local` et `apps/admin/.env.local` existent (non commités), avec la clé serveur locale.
- **Une autre stack Supabase (« masonate ») tourne sur la machine** sur les ports 543xx : ne pas y toucher. Ce projet est sur **553xx**, Postgres 17.
- Captures : `node apps/web/scripts/screenshots.mjs <dossier> /chemin` (`STEPS`, `WAIT`, `BASE_URL`). Playwright + Chromium installés. Lighthouse : `npx lighthouse@13.6.0`.

## Pièges déjà rencontrés (gagner du temps)

- **Tailwind + tokens en `var(--…)`** : l'opacité (`bg-surface-50/80`) ne marche pas → couleurs `raw-*` du preset ou `bg-white/70`. Blanc constant : `bg-raw-blanc`.
- **Mode sombre** : attribut `data-theme` sur l'AppShell (`light` / `dark` / `system`) + `packages/ui/styles/dark.css`. Un nouvel écran qui utilise d'autres fonds clairs doit y être ajouté.
- **`typedRoutes`** : lien vers une route pas encore créée → `href()` de `apps/web/src/lib/site.ts`.
- **React 19** réinitialise les formulaires après `<form action>` → `onSubmit` + `startTransition` pour garder la saisie. Un message affiché dans un composant qui disparaît après l'action est perdu → rediriger avec un paramètre (`?fait=…`) et afficher un bandeau.
- **Animations** : une animation sur `transform` écrase `translate`/`rotate` du même élément → deux éléments. Un élément animé crée un contexte d'empilement → monter le parent (`z-30`) quand un menu s'ouvre dedans.
- **Next.js mémorise les GET identiques pendant un rendu** (supabase-js compris) : après une insertion, renvoyer les lignes insérées au lieu de relire.
- **Serveur de dev** : après l'ajout d'une fonction exportée par `packages/core` ou une modification de `apps/admin/src/lib/staff.ts`, il garde parfois l'ancien module (« X is not a function ») → le redémarrer.
- **Fichier `'use client'`** : une constante ou une fonction qu'il exporte devient une référence client côté serveur (« X.includes is not a function ») → la mettre dans un module sans directive (`onboarding/schema.ts`, `lib/meal-days.ts`).
- **Zod 4** : `z.guid()` pour les identifiants (les ids fixes du seed ne sont pas des UUID versionnés).
- **Linter React** : pas de `Date.now()` ni de `setState` synchrone dans le corps d'un composant ou d'un effet.
- **Tests** : la base locale est partagée → chaque test prépare ses données (comptes uniques, relevé aberrant via `e2e/helpers.ts`, `on conflict` en pgTAP). Le délai e2e est à 15 s (compilation à la première visite) ; attendre `networkidle` avant de cocher.
- **Captures `fullPage: true`** relancent les animations → capturer l'écran visible.
- `opengraph-image` doit être dans le même segment que la page. Next 16 : `middleware` s'appelle `proxy.ts`. Prettier réordonne les classes Tailwind → relire avant d'éditer.
- **Photos Unsplash** : le téléchargement passe par `https://unsplash.com/photos/<id>/download` (script) ; ne pas contourner les sites qui bloquent les robots. Toujours vérifier les images à l'œil (planche contact) avant de les intégrer.

## Prochaines étapes

1. **Lot 7 — Paiement** dès réception du compte Stripe et de la décision TVA (maquettes MPaywall, AppAbonnement, SiteTarifs, SiteMerci, EmailRecu ; le webhook écrira `subscriptions` avec la clé serveur ; les liens « Essayer Premium » mènent déjà à `/app/abonnement`).
2. **Lot 10** (OCR + licence), **lot 11** (Resend + domaine : brancher alors l'envoi des invitations famille, du lien support et la page Notifications), **lot 13** (revalidation à la demande des pages publiques depuis le BO, RGPD, PostHog, Sentry, Vercel, Supabase prod).
3. En attendant, sans compte : trouver de meilleures photos pour les 6 recettes sans photo ; passer les pages éditoriales en logos couleur si Emmanuel le confirme ; capture de l'appli dans un téléphone pour la landing (idée validée en principe) ; photo de saison qui change automatiquement sur la landing (idée non tranchée).
