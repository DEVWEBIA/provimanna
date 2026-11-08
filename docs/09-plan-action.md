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

- **07/11 — Lot 1 : migration `0003_privileges.sql`.** Supabase n'accorde plus de droits par défaut aux rôles `anon`/`authenticated` : sans `GRANT` explicites, l'appli ne pouvait rien lire. Les droits sont accordés au plus juste, colonne par colonne pour les écritures sensibles. Cela **ferme une faille réelle** (vérifiée) : avec les anciens droits par défaut, un utilisateur pouvait modifier `profiles.household_id`, rejoindre le foyer d'un autre et lire ses plans et listes. De même, il ne peut plus se déclarer parrainé ni fixer ses jours bonus sur un ticket. Les migrations 0001 et 0002 n'ont pas été modifiées. Le journal d'audit prévu au lot 9 deviendra `0005_audit.sql`.
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

- **07/11 — Hero enrichi et nouveau menu (demande d'Emmanuel).** Entrée animée au chargement (lignes du titre dévoilées, trait orange dessiné sous « Tu choisis. », ticket qui arrive en pivotant puis flotte), deux étiquettes flottantes, barres du comparateur animées. Le fond est désormais un plat coloré (buddha bowl vu de dessus, détouré en cercle) qui sort par la droite et tourne lentement derrière le ticket : le plat est bien visible sans passer devant les éléments principaux. Menu : large et transparent en haut, il se rétracte en pastille de verre au défilement, surligne la section visible, et n'affiche « Créer mon plan » qu'une fois le hero dépassé (un seul bouton plein à l'écran). Panneau déroulant sur mobile. Lighthouse : desktop 100 ; mobile 94-95 (le bol est l'élément le plus lourd à afficher en 4G lente simulée).

- **07/11 — Vrais logos des enseignes, uniquement dans le bandeau (option 2 choisie par Emmanuel).** Comme Planivore : logos officiels dans le bandeau « enseignes comparées », mais en gris (couleur au survol) et avec la mention « Marques et logos © leurs propriétaires respectifs ». Ailleurs, on garde les pastilles neutres. Fichiers issus de Wikimedia Commons (sources dans `src/assets/logos/SOURCES.md`). À retirer immédiatement si une enseigne le demande. Carrefour : aucun fichier réutilisable trouvé, le nom est affiché en lettres grises en attendant.

- **08/11 — Langage visuel de la page d'accueil étendu à tout le produit (demande d'Emmanuel).** Les effets de la home sont devenus des briques partagées de `packages/ui` : `Reveal` (apparition au défilement), `Glow` (halos flous), `Eyebrow` / `SectionHeading` / `PageHeader` (en-têtes avec entrée en cascade), `GlassCard` / `IconTile` (cartes « verre »), `animDelay()`, `inputClasses()` ; les animations sont dans `packages/ui/styles/motion.css`, importé par le site et le back-office. Bouton principal : ombre aubergine et léger soulèvement au survol, partout. Appliqué à `/connexion` (panneau aubergine avec plat qui tourne et ticket flottant, `components/brand/brand-panel.tsx`), au questionnaire (`/commencer`, `/app/bienvenue` : étapes animées, cartes vitrées, récap en ticket), à l'espace client (barre latérale et barre d'onglets en verre, halos, `PageHeader`), au back-office (accueil et connexion d'attente) et à l'email de connexion (maquette `EmailConnexion`, aubergine actuelle, carte ticket à bord dentelé). **Règle pour la suite : chaque nouvel écran (lots 5 à 13) réutilise ces briques.**
- **08/11 — Catalogue de recettes : Claude rédige ~40 recettes automne/hiver** (option recommandée, choisie par Emmanuel), prix de démo marqués comme tels, relecture prévue depuis le BO.

- **08/11 — Lot 5 : migration `0005_recipe_family_tags.sql` (validée par Emmanuel).** Ajoute `recipes.family` (variété : au plus 2 plats de la même famille par semaine, jamais deux le même jour) et `recipes.tags` (`lactose`, `poisson`, `fruits_a_coque`, `epice` pour les préférences du questionnaire ; `enfants`, `batch` pour les filtres de la maquette AppPlan). Le journal d'audit du BO devient **0006**.
- **08/11 — Lot 5 : catalogue de départ (53 recettes, 76 produits).** Écrit dans `supabase/catalogue/generate.mjs`, qui produit `supabase/catalogue.sql` (chargé après `seed.sql`). Les régimes (`diets`) et les marqueurs d'allergènes sont **déduits des ingrédients** (drapeaux des produits), pour ne jamais oublier un allergène. Viandes du catalogue considérées non halal. Prix de **démonstration** (`source = 'manual'`, niveau Lidl × écart moyen de chaque enseigne ± 5 %), signalés dans l'appli par l'encart « Prix de démonstration » tant qu'ils entrent dans les totaux. Vérifié : 14 repas sans relâcher aucune contrainte pour omnivore, végétarien + moins de 30 min, sans gluten + moins de 30 min, végétarien sans lactose, halal peu épicé sans poisson.
- **08/11 — Lot 5 : génération du plan** (`packages/core/src/planner.ts`, 30 tests). Contraintes strictes : régime et exclusions. Puis, dans l'ordre et relâchées seulement si le catalogue ne suffit pas : variété des familles, temps de cuisine en semaine, recette unique dans la semaine. Score : coût par part dans l'enseigne du foyer, saison, voisinage des familles, recettes de la semaine précédente, part d'aléa (injectable). Parts par repas : un enfant = 0,7 part, arrondi à la part supérieure (2 + 2 → 4 parts).
- **08/11 — Lot 5 : règles Gratuit / Premium appliquées côté serveur** (`is_premium`) : « Varier la semaine » et « Remplacer » sont réservés à Premium et à l'essai ; verrouiller et déplacer restent ouverts à tous. Le plan de la semaine est créé automatiquement au premier accès (et dès l'étape 3 du questionnaire pour un compte connecté : « Plan généré · Ta semaine NN est prête », texte de la maquette rétabli).
- **08/11 — Filtres « Enfants » et « Batch cooking »** : appliqués seulement s'ils laissent au moins 7 recettes, sinon ignorés (pour garder une semaine variée).
- **08/11 — Correctif du seed** : l'utilisatrice de démo Marion ne pouvait pas se connecter (colonnes de jetons à NULL dans `auth.users`, GoTrue renvoyait « Database error finding user »). Le test RLS « prix visibles » ne compte plus un nombre fixe de prix.

- **08/11 — Lot 6 : choisir son enseigne = valider la semaine.** « Garder Auchan et voir ma liste », « Basculer ma liste chez Lidl » ou « Garder Auchan » valident la semaine : le serveur fige `total_cents` (enseigne choisie), `reference_cents` (enseigne habituelle, base des économies) et l'enseigne la moins chère. Si un repas change ensuite, ces totaux sont recalculés. La bascule vers une autre enseigne que la sienne est réservée à Premium (contrôle serveur), garder la sienne est toujours possible.
- **08/11 — Lot 6 : migration `0006_liste_validation.sql`** (droits, sans nouvelle colonne). Les totaux du plan et l'enseigne de la liste ne sont plus modifiables par l'utilisateur (faille fermée, testée) : ces écritures passent par un client serveur à clé `service_role` (`lib/supabase/admin.ts`, `server-only`, appartenance vérifiée avant avec la session). « Coché par » / « ajouté par » sont posés par un déclencheur (impossibles à usurper). Seuls les articles ajoutés à la main peuvent être retirés. Temps réel activé sur `shopping_list_items`. Fonction `shared_list(token)` pour la lecture publique d'une liste partagée. Tests RLS : 16 → 26. **Le journal d'audit du BO devient 0007.**
- **08/11 — Lot 6 : liste de courses.** Produits hors placard, arrondis au paquet entier (on n'achète pas 0,3 sachet), prix estimé par paquet. La liste est recalculée côté serveur à chaque ouverture pour suivre le plan, en gardant les cases cochées et les articles ajoutés à la main. Cochage instantané, synchronisé en temps réel avec la famille ; hors connexion, les cases cochées attendent dans une file locale (`localStorage`) et partent au retour du réseau (le service worker viendra au lot 11). Partage par lien `/liste/[token]` : lecture seule, sans compte, `noindex`.
- **08/11 — Lot 6 : formule gratuite** : le comparateur montre les 6 totaux et les 2 premières lignes du détail produit par produit ; les autres lignes ne quittent pas le serveur.
- **08/11 — Reporté (dépend d'autres lots)** : « Léa coche aussi » et invitations (lot 12), « Disponible hors ligne » (lot 11), « Déjà dans tes placards » (pas de suivi des placards pour l'instant), bouton « Exporter », champ d'ajout d'un article (droits et base prêts).

- **08/11 — Ordre des lots : le lot 8 passe avant le lot 7** (accord d'Emmanuel), le paiement attendant un compte Stripe. Le lot 8 est livré en deux commits : 8a recettes, 8b pages SEO.
- **08/11 — Lot 8a : recettes.** Site public `/recettes` (filtres en liens indexables `?filtre=`, canonique sans tri ni pagination, FAQ, fil d'Ariane) et `/recettes/[slug]` (réponse directe chiffrée et datée, tableau des 6 enseignes pour 2 à 8 personnes, ingrédients avec coût, étapes, FAQ générée à partir des données, JSON-LD `Recipe` + `estimatedCost`, `FAQPage`, `BreadcrumbList`, ISR 24 h, recettes sœurs). Les pages publiques lisent la base avec un client anonyme sans cookies (`lib/supabase/public.ts`) pour rester en cache. Espace client : `/app/recettes` (recettes compatibles avec le foyer, recherche par titre et ingrédients, « Ajouter à ma semaine » puis « Les placer dans mon plan » : chaque recette remplace un repas libre en partant de la fin de semaine et est verrouillée, Premium), `/app/recettes/[slug]` (prix dans son enseigne et la moins chère, « Coche ce que tu as déjà », tiroir « Remplacer ce repas » avec 3 propositions moins cher / végé / rapide), mode cuisine `/app/recettes/[slug]/cuisine` (plein écran, Wake Lock, minuteur pour les étapes de 3 min et plus). Segment `/sitemap/recettes.xml` (date = dernier relevé).
- **08/11 — Écarts assumés avec les maquettes** : pas de « Difficulté » ni de favoris (aucune donnée en base) ; « Coche ce que tu as déjà » retire l'ingrédient du coût du repas, pas encore de la liste (texte adapté) ; boutons du mode cuisine en blanc (orange réservé aux économies) ; la quantité des ingrédients reste celle de la recette (4 parts), seul le tableau des prix suit le nombre de personnes.
- **08/11 — Validation des identifiants** : `z.guid()` au lieu de `z.uuid()` dans les actions (Zod 4 refuse les identifiants fixes du catalogue, qui n'ont pas de version UUID).

- **08/11 — Lot 8b : pages SEO.** Toutes les pages de prix reposent sur un **panier type** reproductible (`lib/observatory.ts`) : 14 repas pour 2 adultes + 2 enfants composés par `generatePlan` avec une graine fixe par semaine, identiques pour tous les visiteurs ; totaux par enseigne et par rayon calculés par core (`totalsByGroup`, `percentVsAverage`, `productPriceGaps`). Pages : `/comparatif-prix-supermarches` (classement, indices, rayons, duels, JSON-LD `Dataset`), `/enseignes/[id]` ×6 (classement, écart à la moyenne, rayons, plus gros écarts, recettes les moins chères, pastille neutre sans logo), `/menus/[slug]` ×2 (60 € pour 4, végétarien ; le budget annoncé est vérifié sur les vrais totaux), `/guide/batch-cooking` (coûts calculés en direct, `Article`), `/methodologie` (seuils lus dans core), `/comment-ca-marche` (`HowTo`), `/mentions-legales`, `/confidentialite`, `/cgu` (gabarits avec mentions entre crochets à compléter et à faire valider), page 404 avec recherche, `/prix-courses/[ville]` (publiée seulement à partir de 30 relevés de moins de 7 jours dans la ville : aucune pour l'instant, faute de relevés localisés). Recherche `?q=` sur `/recettes`. Sitemap, `llms.txt` et pied de page complétés. En-tête du site : liens vers les rubriques hors de l'accueil.
- **08/11 — Volontairement laissé de côté dans 8b** : téléchargement CSV des données et mention de licence dans le `Dataset` (licences Open Prices / Open Food Facts à vérifier, point ouvert de CLAUDE.md) ; courbe d'évolution depuis juin (pas d'historique) ; pages « duel » (les duels renvoient vers les pages enseignes) ; carte de l'auteur ou du fondateur (nom à fournir) ; historique de la méthode réduit à la première version (les dates de la maquette étaient fictives) ; section « batch du dimanche » des menus.
- **08/11 — Tests e2e** : délai des vérifications porté à 15 s (le serveur de dev compile chaque page à sa première visite) ; 16 tests desktop + mobile.

- **08/11 — Lot 9a : socle du back-office.** Migration `0007_audit.sql` (principe validé par Emmanuel) : table `audit_log` en ajout seul, lisible par les admins, alimentée uniquement par `log_action()` qui fixe l'auteur et son rôle (`auth.uid()`) et refuse les comptes sans rôle ; fonction `my_staff_role()`. Seed local : `admin@example.com` (rôle admin). Connexion staff par code ou lien (`shouldCreateUser: false`, même réponse que le compte existe ou non), rôle vérifié par chaque page (`lib/staff.ts`, rubriques filtrées par rôle, page « Accès réservé à l'équipe »). Écrans : **Vue d'ensemble** (chiffres réels : foyers actifs, essais, Premium, semaines validées, plans par semaine sur 8 semaines, entonnoir des inscrits, couverture des prix par enseigne, à traiter), **Prix** (file des aberrants avec médiane 30 j, historique 8 semaines, piste, décisions Valider / Rejeter / Promo au clavier ; « tous les prix »), **Rôles et journal**. Les écritures passent par la session du staff (RLS existante) ; la clé serveur ne sert qu'aux agrégats et à retrouver un compte par email. Valider un prix : il sort des aberrants et entre dans la médiane ; rejeter ou promo : il reste masqué et marqué comme traité (`moderated_by`). Tests RLS : 26 → 31 ; e2e back-office (admin, compte refusé).
- **08/11 — Reporté dans le BO** : revenu mensuel et conversion essai → payant réelle (lot 7, Stripe), export CSV et lancement d'import (lot 10), courbe des actifs hebdomadaires « ouverture du plan » (pas de suivi d'ouverture avant PostHog, lot 13).

- **08/11 — Lot 9b : recettes et produits dans le BO.** **Recettes** : liste (état, coût par part, ingrédients à lier), création d'un brouillon, éditeur complet (titre, adresse, temps, parts, famille, illustration, saisons, régimes, marqueurs, ingrédients reliés aux produits avec suggestions par ressemblance des mots, étapes, titre et description SEO avec aperçu et contrôles) ; le **coût par enseigne est recalculé en direct par core** à chaque modification ; enregistrer, publier ou retirer du site est journalisé. **Produits** : recherche (nom, marque, EAN), filtres (sans prix récent, sans ingrédient lié, doublons probables : même nom et même format), fiche avec derniers prix par enseigne et recettes qui l'utilisent, modification, création, **fusion de doublons** (prix, ingrédients, articles de liste et lignes de tickets repointés vers la fiche gardée, avec la clé serveur après contrôle du rôle, journalisée).
- **08/11 — Points à traiter plus tard** : le site public garde ses pages en cache 24 h (ISR), une recette publiée depuis le BO apparaît donc au plus tard le lendemain ; une revalidation à la demande (route protégée du site appelée par le BO) est à ajouter avant la mise en ligne (lot 13). La liste des produits de l'éditeur est chargée en entier (76 fiches) : à paginer ou rechercher côté serveur quand l'import Open Food Facts arrivera (lot 10). Les régimes ne sont plus déduits automatiquement des ingrédients dans le BO (pas de drapeaux allergènes sur les produits en base) : l'éditeur les coche.
- **08/11 — Tests rendus indépendants de la base locale** : le test RLS et l'e2e du BO créent leur propre relevé aberrant (les validations faites pendant les tests vidaient la file).

- **08/11 — Lot 9c : autres rubriques du BO.** **Utilisateurs** (support, lecture : comptes, foyer, enseigne, statut, dernier plan, tickets, fiche avec série, plans, économies calculées par core `savingsCents` — 58,30 € pour Marion —, abonnement en lecture seule ; actions « Offrir 7 jours de Premium » réservée aux admins et « Renvoyer un lien de connexion », journalisées ; export RGPD et suppression au lot 13). **Enseignes** (admin : pastille neutre, magasins, couverture, nom, pastille, lien du drive, active). **Contenu SEO** (pages publiques, checklist des recettes, fichiers pour les robots ; clics Google et visites venues d'une IA au lot 13). **Engagement** (séries, défis activables, rendez-vous et emails prévus aux lots 7 et 11). **Paramètres** (valeurs en vigueur lues dans core ; les rendre modifiables demandera une table de réglages, migration à valider).
- **08/11 — Tickets et Imports du BO** : regroupés avec le lot 10, qui apporte les tickets, l'OCR et l'import Open Prices (sans eux, ces écrans seraient vides).

- **08/11 — Lot 12 : famille, économies, engagement, mode sombre, états.**
  - **Économies** (`/app/economies`) : total réalisé calculé par core (`savingsCents`, plans validés uniquement, jamais d'économie hypothétique), mois par mois, semaine par semaine, série et défis, plats les plus cuisinés, partage du récap. Tableau de bord : cartes série, économies, défi en cours.
  - **Série** : mise à jour par le serveur à chaque validation de semaine (`nextStreak`, core) ; affichée tant que la semaine précédente est validée. **Défis** : progression déduite des données (`challengeProgress`, core), rien de stocké en plus.
  - **Famille** (`/app/famille`) : membres (6 au plus), invitation par lien valable 7 jours (l'envoi par email arrivera avec le lot 11), page `/invitation/[token]` (connexion si besoin, acceptation vérifiée et appliquée par le serveur, lien à usage unique), retrait d'un membre par le titulaire, départ d'un membre : chacun retrouve alors son propre foyer, en formule gratuite. **Parrainage** : lien `/commencer?parrain=CODE`, le parrain est relié au compte à la première ouverture (côté serveur) ; la **récompense reste un point ouvert**, la page n'en promet aucune.
  - **Profil** (`/app/profil`) : foyer et préférences (lien vers le questionnaire), abonnement en lecture seule, notifications (jeudi, promos), apparence, déconnexion.
  - **Mode sombre** de l'espace client : Auto (réglage du téléphone), Clair ou Sombre, choix gardé dans un cookie ; tokens sombres existants + `packages/ui/styles/dark.css` (équivalents sombres des fonds translucides et pastels, textes des cartes de marque). Le site public reste clair.
  - **États** : squelettes de chargement, page d'erreur rassurante avec « Réessayer », bandeau hors ligne, encart « On manque de prix récents chez … » quand l'indice de l'enseigne du foyer n'est pas ●●●.
  - Tests : core 62, 32 tests RLS (invitation hors de son foyer refusée), e2e famille (inviter, rejoindre, lien à usage unique, quitter) et économies / série / thème.
- **08/11 — Écarts avec les maquettes (lot 12)** : droits par membre (« Coche la liste seulement ») non repris, faute de colonne en base (migration à valider si souhaité) ; « 1 joker dispo » de la série non repris (règle des jokers à définir) ; badges de défis non visuels pour l'instant.

- **08/11 — Logos des enseignes en couleur (demande d'Emmanuel).** Bandeau de la landing en couleur (filtre gris retiré), vrais logos dans l'espace client (questionnaire, panneau « Ce plan coûte… », comparateur) et dans le back-office (enseignes, couverture des prix, file des prix). Vignette blanche (token `raw-blanc`) pour rester lisible en mode sombre. Les pages éditoriales publiques gardent les pastilles neutres (à étendre si souhaité). Rappel : usage des marques à retirer immédiatement si une enseigne le demande ; logo Carrefour toujours à fournir. `CLAUDE.md` mis à jour.

- **08/11 — Vraies photos de plats (demande d'Emmanuel).** 47 recettes sur 53 ont une photo Unsplash (licence gratuite vérifiée sur la page de chaque photo, pas d'Unsplash+), recadrée en carré 900 px, choisie puis contrôlée à l'œil sur planche contact. Même traitement que le bol de l'accueil (assiette ronde, anneau blanc, ombre). Composant `components/recipes/recipe-photo.tsx` (repli automatique sur l'illustration `<Plat>`), utilisé sur l'accueil, la grille du plan, les cartes recettes (site et appli), les fiches, le mode cuisine, les économies et les menus. Liste et crédits : `supabase/catalogue/photos.json`, `apps/web/public/recettes/CREDITS.md`, script `apps/web/scripts/recipe-photos.mjs`. **Sans photo pour l'instant** (images écartées : plat non conforme, marque ou bouteille visible) : chou sauté, colin purée, gratin de butternut, saucisses aux lentilles, spaghetti épinards-tomate, tarte aux poireaux. Photos provisoires : à remplacer à terme par de vraies photos des recettes du catalogue.

- **08/11 — 12 enseignes et logos (demande d'Emmanuel).** Ajout de Netto, Super U, Grand Frais, Picard, Franprix et Monoprix ; logo Carrefour récupéré sur fr.wikipedia. Liste unique dans `packages/core/src/stores.ts` (`STORE_IDS`, `STORES_INFO`, `MAIN_STORE_IDS`, `STORE_COUNT`), plus aucune liste en dur dans le web ni le BO. **Assortiments partiels** (choix d'Emmanuel) : `planCostInStore` calcule la couverture ; sous 90 % (`DEFAULTS.minCoverage`) le total est `partial`, rangé après les enseignes complètes, jamais « le moins cher » (`rankStoreTotals`, `completeTotals`) ; Picard et Grand Frais ne sont pas proposés comme enseigne habituelle et ne peuvent pas recevoir la liste. Prix de démonstration : Picard vend surgelés, viandes et poissons, quelques légumes ; Grand Frais tout sauf les surgelés et la moitié de l'épicerie. Logos ajoutés partout dans l'espace client (tableau de bord, plan, liste, recette, économies, profil) et dans le BO (produits, prix, utilisateurs, éditeur de recette). Pages publiques : classements et écarts calculés sur les enseignes complètes ; page `/enseignes/picard` sans classement, avec la couverture du panier. Ticket du hero : 6 lignes des maquettes + « 6 autres enseignes ». Super U et Carrefour : fichiers fr.wikipedia au statut « marque déposée » (pas de licence libre), même cadre que la décision sur les logos.

## Questions ouvertes (à trancher par vous)

1. ~~Liste d'attente ou inscription directe ?~~ → inscription directe (07/11). Une liste d'attente peut s'ajouter plus tard si besoin.
2. ~~Logo Carrefour~~ → récupéré sur fr.wikipedia (08/11).

## Avancement

- [x] Lot 0 — Monorepo (Next.js 16, Tailwind 3.4 pour garder le preset JS tel quel, next-intl sans segment de locale, polices via next/font)
- [x] Lot 1 — Supabase (Postgres 17, ports 553xx, migration `0003_privileges.sql`, 16 tests RLS pgTAP : `pnpm db:test`)
- [x] Lot 2 — Design system (19 composants dans `packages/ui`, 16 tests de rendu, catalogue `/dev/ui` clair + sombre, script de captures `apps/web/scripts/screenshots.mjs`)
- [x] Lot 3 — Landing et socle SEO (Lighthouse mobile 100/100/100/100, desktop 100/100/96/100 : les 4 points = préchargement des pages du lot 8 pas encore créées)
- [x] Lot 4 — Connexion et onboarding (lien magique + code 6 chiffres, onboarding 4 étapes, 6 tests Playwright desktop + mobile : `pnpm --filter @repas/web test:e2e`)
- [x] Harmonisation visuelle (08/11) — effets de la home sur connexion, questionnaire, espace client, BO, email
- [x] Lot 5 — Génération du plan (53 recettes, `generatePlan` + 30 tests, tableau de bord et plan desktop/mobile, 8 tests e2e)
- [x] Lot 6 — Comparateur et liste (validation de la semaine côté serveur, liste temps réel + file hors ligne, partage par lien, 26 tests RLS, 10 e2e)
- [ ] Lot 7 — Paiement
- [x] Lot 8 — Recettes et pages SEO (8a recettes, 8b observatoire, enseignes, menus, guide, méthodologie, légal, 404 ; 56 tests core, 16 e2e)
- [x] Lot 9 — Back-office (connexion staff, journal d'audit 0007, vue d'ensemble, prix, produits, recettes, utilisateurs, enseignes, SEO, engagement, rôles, paramètres ; Tickets et Imports avec le lot 10)
- [ ] Lot 10 — Tickets et prix
- [ ] Lot 11 — Emails, notifications, PWA
- [x] Lot 12 — Famille, économies, mode sombre (invitations par lien, parrainage relié, série et défis, profil, thème auto/clair/sombre, états)
- [ ] Lot 13 — Qualité et mise en ligne
