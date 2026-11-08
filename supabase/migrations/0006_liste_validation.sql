-- 0006_liste_validation.sql — lot 6 : choix d'enseigne, liste de courses partagée.
-- Aucune table ni colonne nouvelle : droits, déclencheurs, temps réel et lecture publique d'une liste partagée.

-- ─── 1. Totaux du plan : écrits uniquement par le serveur ─────────────────────
-- total_cents / reference_cents servent au calcul des économies (docs/05) : un utilisateur ne doit pas
-- pouvoir les fixer lui-même. Le choix d'enseigne (et donc la validation) passe par le serveur (service_role).
revoke insert, update on meal_plans from authenticated;
grant insert (household_id, week_start, store_id) on meal_plans to authenticated;

-- ─── 2. Listes : créées et recalculées par le serveur ─────────────────────────
-- L'utilisateur coche, ajoute un article à la main et le retire ; l'enseigne de la liste
-- (bascule = Premium) et les prix estimés sont fixés par le serveur.
revoke insert, update, delete on shopping_lists from authenticated;
revoke insert, update, delete on shopping_list_items from authenticated;
grant insert (list_id, label, quantity_label, aisle_id, manual) on shopping_list_items to authenticated;
grant update (checked) on shopping_list_items to authenticated;
grant delete on shopping_list_items to authenticated;

-- « ajouté par Léa » / « coché par Léa » : renseignés par la base, impossibles à usurper.
create or replace function shopping_item_stamp() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.added_by := coalesce(auth.uid(), new.added_by);
    new.manual := coalesce(auth.uid() is not null, false) or new.manual;
  elsif new.checked is distinct from old.checked then
    new.checked_by := case when new.checked then coalesce(auth.uid(), new.checked_by) else null end;
  end if;
  new.updated_at := now();
  return new;
end $$;

create trigger shopping_item_stamp before insert or update on shopping_list_items
  for each row execute function shopping_item_stamp();

-- Seuls les articles ajoutés à la main peuvent être retirés par l'utilisateur (le reste suit le plan).
drop policy if exists "articles du foyer" on shopping_list_items;
create policy "articles du foyer : lecture" on shopping_list_items for select using (
  exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
          where l.id = list_id and p.household_id = my_household_id()));
create policy "articles du foyer : ajout" on shopping_list_items for insert with check (
  exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
          where l.id = list_id and p.household_id = my_household_id()));
create policy "articles du foyer : cochage" on shopping_list_items for update using (
  exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
          where l.id = list_id and p.household_id = my_household_id()));
create policy "articles du foyer : retrait" on shopping_list_items for delete using (
  manual and exists (select 1 from shopping_lists l join meal_plans p on p.id = l.meal_plan_id
                     where l.id = list_id and p.household_id = my_household_id()));

-- ─── 3. Temps réel : la famille voit les cases se cocher ──────────────────────
alter publication supabase_realtime add table shopping_list_items;

-- ─── 4. Liste partagée par lien (/liste/[token]) : lecture seule, sans compte ──
create or replace function shared_list(share text) returns json
language sql stable security definer set search_path = public as $$
  select json_build_object(
    'store', s.name,
    'week_start', p.week_start,
    'items', coalesce((
      select json_agg(json_build_object(
               'label', i.label, 'quantity', i.quantity_label, 'checked', i.checked,
               'aisle', coalesce(a.label, 'Divers'), 'position', coalesce(a.position, 99))
             order by coalesce(a.position, 99), i.label)
      from shopping_list_items i left join aisles a on a.id = i.aisle_id
      where i.list_id = l.id), '[]'::json))
  from shopping_lists l
  join meal_plans p on p.id = l.meal_plan_id
  join stores s on s.id = l.store_id
  where l.share_token = share and length(share) >= 32
$$;
revoke all on function shared_list(text) from public;
grant execute on function shared_list(text) to anon, authenticated;
