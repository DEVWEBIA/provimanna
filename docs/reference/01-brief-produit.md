# Brief produit : web app d'abord, puis mobile et back-office

Nom de l'appli à définir · Palette retenue : **Aubergine & orange**

## 1. La décision : commencer par le web

On lance d'abord une **web app installable (PWA)** et son **back-office**, puis on ajoute les applis iOS et Android sur le même backend.

Pourquoi le web d'abord :

- **Plus de marge** : les abonnements web passent par Stripe (environ 1,5 % + 0,25 € par paiement en Europe) au lieu des 15 % prélevés par les stores.
- **Itérer vite** : on publie plusieurs fois par jour, sans validation Apple ou Google.
- **Acquisition gratuite** : les pages recettes, « menus de la semaine à moins de 70 € » et comparatifs d'enseignes se référencent sur Google, ce qu'une appli ne fait pas.
- **Partage simple** : un lien suffit pour envoyer sa liste à son conjoint.
- **Valider la demande** avant d'investir dans deux stores.

Le risque à couvrir : une web app fidélise moins qu'une appli. On le compense avec l'installation en PWA (icône sur l'écran d'accueil), les notifications web push (disponibles sur iPhone depuis iOS 16.4 pour les PWA installées), l'email récap et un rituel hebdomadaire fort.

## 2. Phasage

| Phase | Période | Contenu |
|---|---|---|
| 1 · Web app + BO MVP | Mois 1 à 3 | Plan, comparateur, liste, abonnement Stripe, back-office prix et recettes |
| 2 · Croissance web | Mois 4 à 5 | SEO recettes et comparatifs, parrainage, défis, récap mensuel |
| 3 · Applis mobiles | Mois 6 à 8 | React Native + Expo sur le même backend, scan de ticket natif, notifications push |
| 4 · International | Mois 9 et au-delà | Belgique, Suisse, Canada : enseignes, devises, traductions |

## 3. Stack technique

- **Monorepo** (Turborepo) : `apps/web` (Next.js, App Router), `apps/admin` (Next.js), plus tard `apps/mobile` (Expo) ; `packages/ui` (tokens du design system), `packages/core` (moteur de calcul des prix, partagé entre le web et le mobile).
- **Supabase** : Postgres, Auth, RLS avec rôles (utilisateur, modérateur, éditeur, admin), Storage pour les tickets, Edge Functions pour l'ingestion des prix.
- **Paiement** : Stripe Billing sur le web. Au passage au mobile, RevenueCat pour les achats intégrés, branché aussi sur Stripe pour qu'un abonnement pris sur le web soit reconnu dans l'appli.
- **Données prix** : API Open Prices, Open Food Facts pour les fiches produits, tickets scannés par les utilisateurs.
- **Suivi** : PostHog (produit), Sentry (erreurs), emails transactionnels via Resend ou Brevo.

## 4. Web app : périmètre de la première version

1. **Inscription et onboarding** : foyer (adultes, enfants), régime, enseigne habituelle, code postal.
2. **Tableau de bord** : semaine en cours, économies cumulées, série de semaines, défi du mois, menu du jour, promos sur le plan, produits de saison.
3. **Plan de la semaine** : grille 7 jours × midi et soir, glisser-déposer, filtres (végé, moins de 30 min, de saison, enfants), remplacement en un clic, régénération.
4. **Comparateur** : total du plan dans chaque enseigne, toujours visible dans un panneau latéral. Le libre choix est conservé, même vers une enseigne plus chère.
5. **Détail produit par produit** (Premium).
6. **Liste de courses** : par rayon, partageable, ouverture du drive de l'enseigne.
7. **Recettes** : fiche, coût par part, ingrédients et étapes, favoris.
8. **Abonnement** : essai de 14 jours sans carte, puis 4,99 €/mois ou 39,99 €/an.
9. **PWA** : installable, notifications web push, liste disponible hors ligne.

Sur le web, le scan de ticket se fait par envoi d'une photo. Le scan natif arrive avec l'appli.

## 5. Back-office

| Module | Rôle |
|---|---|
| Vue d'ensemble | Actifs hebdo, essais en cours, conversion de l'essai vers le payant, revenu mensuel, couverture des prix, entonnoir, liste « à traiter » |
| Enseignes et magasins | Liste des enseignes par pays, magasins, zones de prix |
| Prix | Imports Open Prices, alertes de prix aberrants (écart de plus de 40 % avec la médiane), historique par produit |
| Modération des tickets | File des tickets, photo, lignes lues avec indice de confiance, validation ou rejet ligne par ligne, validation automatique au-delà d'un seuil |
| Produits | Fiches EAN, correspondance entre ingrédient de recette et produits |
| Recettes | Éditeur, saisonnalité, coût calculé automatiquement, publication |
| Utilisateurs | Recherche, foyer, abonnement (lecture Stripe), support |
| Engagement | Défis du mois, notifications, emails récap, bannières |
| Rôles | Admin, modérateur prix, éditeur recettes |

## 6. Donner envie de revenir

Le produit doit créer un **rendez-vous hebdomadaire** et rendre les économies visibles, sans manipulation.

- **Le rituel du jeudi** : chaque jeudi soir, le plan de la semaine suivante est prêt, avec une notification « Ton menu est prêt : 68 € cette semaine ».
- **Compteur d'économies cumulées**, toujours visible, avec un récap mensuel par email.
- **Série** : le nombre de semaines consécutives planifiées, avec un joker par mois pour ne pas pénaliser une semaine de vacances.
- **Défi du mois** : par exemple « Novembre à moins de 70 € par semaine », avec un badge.
- **De saison** : une sélection de recettes qui change chaque semaine.
- **Alertes utiles** : uniquement les promos sur un produit du plan.
- **Famille** : une liste partagée en temps réel, chacun coche de son côté.

À éviter : les comptes à rebours artificiels, la culpabilisation (« tu perds de l'argent »), les notifications sans valeur.

## 7. Direction UX/UI

- **Palette Aubergine & orange** : aubergine `#4A2545` pour la marque et les actions, orange `#EE7A30` réservé aux économies (toujours avec du texte foncé), fond sable `#F6F3EC`, encre `#2A1A28`. Police Nunito. Illustrations de plats vus de dessus.
- **Desktop** : navigation latérale, tableau de bord en cartes, plan en grille de 7 colonnes, comparateur dans un panneau à droite.
- **Mobile web** : les mêmes écrans que les maquettes mobiles, avec une barre d'onglets en bas.
- **Back-office** : la même identité, plus sobre et dense. Barre latérale foncée (encre), élément actif en aubergine, tableaux filtrables, états visibles par pastilles.

## 8. Indicateurs

- **Activation** : premier plan généré dans les 24 h suivant l'inscription.
- **Rétention** : part des inscrits actifs en semaine 1 et en semaine 4.
- **Rituel** : part des utilisateurs qui ouvrent le plan du jeudi.
- **Conversion** de l'essai vers le payant, et churn mensuel.
- **Couverture des prix** : part des produits avec un prix de moins de 7 jours, par enseigne.

## 9. Points ouverts

- Nom de l'appli et nom de domaine.
- Couverture réelle d'Open Prices par enseigne : audit à faire en semaine 1.
- Mentions légales : prix indicatifs, CGU, RGPD pour les photos de tickets.
- Partenariats drive : à démarcher quand l'audience sera là.
