-- Tests RLS (pgTAP) — `supabase test db` (ou `pnpm db:test`).
-- Marion = utilisatrice du seed. Bob = second foyer créé ici. Tout est annulé en fin de transaction.
begin;
create extension if not exists pgtap with schema extensions;
select plan(31);

-- ─── Préparation (superutilisateur) ─────────────────────────────────────────
insert into auth.users (instance_id, id, aud, role, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000009b0', 'authenticated',
        'authenticated', 'bob@example.com', now(), '{"name":"Bob"}', now(), now());

select set_config('test.marion', '00000000-0000-0000-0000-000000000301', true);
select set_config('test.bob', '00000000-0000-0000-0000-0000000009b0', true);
select set_config('test.bob_household',
  (select household_id::text from profiles where id = '00000000-0000-0000-0000-0000000009b0'), true);

insert into meal_plans (household_id, week_start, store_id, total_cents, reference_cents)
values (current_setting('test.bob_household')::uuid, '2026-11-09', 'lidl', 6010, 7160);

insert into prices (product_id, store_id, cents, observed_at, source, flagged_aberrant)
values ('00000000-0000-0000-0000-000000000107', 'lidl', 999, now(), 'ticket', true);

-- Liste de Marion (créée par le serveur) avec un article issu du plan.
with l as (
  insert into shopping_lists (meal_plan_id, store_id)
  select p.id, 'auchan' from meal_plans p join profiles pr on pr.household_id = p.household_id
  where pr.id = '00000000-0000-0000-0000-000000000301' order by p.week_start desc limit 1
  on conflict (meal_plan_id) do update set store_id = 'auchan'
  returning id, share_token)
select set_config('test.list', (select id::text from l), true), set_config('test.share', (select share_token from l), true);
delete from shopping_list_items where list_id = current_setting('test.list')::uuid;
insert into shopping_list_items (list_id, product_id, label, quantity_label, aisle_id, est_cents)
values (current_setting('test.list')::uuid, '00000000-0000-0000-0000-000000000101', 'Potimarron', 'pièce', 'fruits_legumes', 249);

-- ─── En tant que Marion ─────────────────────────────────────────────────────
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.marion'), 'role', 'authenticated')::text, true);

select is((select count(*)::int from households), 1, 'Marion ne voit que son propre foyer');
select is((select count(*)::int from households where id = current_setting('test.bob_household')::uuid), 0,
  'Marion ne voit pas le foyer de Bob');
select is((select count(*)::int from meal_plans where household_id = current_setting('test.bob_household')::uuid), 0,
  'Marion ne voit pas les plans de Bob');
select is((select count(*)::int from meal_plans), 6, 'Marion voit ses 6 plans du seed');
select is((select count(*)::int from profiles where id = current_setting('test.bob')::uuid), 0,
  'Marion ne voit pas le profil de Bob');

select throws_ok(
  $$ insert into subscriptions (household_id, tier) values (gen_random_uuid(), 'premium') $$,
  '42501', null, 'Marion ne peut pas créer d''abonnement');
select throws_ok(
  $$ update subscriptions set tier = 'premium', bonus_days = 999 $$,
  '42501', null, 'Marion ne peut pas se passer Premium ni s''offrir des jours bonus');

select is((select count(*)::int from prices where flagged_aberrant), 0, 'Les prix aberrants sont masqués');
-- Relevé aberrant créé pour le test (à 9,99 €) : masqué ; les relevés normaux restent visibles.
select is((select count(*)::int from prices where cents = 999 and product_id = '00000000-0000-0000-0000-000000000107'), 0,
  'Les prix normaux sont visibles, pas le relevé aberrant');

select throws_ok(
  $$ insert into roles (user_id, role) values (current_setting('test.marion')::uuid, 'admin') $$,
  '42501', null, 'Marion ne peut pas s''attribuer un rôle staff');

select lives_ok(
  $$ update profiles set display_name = 'Marion' where id = current_setting('test.marion')::uuid $$,
  'Marion peut modifier son nom affiché');
select throws_ok(
  $$ update profiles set household_id = current_setting('test.bob_household')::uuid
     where id = current_setting('test.marion')::uuid $$,
  '42501', null, 'Marion ne peut pas rejoindre le foyer de Bob en modifiant son profil');
select throws_ok(
  $$ update profiles set referred_by = current_setting('test.bob')::uuid
     where id = current_setting('test.marion')::uuid $$,
  '42501', null, 'Marion ne peut pas se déclarer parrainée');

-- Lot 6 : totaux du plan et enseigne de la liste fixés par le serveur, traces « coché par ».
select throws_ok($$ update meal_plans set total_cents = 1 $$, '42501', null,
  'Marion ne peut pas fixer elle-même les totaux de son plan');
select throws_ok(
  $$ insert into meal_plans (household_id, week_start, store_id, reference_cents)
     values (my_household_id(), '2030-01-07', 'lidl', 99999) $$,
  '42501', null, 'Marion ne peut pas créer un plan avec un total de référence');
select throws_ok($$ update shopping_lists set store_id = 'lidl' $$, '42501', null,
  'Marion ne peut pas basculer sa liste sans passer par le serveur');
select lives_ok($$ update shopping_list_items set checked = true where list_id = current_setting('test.list')::uuid $$,
  'Marion coche un article de sa liste');
select is((select checked_by::text from shopping_list_items where list_id = current_setting('test.list')::uuid),
  current_setting('test.marion'), '« Coché par » est renseigné par la base');
select lives_ok($$ insert into shopping_list_items (list_id, label) values (current_setting('test.list')::uuid, 'Bougies') $$,
  'Marion ajoute un article à la main');
select is((select added_by::text || manual::text from shopping_list_items where label = 'Bougies'),
  current_setting('test.marion') || 'true', '« Ajouté par » est renseigné par la base');
select lives_ok($$ delete from shopping_list_items where list_id = current_setting('test.list')::uuid $$,
  'Marion vide sa liste');
select is((select count(*)::int from shopping_list_items where list_id = current_setting('test.list')::uuid), 1,
  'Seuls les articles ajoutés à la main sont retirés (ceux du plan restent)');

-- Lot 9 : journal d'audit réservé au staff.
select throws_ok($$ select log_action('prix.valider', 'prices', '1') $$, '42501', null,
  'Marion (sans rôle staff) ne peut pas écrire dans le journal');
select is((select count(*)::int from audit_log), 0, 'Marion ne lit pas le journal');
select throws_ok($$ insert into audit_log (action, entity, entity_id) values ('x', 'y', 'z') $$, '42501', null,
  'Personne n''écrit directement dans le journal');

-- ─── En tant qu'admin (seed) ────────────────────────────────────────────────
select set_config('request.jwt.claims', json_build_object('sub', '00000000-0000-0000-0000-000000000401', 'role', 'authenticated')::text, true);
select lives_ok($$ select log_action('prix.valider', 'prices', '42', '{"motif":"test"}') $$, 'L''admin journalise une action');
select is((select actor_id::text || '/' || actor_role::text from audit_log where entity_id = '42'),
  '00000000-0000-0000-0000-000000000401/admin', 'L''auteur et son rôle sont fixés par la base');

-- ─── En tant que Bob ────────────────────────────────────────────────────────
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.bob'), 'role', 'authenticated')::text, true);
select is((select count(*)::int from meal_plans), 1, 'Bob ne voit que son plan');

-- ─── En visiteur anonyme (site public) ──────────────────────────────────────
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from recipes where slug = 'veloute-potimarron'), 1, 'Le site voit les recettes publiées');
select throws_ok($$ select * from households $$, '42501', null, 'Un visiteur n''a aucun accès aux foyers');
select is(shared_list(current_setting('test.share'))->>'store', 'Auchan', 'Une liste partagée se lit sans compte, par son lien');

select * from finish();
rollback;
