# 11 — Déploiement sur Vercel

> Décision du 10/11/2026 : **deux projets Vercel** branchés sur le même dépôt `DEVWEBIA/provimanna`, le back-office sur **son propre sous-domaine** (cookies séparés du site public, aucun changement de code). Pas de `vercel.json` « services » à la racine : aucune des deux applis n'appelle l'autre (elles parlent chacune à Supabase).

| Projet Vercel | Root Directory | Domaine (à choisir) | Config |
|---|---|---|---|
| web (site public + appli) | `apps/web` | `mondomaine.fr` | `apps/web/vercel.json` |
| admin (back-office) | `apps/admin` | `admin.mondomaine.fr` | `apps/admin/vercel.json` |

Les deux `vercel.json` fixent : framework Next.js, région **`cdg1` (Paris)** pour rester près d'une base Supabase en UE, et `ignoreCommand` avec `turbo-ignore` (un commit qui ne touche ni l'appli ni ses paquets `@repas/*` ne relance pas son build).

## Prérequis : la base Supabase de production

**Le site public ne se construit pas sans base accessible** : l'observatoire, les recettes, les enseignes et les menus sont générés au build (ISR) à partir du catalogue. Le back-office, lui, se construit sans base (mais ne fonctionne pas sans).

1. Créer un projet Supabase en **région UE** (Paris ou Francfort).
2. Appliquer le schéma et le catalogue : `supabase link --project-ref <ref>` puis `supabase db push`, puis charger `supabase/catalogue.sql` (pas `seed.sql` : il contient les comptes de démo).
3. Auth › URL Configuration : Site URL = `https://mondomaine.fr` ; Redirect URLs = `https://mondomaine.fr/auth/callback**` et `https://admin.mondomaine.fr/auth/callback**`.
4. Auth › Email Templates : coller `supabase/templates/magic_link.html` dans les modèles « Magic Link » et « Confirm signup » (lien + code à 6 chiffres).
5. Edge Functions : `supabase functions deploy ocr-receipt import-open-prices`, puis `supabase secrets set ANTHROPIC_API_KEY=…` si la lecture des tickets doit être réelle.

## Créer les projets Vercel

Pour chacun des deux projets : *Add New › Project* → importer `DEVWEBIA/provimanna` → **Root Directory** `apps/web` (ou `apps/admin`) → Vercel détecte pnpm et le monorepo (installation à la racine, `packageManager: pnpm@9.15.0`, Node ≥ 22.18 d'après `engines`). Ne rien changer aux commandes de build.

## Variables d'environnement

À saisir dans *Settings › Environment Variables* de **chaque** projet (Production, et Preview si besoin).

| Variable | web | admin | Valeur |
|---|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | ✓ | ✓ | `[Nom de l'appli]` tant que le nom n'est pas choisi |
| `NEXT_PUBLIC_SITE_URL` | ✓ | ✓ | `https://mondomaine.fr` (liens du BO vers le site, emails) |
| `NEXT_PUBLIC_ADMIN_URL` | — | ✓ | `https://admin.mondomaine.fr` (lien de connexion staff) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✓ | ✓ | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✓ | ✓ | clé `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ | ✓ | clé `service_role` — **serveur uniquement**, jamais en `NEXT_PUBLIC_` |

Les autres variables de `.env.example` (Stripe, Resend, PostHog, Sentry, VAPID) arriveront avec les lots 7, 11 et 13.

## Après le premier déploiement

- Brancher les domaines (*Settings › Domains*) et mettre à jour `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_ADMIN_URL` si les URL `*.vercel.app` ont servi d'abord (les URL d'aperçu doivent aussi figurer dans les Redirect URLs de Supabase pour que la connexion y marche).
- Donner le rôle staff au premier compte (le BO ne crée aucun compte) : le compte se crée sur le site, puis dans l'éditeur SQL Supabase `insert into roles (user_id, role) values ('<uuid du compte>', 'admin');`.
- Lot 13 : cron de l'import Open Prices (pg_cron + pg_net), revalidation des pages publiques depuis le BO, PostHog, Sentry.
