# 07 — Écrans, maquettes et routes

Chaque ligne = une maquette de `design/maquettes/` → la route Next.js à créer → ce qu'il ne faut pas rater. Les données de démo (Marion, Auchan, 69003, 4 personnes) sont dans `supabase/seed.sql`.

Légende rendu : **SSG/ISR** (public, SEO) · **SSR** (authentifié, serveur) · **CSR** (îlot client).

## Site public — `apps/web/src/app/(site)/`

| Maquette | Route | Rendu | Points clés |
|---|---|---|---|
| `Main` | `/` | SSG | Hero + ticket de caisse dentelé, comparatif 6 enseignes, « Comment ça marche », FAQ (`FAQPage`), un seul CTA plein. |
| `SiteComparatif` | `/comparatif-prix-supermarches` | ISR 24 h | Tableau réel des 6 totaux (60,10 → 71,60), date, `Dataset`. |
| `SiteRecettes` | `/recettes` | ISR | Filtres (saison, régime, budget/part) en paramètres d'URL indexables avec canonical. |
| `SiteRecette` | `/recettes/[slug]` | ISR | Réponse directe chiffrée, coût par enseigne, `Recipe` + `estimatedCost`, CTA « Ajouter à mon plan ». |
| `SiteMenu` | `/menus/[slug]` | ISR | Menu de la semaine type (ex. « menu-semaine-60-euros-4-personnes »). |
| `SiteEnseigne` | `/enseignes/[id]` | ISR | Position de l'enseigne vs moyenne (−9 %), pastille neutre, **aucun logo**. |
| `SiteVille` | `/prix-courses/[ville]` | ISR | Seulement si ≥ 30 relevés récents, écart local « environ 2 % ». |
| `SiteGuide` | `/guide/[slug]` | SSG | Article pilier, sommaire, `Article`. |
| `SiteMethodo` | `/methodologie` | SSG | Sources, médiane 7 j, fiabilité, aberrants 40 %. |
| `SiteCommentCaMarche` | `/comment-ca-marche` | SSG | `HowTo` en 4 étapes. |
| `SiteTarifs` | `/tarifs` | SSG | Gratuit / Premium (4,99 € · 39,99 €), essai sans carte, FAQ. |
| `SiteLegal` | `/mentions-legales`, `/confidentialite`, `/cgu` | SSG | Une maquette, trois pages. |
| `SiteMerci` | `/merci` | SSG | Après paiement (noindex). |
| `Site404` | `not-found.tsx` | — | Liens vers recettes et comparatif. |
| `MSite` | (responsive de `/`) | — | Version mobile de la landing. |

## Web app — `apps/web/src/app/app/` (authentifiée, `middleware.ts`)

Navigation desktop 8 entrées (`AppShell`) ; mobile : `MTabBar` 5 onglets.

| Maquette desktop | Maquette mobile | Route | Points clés |
|---|---|---|---|
| `AppConnexion` | `MConnexion` | `/connexion` | Lien magique + code 6 chiffres (15 min), Google, Apple (icône générique). |
| `AppOnboarding` | `MOnboarding` | `/app/bienvenue` | 4 étapes : foyer, régime, enseigne + code postal, résultat. Sauvegarde à chaque étape. |
| `AppDashboard` | `MDashboard` | `/app` | Plan de la semaine, total enseigne + meilleure alternative, série, économies. |
| `AppPlan` | `MPlan` | `/app/plan` | 7 jours × 2 repas, verrouiller / remplacer un repas, total en direct (core). |
| `AppRecette` | `MRecette` | `/app/recettes/[slug]` | Parts ajustables, coût par enseigne, bouton mode cuisine. |
| `AppCuisine` | — | `/app/recettes/[slug]/cuisine` | Plein écran, étapes géantes, minuteurs, écran maintenu allumé (Wake Lock). |
| `AppRecettes` | `MRecettes` | `/app/recettes` | Catalogue filtrable, « ajouter au plan ». |
| `AppComparateur` | `MComparateur` | `/app/comparateur` | 6 enseignes triées, fiabilité ●●●, détail produit (Premium), « garder mon enseigne » respecté. |
| `AppListe` | `MListe` | `/app/liste` | Par rayon, cocher (Realtime), « ajouté par Léa », hors ligne, partage, ouvrir le drive. |
| `AppTicket` | `MTicket` | `/app/ticket` | Photo → envoi → statut ; +3 jours Premium. |
| `AppEconomies` | `MEconomies` | `/app/economies` | 58,30 € depuis septembre, histogramme mensuel, série, défis. |
| `AppFamille` | `MFamille` | `/app/famille` | Membres, invitation email, rôles du foyer. |
| `AppNotifs` | `MNotifs` | `/app/notifications` | Groupées par jour, « tout lire », max 2/semaine rappelé. |
| `AppAbonnement` | `MPaywall`, `MProfil` | `/app/profil`, `/app/abonnement` | Stripe Checkout + Portal, état de l'essai, jours bonus. |
| `AppEtats` | — | (composants) | Vides, chargement (skeletons), erreurs, hors ligne, prix inconnu. |
| `AppSombre` | — | (thème) | `data-theme="dark"`, tokens sombres. |

Route publique annexe : `/liste/[token]` (liste partagée en lecture, noindex).

## Back-office — `apps/admin/src/app/`

| Maquette | Route | Rôle minimum | Points clés |
|---|---|---|---|
| `BOVue` | `/` | tous | KPI : utilisateurs actifs, essais → payants, couverture prix, tickets en attente. |
| `BOPrix` | `/prix` | moderateur_prix | File des aberrants (> 40 %), valider / rejeter / corriger, journal. |
| `BOTickets` | `/tickets` | moderateur_prix | Photo + lignes OCR côte à côte, rapprochement produit, attribution du bonus. |
| `BOProduits` | `/produits` | moderateur_prix | Recherche trigram, fusion de doublons, EAN, rayon. |
| `BOEnseignes` | `/enseignes` | admin | Enseignes, magasins, couverture par zone. |
| `BOImports` | `/imports` | moderateur_prix | Historique des imports Open Prices, erreurs, relance. |
| `BORecettes` | `/recettes` | editeur | Éditeur + rapprochement ingrédients → produits, coût calculé en direct (core). |
| `BOSeo` | `/seo` | editeur | Pages, indexation, données sous seuil. |
| `BOEngagement` | `/engagement` | admin | Séries, défis, envois de notifications. |
| `BOUtilisateurs` | `/utilisateurs` | support | Recherche, foyer, abonnement, jours bonus (support : lecture). |
| `BORoles` | `/roles` | admin | Attribution des rôles staff. |
| `BOParametres` | `/parametres` | admin | Seuils (7 j, 30 j, 40 %, 0,85), bonus, textes. |

## Emails — `packages/emails/` (React Email)

| Maquette | Déclencheur |
|---|---|
| `EmailConnexion` | Demande de lien magique (lien + code, 15 min). |
| `EmailBienvenue` | Fin d'onboarding. |
| `EmailJeudi` | Tâche du jeudi 19:00 : menu prêt + comparatif. |
| `EmailRecap` | Récap mensuel des économies. |
| `EmailFinEssai` | J-2 avant la fin de l'essai, sans faux compte à rebours. |
| `EmailRecu` | Webhook Stripe `invoice.paid`. |
| `EmailInvitation` | Invitation dans un foyer. |

## Composants partagés — `packages/ui/`

| Maquette | Composant |
|---|---|
| `Composants` | Boutons, champs, pastilles d'enseigne (`StoreChip`), fiabilité (`Reliability`), `TicketCard` (bord dentelé), `SavingBadge`, onglets, toasts. |
| `Plat` | `<Plat variant="soupe" size={64} />` — 12 variantes SVG. |
| `MTabBar` | `<TabBar active="liste" />` (mobile). |
