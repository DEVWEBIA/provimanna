-- 0002_rls.sql — Row Level Security : activée partout, rien d'ouvert par défaut.
-- Le service_role (Edge Functions, webhook Stripe, imports) contourne la RLS : jamais côté client.

alter table stores               enable row level security;
alter table store_locations      enable row level security;
alter table aisles               enable row level security;
alter table products             enable row level security;
alter table prices               enable row level security;
alter table households           enable row level security;
alter table profiles             enable row level security;
alter table household_invites    enable row level security;
alter table roles                enable row level security;
alter table recipes              enable row level security;
alter table recipe_ingredients   enable row level security;
alter table meal_plans           enable row level security;
alter table meal_plan_items      enable row level security;
alter table shopping_lists       enable row level security;
alter table shopping_list_items  enable row level security;
alter table receipts             enable row level security;
alter table receipt_lines        enable row level security;
alter table streaks              enable row level security;
alter table challenges           enable row level security;
alter table user_challenges      enable row level security;
alter table notifications        enable row level security;
alter table subscriptions        enable row level security;

-- ─── Référentiels publics en lecture (site SEO), écriture staff ────────────
create policy "lecture publique" on stores            for select using (true);
create policy "lecture publique" on store_locations   for select using (true);
create policy "lecture publique" on aisles            for select using (true);
create policy "lecture publique" on products          for select using (true);
create policy "lecture publique" on prices            for select using (not flagged_aberrant or has_role('moderateur_prix'));
create policy "lecture publique" on challenges        for select using (true);
create policy "recettes publiées" on recipes          for select using (published or has_role('editeur'));
create policy "ingrédients publiés" on recipe_ingredients for select using (
  exists (select 1 from recipes r where r.id = recipe_id and (r.published or has_role('editeur'))));

create policy "staff écrit" on stores        for all using (has_role('admin')) with check (has_role('admin'));
create policy "staff écrit" on store_locations for all using (has_role('admin')) with check (has_role('admin'));
create policy "staff écrit" on products      for all using (has_role('moderateur_prix')) with check (has_role('moderateur_prix'));
create policy "modération"  on prices        for update using (has_role('moderateur_prix'));
create policy "édition"     on recipes       for all using (has_role('editeur')) with check (has_role('editeur'));
create policy "édition ingrédients" on recipe_ingredients for all using (has_role('editeur')) with check (has_role('editeur'));
create policy "admin"       on challenges    for all using (has_role('admin')) with check (has_role('admin'));
create policy "admin seul"  on roles         for all using (has_role('admin')) with check (has_role('admin'));
create policy "je vois mon rôle" on roles    for select using (user_id = auth.uid());

-- ─── Foyer : chaque membre voit et modifie son foyer ───────────────────────
create policy "mon foyer" on households for select using (id = my_household_id() or has_role('support'));
create policy "modifier mon foyer" on households for update using (id = my_household_id());

create policy "mon profil" on profiles for select using (
  id = auth.uid() or household_id = my_household_id() or has_role('support'));
create policy "modifier mon profil" on profiles for update using (id = auth.uid())
  with check (id = auth.uid());

create policy "invitations du foyer" on household_invites for all
  using (household_id = my_household_id()) with check (household_id = my_household_id());

-- ─── Plans et listes : périmètre foyer ─────────────────────────────────────
create policy "plans du foyer" on meal_plans for all
  using (household_id = my_household_id()) with check (household_id = my_household_id());

create policy "repas du foyer" on meal_plan_items for all using (
  exists (select 1 from meal_plans p where p.id = meal_plan_id and p.household_id = my_household_id()))
  with check (
  exists (select 1 from meal_plans p where p.id = meal_plan_id and p.household_id = my_household_id()));

create policy "listes du foyer" on shopping_lists for all using (
  exists (select 1 from meal_plans p where p.id = meal_plan_id and p.household_id = my_household_id()))
  with check (
  exists (select 1 from meal_plans p where p.id = meal_plan_id and p.household_id = my_household_id()));

create policy "articles du foyer" on shopping_list_items for all using (
  exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
          where l.id = list_id and p.household_id = my_household_id()))
  with check (
  exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
          where l.id = list_id and p.household_id = my_household_id()));
-- La liste partagée par lien (share_token) est servie par une route serveur, pas par la RLS.

-- ─── Tickets : l'auteur, plus la modération ────────────────────────────────
create policy "mes tickets" on receipts for select using (user_id = auth.uid() or has_role('moderateur_prix'));
create policy "envoyer un ticket" on receipts for insert with check (user_id = auth.uid() and status = 'en_attente');
create policy "modérer" on receipts for update using (has_role('moderateur_prix'));

create policy "lignes de mes tickets" on receipt_lines for select using (
  exists (select 1 from receipts r where r.id = receipt_id and (r.user_id = auth.uid() or has_role('moderateur_prix'))));
create policy "modérer les lignes" on receipt_lines for update using (has_role('moderateur_prix'));

-- ─── Engagement, notifications, abonnement : lecture seule côté client ─────
create policy "ma série"   on streaks          for select using (household_id = my_household_id());
create policy "mes défis"  on user_challenges  for select using (household_id = my_household_id());
create policy "mes notifs" on notifications    for select using (user_id = auth.uid());
create policy "lire mes notifs" on notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mon abonnement" on subscriptions for select using (household_id = my_household_id() or has_role('support'));
-- Aucune policy insert/update sur subscriptions : seul le webhook Stripe (service_role) écrit.

-- ─── Storage : photos de tickets privées ───────────────────────────────────
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false) on conflict do nothing;

create policy "déposer mes tickets" on storage.objects for insert to authenticated
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voir mes tickets" on storage.objects for select to authenticated
  using (bucket_id = 'receipts' and ((storage.foldername(name))[1] = auth.uid()::text or has_role('moderateur_prix')));
