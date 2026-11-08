-- 0009_equipment_cuisines.sql — équipement élargi et cuisines du monde (demande du 08/11/2026).
-- Équipement du foyer : gazinière (feux gaz, fréquente à la campagne et outre-mer), micro-ondes,
-- robot cuiseur (Thermomix, Cookeo…). Cuisines préférées du foyer et cuisine de chaque recette.

alter table households drop constraint households_equipment_check;
alter table households add constraint households_equipment_check
  check (equipment <@ '{four,plaques,air_fryer,gaziniere,micro_ondes,robot}'::text[]);

alter table households
  add column cuisines text[] not null default '{}' check (cardinality(cuisines) <= 10);
comment on column households.cuisines is 'Cuisines préférées : francaise, italienne, reunionnaise, iles…';
grant update (cuisines) on households to authenticated;

alter table recipes add column cuisine text not null default 'francaise';
comment on column recipes.cuisine is 'Cuisine de la recette (voir CUISINES dans packages/core)';
