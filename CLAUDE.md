# Appli Repas — contexte projet pour Claude Code

> Lis ce fichier en entier avant toute tâche. Les décisions ci-dessous sont **figées** : ne les remets pas en cause sans qu'on te le demande.

## Le produit en une phrase

Une web app (PWA) qui génère le **plan de repas de la semaine** d'un foyer et montre **combien coûte la liste de courses dans 6 enseignes** (Lidl, Aldi, E.Leclerc, Intermarché, Carrefour, Auchan). L'utilisateur reste **libre de garder son enseigne**, même plus chère. Nom définitif pas encore choisi : utilise `[Nom de l'appli]` / la constante `APP_NAME`.

## Décisions figées

| Sujet | Décision |
|---|---|
| Ordre | Web app + back-office d'abord. Mobile natif (Expo) en phase 3, même backend. |
| Monorepo | Turborepo + pnpm. `apps/web` (site public SEO + web app), `apps/admin` (back-office), `packages/core` (moteur de prix, types), `packages/ui` (tokens + composants). |
| Front | Next.js (App Router), TypeScript strict, Tailwind CSS avec le preset de `design/tailwind-preset.ts`. |
| Backend | Supabase : Postgres, Auth (lien magique email + Google + Apple), RLS, Storage (photos de tickets), Edge Functions (import Open Prices, OCR, cron du jeudi). |
| Paiement | Stripe Billing (Checkout + Customer Portal). Essai Premium 14 jours **sans carte**, puis gratuit à vie. Premium 4,99 €/mois ou 39,99 €/an. |
| Prix | API Open Prices + fiches Open Food Facts + tickets scannés. **Pas de scraping des drives.** |
| Emails | Resend (ou Brevo) + React Email. |
| Suivi | PostHog (produit), Sentry (erreurs). |
| i18n | `next-intl` dès le départ (fr-FR seul au début ; BE/CH/CA plus tard). |

## Gratuit vs Premium

- **Gratuit** : 1 plan / semaine, prix détaillés dans son enseigne, totaux des 5 autres, liste partageable.
- **Premium** : détail produit par produit, bascule de la liste vers une autre enseigne, plans illimités, alertes promo, partage famille temps réel.

## Structure cible

```
apps/
  web/        Next.js — site public (SSG/ISR, SEO) + web app (/app/*, authentifiée)
  admin/      Next.js — back-office (rôles : admin, moderateur_prix, editeur, support)
packages/
  core/       moteur de prix (déjà écrit et testé, voir packages/core)
  ui/         tokens + composants partagés
  emails/     modèles React Email (lot 11)
supabase/
  migrations/ schéma SQL + RLS (déjà écrits et validés sur Postgres)
  seed.sql    données d'exemple cohérentes avec les maquettes
design/
  maquettes/  sources des 67 écrans (.dc.html) — LA référence visuelle
  tokens.css, tokens.json, tailwind-preset.ts
docs/         brief, plan d'action, SEO/GEO, écrans → routes, roadmap
```

## Maquettes : comment les utiliser

- Toutes les maquettes sont dans `design/maquettes/*.dc.html`. Index et correspondance écran → route : `docs/07-ecrans-et-routes.md`.
- Format : HTML avec styles inline + un bloc `<script type="text/x-dc">` (classe `Component`, méthode `renderVals()`) qui contient les **données d'exemple et la logique d'interaction**. `{{x}}` = valeur calculée, `<sc-for>` = boucle, `<sc-if>` = condition, `<dc-import name="Plat">` = composant enfant.
- Ces fichiers ne s'ouvrent pas seuls dans un navigateur (runtime manquant). Lis-les comme une spec : structure, textes exacts, couleurs, tailles, espacements, états.
- Reproduis-les en composants React + Tailwind avec les tokens. Garde **les textes à l'identique** (tutoiement, ton positif).
- `design/maquettes/Plat.dc.html` contient les 12 illustrations SVG de plats : convertis-les en un composant `<Plat variant="curry" size={96} />`.
- Rendu visuel : canevas Claude Design du propriétaire (lien dans `README.md`).

## Règles de design (non négociables)

- Couleurs uniquement via tokens. Aubergine `#6B3868` = marque/actions (éclaircie le 07/11/2026 à la demande du propriétaire ; ancienne valeur `#4A2545`, encore présente dans les maquettes). **Orange `#EE7A30` réservé aux économies, toujours avec texte foncé `#2A1A28`** (jamais de blanc sur orange). Sable `#F6F3EC` = fond.
- Polices : Bricolage Grotesque (titres site + grands chiffres), Nunito (interface). Chiffres de prix en `tabular-nums`.
- **Enseignes : pastille neutre 2 lettres sur fond pastel + nom en clair, jamais de couleur officielle.** Seule exception (décision du propriétaire, 07/11/2026) : les vrais logos, en gris, dans le bandeau « enseignes comparées » de la landing, avec la mention « Marques et logos © leurs propriétaires respectifs » (sources : `apps/web/src/assets/logos/SOURCES.md`). Nulle part ailleurs.
- Signature : carte « ticket de caisse » à bord dentelé (radial-gradient), voir `Main.dc.html` classe `.edge`.
- Un seul bouton plein par écran. Cibles tactiles ≥ 44 px. Contraste AA. `prefers-reduced-motion` respecté.
- Toujours afficher la date des prix et l'indice de fiabilité (●●● / ●●○ / ●○○). Les estimations sont préfixées par `≈`.
- Ton : tutoiement, jamais culpabilisant, pas de faux compte à rebours.

## Règles de code

- TypeScript strict, pas de `any`. Zod pour valider les entrées (API, formulaires, webhooks).
- Server Components par défaut ; `"use client"` seulement pour l'interactivité.
- Montants en **centimes (integer)** en base et dans `packages/core` ; formatage `fr-FR` uniquement à l'affichage (`formatEuro()` dans core).
- Toute logique de prix passe par `packages/core` (jamais recalculée dans un composant).
- RLS activée sur toutes les tables ; jamais de clé `service_role` côté client.
- Accessibilité : vrais `<button>`, `<a href>`, `<label>` ; `aria-*` sur les contrôles custom.
- Tests : Vitest pour `core` et la logique ; Playwright pour les parcours critiques (onboarding → plan → liste → paiement).
- Commits courts en français, à l'impératif (« Ajoute le comparateur mobile »).

## SEO / GEO (site public)

Voir `docs/06-seo-geo.md`. Points clés : SSG/ISR, metadata API, JSON-LD par type de page (`Recipe`, `FAQPage`, `Dataset`, `SoftwareApplication`), `sitemap.xml` segmenté, `llms.txt`, chaque page commence par **une réponse directe chiffrée et datée**.

## Commandes (une fois le monorepo créé)

```bash
pnpm install
pnpm dev                 # web + admin
pnpm --filter @repas/core test  # tests du moteur de prix
supabase start && supabase db reset   # schéma + seed en local (API sur :55321, Studio :55323, mails :55324)
pnpm db:test             # tests RLS (pgTAP)
pnpm db:types            # régénère packages/core/src/database.types.ts
```

En attendant le monorepo, le moteur de prix se teste seul : `node --test packages/core/src/*.test.ts` (Node ≥ 22.18).

## Comment travailler

0. **Nouvelle conversation : lis d'abord `docs/10-reprise.md`** (état courant, décisions, pièges, prochaine étape), puis le journal de `docs/09-plan-action.md`.
1. Suis `docs/08-roadmap-claude-code.md`, lot par lot. Ne saute pas de lot.
2. Avant de coder un écran, ouvre sa maquette et liste ce que tu vas reproduire.
3. Termine chaque tâche par : typecheck, lint, tests, et une phrase sur ce qui reste.
4. Si une décision produit manque, pose la question au lieu d'inventer.

## Points ouverts (ne pas trancher seul)

- Nom de l'appli, domaine, logo.
- Récompense de parrainage (proposition actuelle : 1 mois offert par ami abonné).
- Mention TVA des factures (micro-entreprise : « TVA non applicable, art. 293 B du CGI » à confirmer).
- Licences exactes Open Prices / Open Food Facts à vérifier avant de republier des données.
