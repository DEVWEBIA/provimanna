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

## Avancement

- [x] Lot 0 — Monorepo (Next.js 16, Tailwind 3.4 pour garder le preset JS tel quel, next-intl sans segment de locale, polices via next/font)
- [ ] Lot 1 — Supabase
- [ ] Lot 2 — Design system
- [ ] Lot 3 — Landing et socle SEO
- [ ] Lot 4 — Connexion et onboarding
- [ ] Lot 5 — Génération du plan
- [ ] Lot 6 — Comparateur et liste
- [ ] Lot 7 — Paiement
- [ ] Lot 8 — Recettes et pages SEO
- [ ] Lot 9 — Back-office
- [ ] Lot 10 — Tickets et prix
- [ ] Lot 11 — Emails, notifications, PWA
- [ ] Lot 12 — Famille, économies, mode sombre
- [ ] Lot 13 — Qualité et mise en ligne
