# 05 — Plan d'action et règles fonctionnelles (site, web app, back-office)

Ce document fixe **ce que chaque partie doit faire** et les **règles métier**. L'aspect visuel est dans `design/maquettes/`, les routes dans `07-ecrans-et-routes.md`, l'ordre de travail dans `08-roadmap-claude-code.md`.

## 1. Règles métier transverses

### Prix
- Prix d'un produit dans une enseigne = **médiane des relevés de moins de 7 jours** ; à défaut, médiane des relevés de moins de 30 jours, affichée comme estimation (`≈`) ; à défaut, « prix inconnu » (produit exclu du total et signalé).
- Indice de fiabilité d'un total : part des lignes au prix frais. ≥ 90 % → ●●● · ≥ 60 % → ●●○ · sinon ●○○.
- Relevé **aberrant** : écart > 40 % avec la médiane. Il n'entre pas dans la médiane et part en modération (BO Prix).
- Toujours afficher « Prix relevés le JJ/MM ».
- Implémentation de référence : `packages/core/src/pricing.ts` (testé). Ne pas réécrire ces calculs ailleurs.

### Économies
- Économie d'une semaine = coût dans l'**enseigne habituelle** du foyer (`meal_plans.reference_cents`) − coût dans l'enseigne **choisie** (`total_cents`), plancher à 0, **uniquement pour un plan validé**.
- Total affiché « depuis septembre » = somme des économies des plans validés. Jamais d'économie hypothétique présentée comme réalisée.
- Garder son enseigne est un choix respecté : pas de message culpabilisant, l'écart est affiché en information.

### Gratuit / Premium
| Fonction | Gratuit | Premium / essai |
|---|---|---|
| Plans | 1 par semaine | illimités, régénération par repas |
| Prix | détail dans son enseigne + totaux des 5 autres | détail produit par produit dans les 6 |
| Liste | partageable par lien | bascule vers une autre enseigne, partage famille temps réel |
| Alertes promo | — | oui |
- Essai : **14 jours sans carte** à l'inscription (`subscriptions.tier = 'trial'`). À la fin : retour au gratuit, sans perte de données.
- Jours bonus (`bonus_days`) : +3 jours par ticket validé, +30 jours par ami parrainé abonné (récompense à confirmer).
- Le contrôle d'accès se fait **côté serveur** (`is_premium(household_id)`), l'UI ne fait que refléter.

### Génération du plan
- Entrées : foyer (adultes, enfants → parts), régime, exclusions, saison (mois), budget cible éventuel, enseigne.
- Contraintes : pas deux fois la même recette dans la semaine, variété des familles de plats (soupe, pâtes, poisson…), recettes de saison en priorité, coût par part minimisé sans sacrifier la variété.
- Repas « verrouillé » : conservé lors d'une régénération.
- Le jeudi à 19:00 (heure de Paris), une tâche planifiée génère le plan de la semaine suivante et envoie l'email + la notification « Ton menu est prêt ».

### Tickets de caisse
- Photo → Storage privé `receipts/{user_id}/` → OCR → lignes rapprochées des produits (confiance).
- Confiance ≥ 0,85 sur toutes les lignes : validation automatique. Sinon : file de modération.
- Ticket validé : prix insérés (`source = 'ticket'`), +3 jours Premium, notification « Ticket validé ».
- Un ticket de plus de 7 jours ou en double (même total, même enseigne, même date) est refusé.

### Notifications
- **2 par semaine au maximum** (hors actions explicites de la famille). Types : menu prêt, promo sur un ingrédient du plan, liste modifiée par un membre, ticket validé, série, défi.
- Réglables dans Profil. Pas de faux compte à rebours, pas d'urgence artificielle.

### Famille
- Un foyer = plusieurs profils. Invitation par email (lien valable 7 jours). Liste partagée en temps réel (Supabase Realtime), chaque article indique « ajouté par Léa » / « coché par Léa ».

## 2. Site public (SEO / GEO)

À faire, dans l'ordre :
1. **Landing** (`Main`) : promesse chiffrée, ticket de caisse animé, comparatif 6 enseignes, preuves, FAQ, CTA unique « Créer mon plan gratuit ».
2. **Pages programmatiques** (ISR, revalidation quotidienne) : recettes (`/recettes/[slug]`), enseignes (`/enseignes/[id]`), villes (`/prix-courses/[ville]`), comparatif hebdo (`/comparatif-prix-supermarches`), menus (`/menus/[slug]`).
3. **Pages piliers** : guide (`/guide/...`), méthodologie (`/methodologie`), comment ça marche, tarifs.
4. Légal, merci, 404.
5. Socle technique SEO/GEO : voir `06-seo-geo.md`.

Règle éditoriale : chaque page s'ouvre sur **une réponse directe, chiffrée et datée** (ex. « Cette semaine, le panier de 4 personnes coûte de 60,10 € chez Lidl à 71,60 € chez Auchan. »).

## 3. Web app (client)

Parcours critique : connexion → onboarding (4 étapes) → plan → comparateur → liste → (paywall) → courses → ticket.

Écrans : tableau de bord, plan, recette (+ mode cuisine), comparateur, liste, ticket, économies, famille, notifications, profil/abonnement, recettes, états (vides, erreurs, hors ligne), mode sombre.

Exigences : PWA installable, liste utilisable hors ligne (cache + file de synchro), navigation 8 entrées harmonisée (Accueil, Mon plan, Liste de courses, Recettes, Mes économies, Famille, Notifications, Profil), version mobile avec barre d'onglets 5 entrées (Accueil, Plan, Liste, Recettes, Profil).

## 4. Back-office

Rôles : `admin` (tout), `moderateur_prix` (prix, produits, tickets, imports), `editeur` (recettes, SEO), `support` (utilisateurs en lecture, abonnements).

Écrans : vue d'ensemble (KPI), prix aberrants, tickets à modérer, produits (rapprochement EAN), enseignes, imports Open Prices, recettes (éditeur + coût calculé en direct), SEO (pages, statut d'indexation), engagement (séries, défis, notifications), utilisateurs, rôles, paramètres (seuils : 7 j, 30 j, 40 %, 0,85, bonus).

Toute action de modération est journalisée (qui, quand, avant/après).

## 5. Hors périmètre MVP

Application mobile native (phase 3, Expo), scan code-barres natif, RevenueCat, pays hors France, logo définitif.
