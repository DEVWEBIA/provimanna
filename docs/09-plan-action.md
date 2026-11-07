# 09 — Plan d'action : site public, back-office, espace client

> Mis à jour le 07/11/2026. Périmètre : web uniquement (`apps/web` = site + espace client, `apps/admin` = back-office). L'app mobile Expo est en phase 3, hors de ce plan.
> Ce document organise les lots de `08-roadmap-claude-code.md` en jalons, dit **ce qu'on doit fournir de votre côté** et suit l'avancement.

## Vue d'ensemble

| Jalon | Lots | Résultat visible | Site | Espace client | BO |
|---|---|---|---|---|---|
| **J1 — Fondations** | 0, 1, 2 | Monorepo qui démarre, base Supabase locale avec données de démo, catalogue de composants `/dev/ui` | socle | socle | socle |
| **J2 — Vitrine en ligne** | 3 | Landing + SEO technique (sitemap, JSON-LD, llms.txt) | ✅ | | |
| **J3 — Cœur produit** | 4, 5, 6 | Connexion → onboarding → plan de la semaine → comparateur 6 enseignes → liste de courses | | ✅ | |
| **J4 — Monétisation** | 7 | Essai 14 j, Stripe (4,99 € / 39,99 €), page tarifs | tarifs | abonnement | |
| **J5 — Contenu & SEO** | 8 | Recettes, menus, enseignes, villes, guides, légal (ISR) + recettes dans l'app | ✅ | recettes, mode cuisine | |
| **J6 — Back-office** | 9 | Vue d'ensemble, prix, tickets, recettes, produits, enseignes, utilisateurs, rôles… | | | ✅ |
| **J7 — Données réelles** | 10 | Import quotidien Open Prices, tickets de caisse (OCR) + modération | | ticket | imports, tickets |
| **J8 — Rétention** | 11, 12 | Emails, tâche du jeudi, PWA hors ligne, push, famille, économies, mode sombre | | ✅ | engagement |
| **J9 — Mise en ligne** | 13 | Tests bout en bout, accessibilité, RGPD, PostHog/Sentry, Vercel + Supabase prod | ✅ | ✅ | ✅ |

Ordre strict : on ne passe au lot suivant que si `pnpm typecheck && pnpm lint && pnpm test` passe, et chaque lot finit par un commit.

## Détail par lot

### J1 — Fondations
- **Lot 0 — Monorepo** : Turborepo + pnpm, `apps/web` (port 3000), `apps/admin` (port 3001), Next.js App Router, TypeScript strict, Tailwind + preset du design, polices Bricolage Grotesque / Nunito, ESLint + Prettier, Vitest dans `core`, `next-intl` (fr-FR).
- **Lot 1 — Supabase** : base locale (Docker), migrations + seed existants, types générés, clients `@supabase/ssr` (serveur, navigateur, middleware), tests RLS.
- **Lot 2 — Design system** : `packages/ui` (Button, Field, StoreChip, Reliability, Price, SavingBadge, TicketCard dentelé, Plat ×12, TabBar, AppShell, Toast, Skeleton, EmptyState) + page `/dev/ui`.

### J2 — Vitrine
- **Lot 3** : landing `/` (maquettes `Main` + `MSite`), metadata, JSON-LD, Open Graph, `robots.ts`, `sitemap.ts`, `llms.txt`. Objectif Lighthouse mobile ≥ 95.

### J3 — Cœur produit (espace client)
- **Lot 4** : `/connexion` (lien magique + code 6 chiffres, Google, Apple), garde `/app/*`, onboarding 4 étapes.
- **Lot 5** : algorithme `generatePlan()` dans `core` (testé), tableau de bord et plan (verrouiller / remplacer un repas).
- **Lot 6** : comparateur (contrôle Premium côté serveur), liste par rayon en temps réel, partage `/liste/[token]`.

### J4 — Monétisation
- **Lot 7** : Stripe Checkout + Customer Portal, webhook signé et idempotent, fin d'essai → gratuit, jours bonus, `/tarifs`, `/merci`.

### J5 — Contenu & SEO
- **Lot 8** : 16 maquettes site + recettes app ; pages ISR (24 h), seuil de 30 relevés pour les pages villes, mode cuisine (Wake Lock, minuteurs).

### J6 — Back-office
- **Lot 9** : auth staff par rôle (`admin`, `moderateur_prix`, `editeur`, `support`), 12 écrans BO, journal d'audit (migration `0003_audit.sql`, proposée avant d'être appliquée).

### J7 — Données réelles
- **Lot 10** : Edge Functions `import-open-prices` (cron quotidien, détection des aberrants) et `ocr-receipt` (fournisseur derrière une interface), seuil 0,85, +3 jours Premium par ticket validé.

### J8 — Rétention
- **Lot 11** : `packages/emails` (7 modèles React Email), Resend, cron du jeudi 19:00, plafond 2 notifications/semaine, PWA + web push.
- **Lot 12** : famille (invitations 7 j), économies (58,30 € sur le seed), séries, défis, mode sombre, tous les états vides/erreurs/hors ligne.

### J9 — Mise en ligne
- **Lot 13** : Playwright bout en bout, axe, PostHog (après consentement), Sentry, export/suppression de compte, déploiement Vercel + Supabase UE, domaine.

## Ce dont j'ai besoin de votre côté

| Quand | Quoi | Bloquant ? |
|---|---|---|
| Maintenant | Rien : les lots 0 à 3 se font en local, sans compte externe. | — |
| Lot 4 | Identifiants OAuth **Google** (console Google Cloud) et **Apple** (compte développeur, 99 €/an). En attendant, le lien magique suffit. | Non |
| Lot 7 | Compte **Stripe** (mode test) et ses clés. | Oui pour le lot 7 |
| Lot 8 | Textes légaux validés (mentions, CGU, confidentialité) et **mention TVA**. Je mets des brouillons marqués « à valider ». | Non |
| Lot 10 | Choix du fournisseur OCR (Google Vision, Mindee…) + clé ; vérification des **licences Open Prices (ODbL) / Open Food Facts**. | Oui pour la mise en ligne |
| Lot 11 | Compte **Resend** + domaine d'envoi. | Oui pour le lot 11 |
| Lot 13 | Comptes **Vercel**, **Supabase** (prod UE), **PostHog** (UE), **Sentry**, et le **nom + domaine** de l'appli. | Oui pour la mise en ligne |
| À tout moment | Récompense de parrainage, logo. | Non |

Tant qu'une décision n'est pas prise, j'utilise `APP_NAME` / `[Nom de l'appli]` et je laisse un `TODO(décision)` dans le code, sans inventer.

## Comment je travaille en mode auto

- Je suis les lots dans l'ordre ; à la fin de chacun : typecheck, lint, tests, commit en français, et je coche la case ci-dessous.
- Je m'arrête et je vous demande dès qu'il faut : un compte ou une clé, une décision produit des « points ouverts », ou une modification du schéma SQL validé.
- Les maquettes `design/maquettes/*.dc.html` font foi pour les textes, couleurs et espacements.

## Journal des décisions techniques

- **07/11 — Lot 1 : migration `0003_privileges.sql`.** Supabase n'accorde plus de droits par défaut aux rôles `anon`/`authenticated` : sans `GRANT` explicites, l'appli ne pouvait rien lire. Les droits sont accordés au plus juste, colonne par colonne pour les écritures sensibles. Cela **ferme une faille réelle** (vérifiée) : avec les anciens droits par défaut, un utilisateur pouvait modifier `profiles.household_id`, rejoindre le foyer d'un autre et lire ses plans et listes. De même, il ne peut plus se déclarer parrainé ni fixer ses jours bonus sur un ticket. Les migrations 0001 et 0002 n'ont pas été modifiées. Le journal d'audit prévu au lot 9 deviendra `0004_audit.sql`.
- **07/11 — Supabase local en Postgres 17** (version des nouveaux projets Supabase en production) et sur les **ports 553xx**, pour cohabiter avec une autre stack Supabase locale.

- **07/11 — Lot 2 : preset Tailwind complété.** Les pastilles d'enseigne `chip.1..6` reprennent les couleurs réellement utilisées par les maquettes (trois valeurs de l'ancien preset n'apparaissaient sur aucun écran). Ajout de tokens pour les couleurs secondaires des maquettes (avertissement, fond d'erreur, squelette, désactivé), pour qu'aucun composant n'écrive de couleur en dur. Polices servies par `next/font` (auto-hébergées) : l'import Google Fonts de `tokens.css` est retiré (meilleur pour Lighthouse et le RGPD).

- **07/11 — Lot 3 : « 16 % » remplacé par une valeur calculée (19 %).** La maquette dit « Le même panier peut coûter 16 % de plus », or 71,60 € face à 60,10 €, c'est **19 % de plus** (16 % correspond à l'écart rapporté au prix le plus cher, ce qui ne colle pas à la formulation). Le chiffre est maintenant calculé par `priceSpread()` dans `core`, donc toujours juste quand les prix changent.
- **07/11 — Lot 3 : formulaires email de la landing.** « Créer mon plan gratuit » et « Rejoindre la liste » envoient vers `/connexion?email=…` (inscription par lien magique au lot 4). À trancher : liste d'attente avant lancement ou inscription directe ? (voir les questions ouvertes).
- **07/11 — Textes en français écrits dans les composants.** `next-intl` est installé et gère la locale (fr-FR) et le fuseau ; l'extraction des textes en fichiers de messages se fera à l'arrivée d'un 2ᵉ marché (BE/CH/CA sont francophones, la différence portera surtout sur les devises et les prix).

- **07/11 — Lot 4 : inscription directe** (pas de liste d'attente pour l'instant) : tous les CTA de la landing mènent à `/connexion`, qui crée le compte si besoin (comme l'indique la maquette mobile : « Pas encore de compte ? Il sera créé. »). L'acceptation des CGU est enregistrée dans les métadonnées du compte.
- **07/11 — Lot 4 : migration `0004_household_cooking_time.sql`.** L'étape « Tes préférences » demande le temps de cuisine en semaine, mais aucune colonne ne le stockait. Ajout d'une colonne (valeur par défaut « peu importe »), sans impact sur l'existant.
- **07/11 — Lot 4 : régimes multiples.** La maquette permet plusieurs choix, le schéma n'a qu'un régime principal : `diet` garde le plus structurant (végétarien > halal > sans porc), les autres choix vont dans `exclusions`. La conversion, dans les deux sens, est dans `core` et testée.
- **07/11 — Lot 4 : étape 4 provisoire.** Tant que la génération du plan n'existe pas (lot 5), l'étape 4 affiche « Foyer enregistré · Tout est prêt pour ta première semaine » et un total **estimé** (≈), au lieu de « Plan généré · Ta semaine 47 est prête ». Le texte de la maquette reviendra au lot 5.
- **07/11 — Lot 4 : Google et Apple** sont prêts dans le code mais désactivés dans `supabase/config.toml` en attendant vos identifiants ; les boutons affichent alors un message clair.

- **07/11 — Page d'accueil simplifiée (demande d'Emmanuel).** Inspiration : une page épurée, fond clair, peu de blocs. Elle ne garde que le hero (titre, une phrase, un bouton, ticket comparateur), « Comment ça marche » en 3 lignes, 4 recettes avec leur prix par part, une FAQ courte (gardée pour le SEO), l'encart final et un pied de page d'une ligne. La maquette `Main.dc.html` n'est plus la référence pour la landing. Les tarifs, l'observatoire et les menus auront leurs propres pages (lot 8).
- **07/11 — Questionnaire avant le compte (demande d'Emmanuel).** « Créer mon plan gratuit » mène à `/commencer` : les 3 étapes du questionnaire, puis l'email à l'étape 4. Les réponses partent avec la demande de lien magique (métadonnées du compte) et sont appliquées au foyer à la première ouverture de l'espace client, même si le lien est ouvert sur un autre appareil. `/app/bienvenue` reste pour les comptes créés via « Se connecter ». Le questionnaire est désormais enregistré en une fois à la fin de l'étape 3, et non plus étape par étape.

- **07/11 — Aubergine éclaircie : `#4A2545` → `#6B3868` (demande d'Emmanuel).** Le contraste du texte blanc sur la nouvelle teinte reste de 8,8:1, au-dessus du minimum AA (4,5:1). Les tokens, le preset, l'icône, l'image OG et la règle de `CLAUDE.md` sont mis à jour ; les maquettes `.dc.html` gardent l'ancienne valeur.
- **07/11 — Photo de fond dans le hero.** Des potirons d'automne (Unsplash, crédits dans `src/assets/photos/CREDITS.md`) sous un voile sable dégradé pour la lisibilité. Les dents du ticket sont réellement découpées (`edge="cutout"`, masque CSS) pour rester propres sur la photo. Lighthouse : mobile 100, desktop 98 en performance.

- **07/11 — Effets et aération (inspiration planivore.eu, demande d'Emmanuel).** Seuls les principes sont repris, sans le contenu ni la mise en page de ce site concurrent : en-tête flottant en verre dépoli, apparition des blocs au défilement (`<Reveal>`, désactivée si l'utilisateur réduit les animations, contenu visible sans JavaScript), environ 130 px entre les sections, en-têtes centrés avec une étiquette, halos de couleur flous, cartes douces, bandeau défilant des 6 enseignes (pastilles neutres, sans logo), grille de recettes en photos avec le prix en surimpression. Lighthouse : 100 partout, mobile et desktop.

## Questions ouvertes (à trancher par vous)

1. ~~Liste d'attente ou inscription directe ?~~ → inscription directe (07/11). Une liste d'attente peut s'ajouter plus tard si besoin.

## Avancement

- [x] Lot 0 — Monorepo (Next.js 16, Tailwind 3.4 pour garder le preset JS tel quel, next-intl sans segment de locale, polices via next/font)
- [x] Lot 1 — Supabase (Postgres 17, ports 553xx, migration `0003_privileges.sql`, 16 tests RLS pgTAP : `pnpm db:test`)
- [x] Lot 2 — Design system (19 composants dans `packages/ui`, 16 tests de rendu, catalogue `/dev/ui` clair + sombre, script de captures `apps/web/scripts/screenshots.mjs`)
- [x] Lot 3 — Landing et socle SEO (Lighthouse mobile 100/100/100/100, desktop 100/100/96/100 : les 4 points = préchargement des pages du lot 8 pas encore créées)
- [x] Lot 4 — Connexion et onboarding (lien magique + code 6 chiffres, onboarding 4 étapes, 6 tests Playwright desktop + mobile : `pnpm --filter @repas/web test:e2e`)
- [ ] Lot 5 — Génération du plan
- [ ] Lot 6 — Comparateur et liste
- [ ] Lot 7 — Paiement
- [ ] Lot 8 — Recettes et pages SEO
- [ ] Lot 9 — Back-office
- [ ] Lot 10 — Tickets et prix
- [ ] Lot 11 — Emails, notifications, PWA
- [ ] Lot 12 — Famille, économies, mode sombre
- [ ] Lot 13 — Qualité et mise en ligne
