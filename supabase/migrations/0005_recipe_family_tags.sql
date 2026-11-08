-- 0005_recipe_family_tags.sql — famille de plat et marqueurs des recettes (lot 5, validé le 08/11/2026).
-- family : sert à varier la semaine (pas deux soupes le même jour, au plus 2 par semaine…).
-- tags   : marqueurs utilisés par la génération du plan et les filtres :
--   'lactose', 'poisson', 'fruits_a_coque', 'epice' (préférences du questionnaire) ;
--   'enfants', 'batch' (filtres de la maquette AppPlan).
-- Le gluten, le porc, le halal et le végétarien restent portés par recipes.diets.
alter table recipes add column family text not null default 'autre';
alter table recipes add column tags text[] not null default '{}';

comment on column recipes.family is 'Famille de plat (soupe, pates, curry…) pour la variété du plan';
comment on column recipes.tags is 'Marqueurs : lactose, poisson, fruits_a_coque, epice, enfants, batch';
