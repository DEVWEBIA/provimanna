-- 0004_household_cooking_time.sql — temps de cuisine en semaine (onboarding, étape « Tes préférences »).
-- La maquette AppOnboarding demande ce choix ; aucune colonne ne le stockait. Ajout sans impact sur l'existant.

create type cooking_time as enum ('moins_30', '30_45', 'peu_importe');

alter table households add column cooking_time cooking_time not null default 'peu_importe';

-- Modifiable par les membres du foyer (la RLS « modifier mon foyer » s'applique).
grant update (cooking_time) on households to authenticated;
