-- Tests RLS (pgTAP) — `supabase test db` (ou `pnpm db:test`).
-- Marion = utilisatrice du seed. Bob = second foyer créé ici. Tout est annulé en fin de transaction.
begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

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
-- Feta chez Lidl : un relevé normal (2,25 €) et un aberrant (3,29 €) → seul le normal est visible.
select is((select array_agg(cents) from prices where product_id = '00000000-0000-0000-0000-000000000107' and store_id = 'lidl'),
  array[225], 'Les prix normaux sont visibles');

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

-- ─── En tant que Bob ────────────────────────────────────────────────────────
select set_config('request.jwt.claims', json_build_object('sub', current_setting('test.bob'), 'role', 'authenticated')::text, true);
select is((select count(*)::int from meal_plans), 1, 'Bob ne voit que son plan');

-- ─── En visiteur anonyme (site public) ──────────────────────────────────────
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select is((select count(*)::int from recipes where slug = 'veloute-potimarron'), 1, 'Le site voit les recettes publiées');
select throws_ok($$ select * from households $$, '42501', null, 'Un visiteur n''a aucun accès aux foyers');

select * from finish();
rollback;
