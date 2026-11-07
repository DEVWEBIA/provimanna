# Plan d'action développement

Mis à jour pour la stratégie **web d'abord** : web app et back-office en premier, mobile en phase 3.

## Stack

- **Monorepo Turborepo**
  - `apps/web` : Next.js (App Router), web app et pages publiques (SEO), PWA.
  - `apps/admin` : Next.js, back-office.
  - `apps/mobile` : Expo / React Native, en phase 3.
  - `packages/ui` : tokens (`tokens.css` / `tokens.json`) et composants partagés.
  - `packages/core` : moteur de calcul des coûts par enseigne, types, logique métier partagée.
- **Backend Supabase** : Postgres, Auth, RLS avec rôles, Storage (photos de tickets), Edge Functions (ingestion Open Prices, OCR, cron du plan du jeudi).
- **Paiement** : Stripe Billing (web). RevenueCat en phase 3, relié à Stripe.
- **Prix** : API Open Prices et Open Food Facts pour les produits (EAN).
- **i18n dès le départ** (next-intl ou i18next), avec un pays et une devise par foyer.
- **Suivi** : PostHog, Sentry. Emails : Resend ou Brevo.

## Modèle de données

`users`, `households` (adultes, enfants, régime, code postal, enseigne préférée), `stores` (enseigne, pays), `store_locations`, `products` (EAN), `prices` (produit, enseigne, prix, date, source, confiance), `recipes`, `recipe_ingredients` (correspondance vers les produits), `meal_plans`, `meal_plan_items`, `shopping_lists`, `shopping_list_items`, `receipts`, `receipt_lines` (texte lu, produit reconnu, confiance, décision), `streaks`, `challenges`, `user_challenges`, `subscriptions` (miroir Stripe), `roles`.

## MVP

1. Onboarding : foyer, régime, enseigne, code postal.
2. Génération du plan de la semaine, plus la tâche planifiée du jeudi soir.
3. Liste de courses agrégée par rayon.
4. **Comparateur** : coût dans l'enseigne choisie et totaux des autres, changement d'enseigne avec libre choix conservé.
5. Paywall avec reverse trial de 14 jours (Stripe).
6. Export de la liste et ouverture du drive de l'enseigne.
7. Envoi de la photo d'un ticket, avec OCR, récompensé par des jours de Premium.
8. Back-office : vue d'ensemble, modération des tickets, prix aberrants, recettes, produits.

## Étapes

1. **Semaines 1-2** : monorepo, schéma Supabase et RLS, ingestion Open Prices, mesure de la couverture.
2. **Semaines 3-4** : recettes, correspondance ingrédients vers EAN, moteur de coût par enseigne (prix médian récent, repli sur une estimation, indice de confiance).
3. **Semaines 5-6** : écrans de la web app (tableau de bord, plan, comparateur, liste, recette).
4. **Semaine 7** : Stripe, paywall, réservation des fonctions Premium.
5. **Semaine 8** : back-office (vue d'ensemble, modération des tickets, prix).
6. **Semaine 9** : OCR des tickets, PostHog, Sentry, PWA et notifications push.
7. **Semaines 10-11** : bêta fermée, corrections, RGPD, mentions légales, mise en ligne.
8. **Phase 3** : Expo, en réutilisant `packages/core` et les tokens, puis RevenueCat et le scan natif.

## Points de vigilance

- Fraîcheur des prix : afficher l'indice de confiance et la date du relevé.
- Pas de scraping des drives en production (risque juridique et de blocage).
- Prix des abonnements par pays : Stripe sur le web, les stores sur mobile.
- Architecture prête pour un futur connecteur drive et l'affiliation.
