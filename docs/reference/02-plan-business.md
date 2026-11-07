# Plan d'action business

Nom de l'appli à définir (Planivore abandonné).

## Positionnement

Une web app (puis des applis iOS et Android) de planification de repas qui compare le coût du plan entre les enseignes (Lidl, Aldi, E.Leclerc, Auchan, Intermarché, Carrefour…). Pas de commande en drive dans la V1 : la valeur, c'est de montrer où le plan coûte le moins cher, en laissant le libre choix de l'enseigne, même si elle est plus chère.

Concurrents : Jow (planification et drive via des partenariats), KOSTO (comparateur de liste de courses), HelloFresh (box repas), Romi, Planivore. Différenciation : la planification et la comparaison réunies, et un vrai plan gratuit, alors que les avis sur les concurrents leur reprochent un plan payant.

## Modèle économique

- **Reverse trial de 14 jours** : tout le Premium sans carte bancaire, puis retour au gratuit.
- **Gratuit à vie** : 1 plan par semaine, le prix dans une enseigne, les totaux des autres enseignes visibles.
- **Premium** : détail produit par produit, changement d'enseigne en un clic, plans illimités, alertes promo, partage famille.
- **Prix cible** : 4,99 €/mois ou 39,99 €/an, avec un test A/B pendant la bêta.
- **Levier de conversion** : « Tu as économisé X € ce mois-ci ».
- **Plus tard** : affiliation et partenariats drive avec les enseignes.

## Projections

Sur le web via Stripe, il reste environ 4,90 € net par abonné mensuel. Sur mobile, après les 15 % des stores, il reste environ 4,24 €.

| Abonnés | Net par mois (stores) | Net par an (stores) |
|---|---|---|
| 10 | 42 € | 509 € |
| 15 | 64 € | 763 € |
| 50 | 212 € | 2 545 € |
| 60 | 254 € | 3 054 € |
| 100 | 424 € | 5 089 € |
| 240 | ~1 000 € | ~12 200 € |

Avec 3 à 5 % de conversion, il faut 2 000 à 3 000 utilisateurs gratuits pour obtenir 100 abonnés payants. Prévoir les cotisations auto-entrepreneur. Coûts fixes : Apple 99 $/an, Google 25 $ une seule fois ; Supabase et Stripe sans abonnement au départ.

## Plan d'action

1. **Mois 1 · Validation** : choix du nom et du domaine (vérifier l'INPI et les stores), analyse des avis Jow et KOSTO, landing page avec liste d'attente, audit de couverture d'Open Prices.
2. **Mois 2-3 · MVP web** : web app et back-office, recrutement de 50 à 100 bêta-testeurs.
3. **Mois 4 · Bêta fermée** : test des prix, conversion, rétention, collecte de tickets.
4. **Mois 4-5 · Lancement France** : SEO recettes et comparatifs, communautés « budget famille », parrainage.
5. **Mois 6-8 · Applis mobiles** : stores, ASO.
6. **Mois 9 et au-delà · International** : Belgique, Suisse, Canada, puis le reste de l'Europe.
7. **Avec l'audience** : démarchage des enseignes pour l'affiliation et le drive.

## KPI

Inscriptions, activation (premier plan), conversion de l'essai vers le payant, churn, économies moyennes, ouverture du plan du jeudi, couverture des prix par enseigne.
