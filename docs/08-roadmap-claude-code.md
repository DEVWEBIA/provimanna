# 08 — Feuille de route pour Claude Code (lot par lot)

Mode d'emploi : un lot = une session (ou deux). Copie le prompt du lot dans Claude Code, laisse-le proposer un plan, valide, puis laisse-le coder. **Termine chaque lot par un commit** et coche la case. Ne passe au lot suivant que si `pnpm typecheck && pnpm lint && pnpm test` passe.

Astuce : commence chaque session par « Lis CLAUDE.md puis docs/08-roadmap-claude-code.md, on attaque le lot N. »

---

## Lot 0 — Monorepo  ☑

```
Lis CLAUDE.md. Crée le monorepo Turborepo + pnpm à partir des fichiers racine déjà présents
(package.json, pnpm-workspace.yaml, turbo.json) :
- apps/web : Next.js 15 App Router, TypeScript strict, Tailwind avec design/tailwind-preset.ts,
  design/tokens.css importé dans globals.css, polices Bricolage Grotesque + Nunito via next/font.
- apps/admin : même base, port 3001.
- packages/core : existe déjà (ne réécris pas pricing.ts) ; ajoute Vitest en gardant les tests node:test fonctionnels.
- packages/ui : vide pour l'instant, exporté en TS source.
- ESLint (next + typescript-eslint strict), Prettier, scripts typecheck/lint/test dans chaque paquet.
Vérifie que `pnpm dev` démarre les deux apps et que `pnpm test` exécute les tests de core.
```

## Lot 1 — Supabase  ☑

```
Lis supabase/migrations/*.sql et supabase/seed.sql (déjà validés sur Postgres).
1. `supabase init` sans écraser config.toml ni les migrations, puis `supabase start && supabase db reset`.
2. Génère les types (`pnpm db:types`) et crée dans apps/web et apps/admin les clients Supabase
   (@supabase/ssr) : serveur, navigateur, middleware de session.
3. Écris des tests RLS (script SQL ou Vitest) : un utilisateur ne voit pas le foyer d'un autre,
   ne peut pas écrire dans subscriptions, ne voit pas les prix aberrants.
Ne modifie pas le schéma sans me le proposer d'abord.
```

## Lot 2 — Design system (packages/ui)  ☑

```
Ouvre design/maquettes/Composants.dc.html, Plat.dc.html, MTabBar.dc.html et Main.dc.html (classe .edge).
Crée dans packages/ui, en React + Tailwind (preset), avec les textes exacts :
Button (plein/contour/texte, un seul plein par écran), Field, StoreChip (2 lettres + nom, pastel neutre,
jamais de logo), Reliability (●●● ●●○ ●○○ + libellé accessible), Price (tabular-nums, préfixe ≈ si estimation,
utilise formatEuro de @repas/core), SavingBadge (orange + texte encre), TicketCard (bord dentelé),
Plat (12 variantes SVG, prop variant + size), TabBar, AppShell (nav 8 entrées), Toast, Skeleton, EmptyState.
Ajoute une page /dev/ui dans apps/web (désactivée en production) qui les montre tous, clair et sombre.
```

## Lot 3 — Landing et socle SEO  ☑

```
Reproduis design/maquettes/Main.dc.html sur la route / (et MSite pour le mobile), en Server Components.
Puis mets en place le socle de docs/06-seo-geo.md : generateMetadata, JSON-LD (Organization, WebSite,
SoftwareApplication, FAQPage), opengraph-image, robots.ts, sitemap.ts segmenté, public/llms.txt.
Objectif Lighthouse ≥ 95 partout sur mobile. Donne-moi le score à la fin.
```

## Lot 4 — Connexion et onboarding  ☑

```
Maquettes : AppConnexion, MConnexion, AppOnboarding, MOnboarding.
- /connexion : lien magique + code OTP 6 chiffres (Supabase Auth), Google, Apple. Validation Zod.
- middleware : /app/* exige une session ; sans foyer complété → /app/bienvenue.
- /app/bienvenue : 4 étapes, sauvegarde à chaque étape (Server Actions), retour arrière sans perte.
Test Playwright : nouvel utilisateur → lien magique (Inbucket local) → onboarding → /app.
```

## Lot 5 — Génération du plan  ☐

```
Lis docs/05 §1 « Génération du plan ». Dans packages/core, ajoute planner.ts : fonction pure
generatePlan(household, recipes, priceContext, options) → 14 repas, respectant régime, exclusions,
saison, variété, verrouillages ; seed aléatoire injectable pour des tests déterministes.
Tests exhaustifs (Vitest). Puis branche-la : Server Action « générer / régénérer un repas »,
écrans AppDashboard, MDashboard, AppPlan, MPlan. Tout total affiché vient de @repas/core.
```

## Lot 6 — Comparateur et liste  ☐

```
Maquettes : AppComparateur, MComparateur, AppListe, MListe.
- Comparateur : compareStores() de core, 6 enseignes triées, fiabilité, date ; détail produit réservé
  Premium (contrôle serveur via is_premium). « Garder mon enseigne » enregistre le choix sans insister.
- Liste : regroupée par rayon, cochage optimiste + Supabase Realtime, « ajouté par / coché par »,
  partage /liste/[token] (lecture seule, noindex), fonctionne hors ligne (on traitera la PWA au lot 11,
  prévois juste la file d'actions locale).
```

## Lot 7 — Paiement  ☐

```
Maquettes : MPaywall, AppAbonnement, SiteTarifs, SiteMerci, EmailRecu.
Stripe Checkout (mensuel 4,99 €, annuel 39,99 €), Customer Portal, webhook /api/stripe/webhook
(signature vérifiée, idempotent) qui seul écrit dans subscriptions via service_role.
L'essai de 14 jours sans carte existe déjà (trigger). Gère : fin d'essai → gratuit, jours bonus,
annulation en fin de période. Tests du webhook avec des payloads Stripe fixtures.
```

## Lot 8 — Recettes et pages SEO programmatiques  ☐

```
Maquettes : AppRecettes, AppRecette, AppCuisine, MRecettes, MRecette, SiteRecettes, SiteRecette,
SiteMenu, SiteEnseigne, SiteVille, SiteComparatif, SiteGuide, SiteMethodo, SiteCommentCaMarche, SiteLegal, Site404.
Pages publiques en ISR (revalidate 86400) avec JSON-LD de docs/06. Seuil : pas de page ville
sous 30 relevés récents (renvoie notFound()). Mode cuisine : Wake Lock, minuteurs, grandes cibles.
```

## Lot 9 — Back-office  ☐

```
apps/admin. Maquettes BO*. Auth staff via la table roles (has_role), garde par rôle sur chaque route
(cf. docs/07). Commence par BOVue, BOPrix, BOTickets, BORecettes (coût en direct via core),
puis le reste. Journalise chaque action de modération (ajoute une migration 0004_audit.sql, propose-la d'abord).
```

## Lot 10 — Tickets de caisse et prix  ☐

```
Maquettes : AppTicket, MTicket, BOTickets, BOImports.
- Upload vers Storage receipts/{uid}/, Edge Function ocr-receipt (fournisseur derrière une interface,
  .env OCR_PROVIDER), rapprochement lignes → produits, seuil 0,85, file de modération, bonus +3 jours.
- Edge Function import-open-prices (cron quotidien) : import incrémental, détection aberrants (isAberrant de core).
Respecte les règles anti-doublon de docs/05.
```

## Lot 11 — Emails, notifications, tâche du jeudi, PWA  ☐

```
Maquettes Email*, AppNotifs, MNotifs.
- packages/emails avec React Email, envoi via Resend.
- Cron jeudi 19:00 Europe/Paris : génère le plan suivant, email EmailJeudi, notification « Ton menu est prêt ».
- Plafond 2 notifications/semaine (hors actions famille), préférences dans Profil.
- PWA : manifest, service worker (liste hors ligne + synchro), web push (VAPID).
```

## Lot 12 — Famille, économies, engagement, mode sombre  ☐

```
Maquettes AppFamille, MFamille, AppEconomies, MEconomies, BOEngagement, AppSombre, AppEtats.
Invitations (7 jours), Realtime, calcul des économies selon docs/05 (reference_cents − total_cents,
plans validés uniquement — 58,30 € sur les données de seed), séries, défis, thème sombre complet,
tous les états vides/erreurs/hors ligne.
```

## Lot 13 — Qualité et mise en ligne  ☐

```
- Playwright : parcours complet onboarding → plan → comparateur → liste → paiement (Stripe test).
- Accessibilité : axe sur toutes les pages, navigation clavier, prefers-reduced-motion.
- PostHog (événements : onboarding_done, plan_generated, store_switched, list_shared, receipt_sent,
  trial_started, subscribed), Sentry front + Edge Functions.
- RGPD : bannière de consentement (PostHog seulement après accord), export et suppression du compte.
- Déploiement : Vercel (web, admin), Supabase projet de prod (région UE), variables d'environnement, domaine.
Donne-moi la checklist de mise en ligne restante.
```

---

## Phase 3 — Mobile (Expo)

Les maquettes `M*` servent de référence. Réutiliser `@repas/core` tel quel, porter les tokens vers un thème React Native, RevenueCat pour les achats intégrés, scan code-barres et ticket natif. À démarrer après la bêta web.
