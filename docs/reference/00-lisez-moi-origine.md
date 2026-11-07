# Appli repas & comparateur : dossier de reprise

Ce dossier regroupe tout ce qui a été produit sur le projet, pour le reprendre dans une autre conversation Claude. Commence par ce fichier, puis donne à Claude les documents dont il a besoin.

## Le projet en bref

- **Idée** : une application qui génère le plan de repas de la semaine et compare son coût entre les enseignes de supermarché (Lidl, Aldi, E.Leclerc, Intermarché, Auchan, Carrefour…).
- **Différenciation** : la planification et la comparaison sont réunies dans la même appli. Le plan est vraiment gratuit (les avis des concurrents reprochent le plan payant). L'utilisateur reste **libre de garder son enseigne**, même si elle est plus chère.
- **Nom** : pas encore choisi. « Planivore » a été abandonné. Le nom de travail est « Appli repas ».
- **Objectif** : un revenu complémentaire, avec un lancement en France puis à l'international (Belgique, Suisse, Canada).
- **Concurrents identifiés** : Jow (planification et drive), KOSTO (comparateur de liste), HelloFresh (box repas), Romi, Planivore.

## Décisions prises

| Sujet | Décision |
|---|---|
| Ordre de lancement | **Web app d'abord** (PWA) et back-office, puis les applis iOS et Android sur le même backend |
| Stack | Monorepo Turborepo. Next.js (App Router) pour le web et le back-office, React Native + Expo pour le mobile en phase 3. Supabase (Postgres, Auth, RLS, Storage, Edge Functions) |
| Paiement | Stripe Billing sur le web. RevenueCat (achats intégrés et Stripe) quand le mobile arrive |
| Source des prix | API Open Prices (Open Food Facts) et tickets de caisse scannés par les utilisateurs. Pas de scraping des drives |
| Modèle | Reverse trial de 14 jours sans carte, puis gratuit à vie limité. Premium à 4,99 €/mois ou 39,99 €/an |
| Gratuit | 1 plan par semaine, prix dans son enseigne, totaux des autres enseignes visibles |
| Premium | Détail produit par produit, changement d'enseigne en un clic, plans illimités, alertes promo, partage famille |
| Drive | V1 : export de la liste et ouverture du drive de l'enseigne. Plus tard : partenariats et affiliation |
| Rétention | Le plan est prêt chaque jeudi soir, compteur d'économies cumulées, série de semaines (avec un joker par mois), défi du mois, recettes de saison, alertes promo utiles uniquement |
| Palette | **Aubergine & orange** : aubergine `#4A2545`, orange `#EE7A30`, sable `#F6F3EC`, encre `#2A1A28`, pêche `#FCE3D3` |
| Typographie | Nunito (Google Fonts), graisses 400 à 900 |

## Contenu du dossier

| Fichier | Contenu |
|---|---|
| `01_Brief_produit_web_first.md` | Le brief de référence : pourquoi commencer par le web, phasage, stack, périmètre de la première version, back-office, rétention, indicateurs |
| `02_Plan_business.md` | Positionnement, modèle économique, projections de revenus, plan d'action et KPI |
| `03_Plan_developpement.md` | Stack, modèle de données, étapes de développement semaine par semaine, points de vigilance |
| `04_Brief_design.md` | Direction UX/UI, liste des écrans (mobile, web app, back-office), règles d'interface |
| `05_Design_system/` | `tokens.json` (source), `tokens.css` (prêt pour le code), README (règles de marque), aperçus HTML des composants |
| `06_Maquettes/` | Sources des maquettes (format Claude Design `.dc.html`), mobile et web/BO, et l'index du canevas |

## Liens claude.ai (dans ton compte actuel)

- Maquettes (canevas) : https://claude.ai/artifact/AizeR5pYHr4ufFNYTSkajd
- Design system : https://claude.ai/artifact/RQsojK5ugLxpVfx2XahwwC
- Brief web first : https://claude.ai/artifact/AHuQAoDc3S8iWKmnQJ6xSz
- Plan business : https://claude.ai/artifact/V1BbxzrmB8v65UnCEqutf8
- Plan de développement : https://claude.ai/artifact/4T3g4VnFyithTxpCLpH9kK

Ces liens sont privés et liés au compte où ils ont été créés. Un autre compte ne pourra pas les ouvrir sans partage. Pour la suite, ce sont les fichiers de ce dossier qui font foi.

## Pour reprendre dans une nouvelle conversation

Joins ce fichier, `01_Brief_produit_web_first.md`, `04_Brief_design.md` et `05_Design_system/tokens.json`, puis colle par exemple :

> Je reprends le projet décrit dans ces documents (appli de planification de repas avec comparateur de prix entre enseignes). Les décisions sont figées dans 00_LISEZ-MOI.md. Palette Aubergine & orange, design system dans tokens.json. Prochaine étape : [choisir le nom / démarrer le monorepo Next.js + Supabase / écrire le schéma SQL / faire la landing de liste d'attente…].

## Prochaines étapes suggérées

1. Choisir le nom et le domaine, et vérifier l'INPI et les stores.
2. Mesurer la couverture réelle d'Open Prices par enseigne en France. C'est le risque n° 1 du projet.
3. Mettre en ligne une landing page avec liste d'attente pour valider la demande.
4. Démarrer le monorepo avec le schéma Supabase, l'ingestion des prix et le moteur de coût par enseigne.
5. Construire la web app à partir des maquettes et de `tokens.css`.
