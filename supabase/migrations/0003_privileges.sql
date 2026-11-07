-- 0003_privileges.sql — privilèges explicites des rôles de l'API (anon, authenticated, service_role).
--
-- Pourquoi : les versions récentes de Supabase n'accordent plus SELECT/INSERT/UPDATE/DELETE par défaut
-- aux rôles anon et authenticated sur les tables créées dans public. Sans ces GRANT, la RLS n'est même
-- pas évaluée : tout appel renvoie « permission denied ». On accorde donc le strict nécessaire.
--
-- Principe : la RLS (0002) décide QUELLES LIGNES ; ces GRANT décident QUELLES OPÉRATIONS et QUELLES
-- COLONNES. Les écritures sensibles passent par le service_role (webhook Stripe, Edge Functions,
-- Server Actions d'acceptation d'invitation), jamais côté client.

-- ─── On repart de zéro sur public ──────────────────────────────────────────
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- service_role : accès complet (contourne déjà la RLS ; utilisé uniquement côté serveur).
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant usage on schema public to anon, authenticated, service_role;

-- ─── Visiteurs (site public SEO) : référentiels en lecture ─────────────────
grant select on stores, store_locations, aisles, products, prices, recipes, recipe_ingredients,
  challenges, current_prices to anon;

-- ─── Utilisateurs connectés ────────────────────────────────────────────────
-- Référentiels : lecture pour tous ; écriture réservée au staff par la RLS (has_role).
grant select on stores, store_locations, aisles, products, prices, recipes, recipe_ingredients,
  challenges, current_prices to authenticated;
grant insert, update, delete on stores, store_locations, products, recipes, recipe_ingredients,
  challenges to authenticated;
-- Modération des prix (RLS : moderateur_prix) : seulement ces colonnes.
grant update (cents, flagged_aberrant, moderated_by) on prices to authenticated;

-- Foyer : l'onboarding modifie ces champs (RLS : son propre foyer).
grant select on households to authenticated;
grant update (name, adults, children, diet, exclusions, postal_code, preferred_store_id, meals_per_week)
  on households to authenticated;

-- Profil : seulement les préférences. household_id, is_household_owner, referred_by et referral_code
-- ne sont pas modifiables côté client (sinon on pourrait rejoindre le foyer d'un autre ou se déclarer parrainé).
grant select on profiles to authenticated;
grant update (display_name, notify_thursday, notify_promos) on profiles to authenticated;

-- Invitations : créer et annuler ; l'acceptation passe par le serveur (service_role).
grant select, delete on household_invites to authenticated;
grant insert (household_id, email, invited_by) on household_invites to authenticated;

-- Rôles staff : lecture de son rôle ; gestion par un admin (RLS).
grant select, insert, update, delete on roles to authenticated;

-- Plans et listes du foyer.
grant select, insert, update, delete on meal_plans, meal_plan_items, shopping_lists, shopping_list_items
  to authenticated;

-- Tickets : l'utilisateur envoie (sans pouvoir fixer statut, bonus ni relecteur) ; la modération met à jour.
grant select on receipts, receipt_lines to authenticated;
grant insert (id, user_id, store_id, location_id, photo_path, purchased_at, total_cents) on receipts to authenticated;
grant update (store_id, location_id, purchased_at, total_cents, status, ocr_confidence, reward_days, reviewed_by)
  on receipts to authenticated;
grant update (cents, product_id, match_confidence, decision) on receipt_lines to authenticated;

-- Engagement et abonnement : lecture seule (écrits par le serveur).
grant select on streaks, user_challenges, subscriptions to authenticated;

-- Notifications : lire et marquer comme lues.
grant select on notifications to authenticated;
grant update (read_at) on notifications to authenticated;

-- ─── Tables futures ────────────────────────────────────────────────────────
-- Aucun droit implicite pour anon/authenticated : chaque nouvelle migration accorde explicitement les siens.
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
