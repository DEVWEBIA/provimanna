# 10 — Fichier de reprise (état au 08/11/2026, après le lot 12)

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
| Harmonisation visuelle | ✅ (08/11) effets de la home sur tout le produit |
| 5 Génération du plan | ✅ (08/11) |
| 6 Comparateur et liste | ✅ (08/11) — **jalon J3 atteint** |
| 8 Recettes et pages SEO | ✅ (08/11, fait avant le lot 7 avec l'accord d'Emmanuel) — **jalon J5 atteint** |
| 7 Paiement | ⏳ attend un compte Stripe (mode test) |
| 9 Back-office | ✅ (08/11) — **jalon J6 atteint** (Tickets et Imports avec le lot 10) |
| 12 Famille, économies, mode sombre | ✅ (08/11, fait avant 10 et 11 avec l'accord d'Emmanuel) |
| 10, 11, 13 | à faire (OCR au lot 10, Resend + domaine au lot 11, comptes de prod au lot 13) |

Dernier commit : `60fe4da Affiche les logos des enseignes dans le bandeau…` (13 commits sur `main`, rien en attente).

## Points ouverts

- **Logo Carrefour** : aucun fichier réutilisable trouvé ; le bandeau affiche « Carrefour » en lettres grises en attendant un SVG.
- **Parrainage** : la récompense reste à décider (CLAUDE.md) ; le lien et le rattachement du parrain fonctionnent.
- **Lot 7 bloqué sans compte Stripe** (mode test suffit) : clés `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, 2 prix (4,99 €/mois, 39,99 €/an). Et décision : mention TVA des factures (micro-entreprise, art. 293 B du CGI ?).

## Ce qui existe

**Site public (`apps/web`)** — en plus de la page d'accueil : `/recettes` et `/recettes/[slug]`, `/comparatif-prix-supermarches`, `/enseignes/[id]`, `/menus/[slug]`, `/guide/batch-cooking`, `/methodologie`, `/comment-ca-marche`, pages légales (gabarits), 404, `/prix-courses/[ville]` (seuil de 30 relevés). Gabarit commun `components/site/site-page.tsx`, blocs `components/seo/blocks.tsx`, panier type `lib/observatory.ts`, client sans cookies `lib/supabase/public.ts`.

**Page d'accueil (`/`)** — page d'accueil refaite plusieurs fois à la demande d'Emmanuel (la maquette `Main.dc.html` n'est plus la référence pour la landing) :
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
- `/app` : tableau de bord (maquettes AppDashboard/MDashboard) : semaine en ticket aubergine, total dans l'enseigne du foyer, « Possible dès … », repas du jour, produits de saison. Garde : session (proxy) + onboarding terminé (layout `app/app/(main)`).
- `/app/plan` : grille 7 jours × midi/soir (glisser-déposer, menu Voir la recette / Remplacer / Verrouiller), jour par jour sur mobile, filtres + « Varier la semaine », comparateur 6 enseignes « Ce plan coûte… ». Données : `lib/plan.ts` (`currentPlan`, `ensureWeekPlan`, `planView`), actions : `app/app/(main)/plan/actions.ts`.
- `/app/comparateur` : barres des 6 enseignes, détail produit par produit (Premium ; 2 lignes en gratuit), « Basculer ma liste chez … » / « Garder … » = validation de la semaine.
- `/app/liste` : liste par rayon, cochage temps réel + file hors ligne, partage. Liste publique `/liste/[token]`. Logique : `lib/list.ts` (`validatePlan`, `syncShoppingList`), action `app/app/(main)/liste/actions.ts`. Écritures sensibles via `lib/supabase/admin.ts` (service_role, serveur seulement).
- Catalogue : 53 recettes, `supabase/catalogue/generate.mjs` → `supabase/catalogue.sql` (relancer le script après modification, puis `supabase db reset`).

**Back-office (`apps/admin`, :3001)** : connexion staff par code (`admin@example.com` en local), rôle vérifié par page (`lib/staff.ts`), journal d'audit (`log_action`, migration 0007). Rubriques : vue d'ensemble, prix (modération des aberrants), produits (fusion de doublons), recettes (éditeur, coût en direct), utilisateurs, enseignes, contenu SEO, engagement, rôles et journal, paramètres.

**Packages** : `packages/core` (moteur de prix, `generatePlan`/`replaceMeal`, semaines à l'heure de Paris, `recipeServingCents`, `cheaperProductCount`, saisons…), `packages/ui` (composants + briques de style de la home : `Reveal`, `Glow`, `PageHeader`, `GlassCard`, `animDelay`, `inputClasses` ; animations dans `packages/ui/styles/motion.css`), `packages/eslint-config`.

**Tests** : core 10 node:test + 62 Vitest, ui 16, web 7 Vitest, **32 tests RLS pgTAP**, **22 e2e Playwright** (desktop + mobile, dont le back-office). Lighthouse landing : desktop 100 partout, mobile 94-95 en performance (le bol est l'élément le plus lourd en 4G simulée).

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
- **Next.js mémorise les requêtes GET identiques pendant un rendu** (y compris celles de supabase-js) : relire une ligne avec la même requête juste après l'avoir créée renvoie l'ancien résultat. Renvoyer les lignes insérées (`.insert().select()`), voir `ensureWeekPlan`.
- **Captures Playwright `fullPage: true`** : elles relancent les animations d'entrée, les éléments apparaissent vides. Capturer l'écran visible (après défilement) pour juger du rendu.
- **Animations et piles** : un élément animé (`anim-rise`) crée un contexte d'empilement ; un menu déroulant à l'intérieur passe sous la carte suivante → remonter le parent (`z-30`) quand le menu est ouvert.
- **Serveur de dev** : après l'ajout d'une fonction exportée par core, ou une modification de `apps/admin/src/lib/staff.ts`, le serveur garde parfois l'ancien module (« X is not a function », navigation incomplète) : le redémarrer.
- **Tests e2e et base locale** : chaque test prépare ses propres données (comptes uniques, relevé aberrant créé via la clé serveur de `.env.local`, voir `e2e/helpers.ts`) ; ne pas supposer l'état laissé par un autre test.
- **Zod 4** : utiliser `z.guid()` pour les identifiants (les ids fixes du seed ne sont pas des UUID versionnés, `z.uuid()` les refuse).
- Espace client, lot 12 : `/app/economies`, `/app/famille` (+ `/invitation/[token]`), `/app/profil` (thème), `loading.tsx` / `error.tsx`, bandeau hors ligne. Mode sombre : attribut `data-theme` sur l'AppShell + `packages/ui/styles/dark.css` (à compléter si un nouvel écran utilise d'autres fonds clairs).
- Espace client : `/app/recettes`, `/app/recettes/[slug]`, mode cuisine `/app/recettes/[slug]/cuisine` (groupe de routes `(cuisine)`, sans la navigation).
- Démo locale : `marion@example.com` (Auchan, 2 adultes + 2 enfants, sans porc), connexion par code via Mailpit. Sa semaine en cours vient du seed (validée chez Lidl).
- Les tests RLS tournent sur la base locale réelle : ils doivent rester indépendants des données créées en testant l'appli à la main (`on conflict`, nettoyage).

## Prochaines étapes

1. **Lot 7 — Paiement** dès réception du compte Stripe (mode test) et de la décision sur la mention TVA.
2. **Lot 10 — Tickets et prix** (fournisseur OCR + vérification de la licence Open Prices), **lot 11 — Emails, PWA** (Resend + domaine ; brancher alors l'envoi des invitations famille et du lien support), **lot 13 — mise en ligne** (revalidation à la demande des pages publiques, RGPD, PostHog, Sentry, Vercel, Supabase prod).
3. Idée validée en principe : capture de l'appli dans un téléphone pour la landing.
3. Idée proposée, non tranchée : une photo de saison qui change automatiquement sur la landing.
