-- 0008_household_planning_prefs.sql — questionnaire enrichi (validé le 08/11/2026).
-- Nouvelles réponses du foyer : jours et repas à prévoir, budget, styles, équipement, ingrédients
-- évités, motivations. Équipement nécessaire côté recettes. Les valeurs par défaut reproduisent le
-- comportement d'avant (7 jours, midi et soir, four et plaques, sans budget) : aucun foyer ne change.

alter table households
  add column meal_days smallint[] not null default '{1,2,3,4,5,6,7}'
    check (cardinality(meal_days) between 1 and 7 and meal_days <@ '{1,2,3,4,5,6,7}'::smallint[]),
  add column with_lunch boolean not null default true,
  add column weekly_budget_cents int check (weekly_budget_cents between 1000 and 50000),
  add column styles text[] not null default '{}' check (cardinality(styles) <= 3),
  add column equipment text[] not null default '{four,plaques}'
    check (equipment <@ '{four,plaques,air_fryer}'::text[]),
  add column disliked_product_ids uuid[] not null default '{}' check (cardinality(disliked_product_ids) <= 60),
  add column motivations text[] not null default '{}' check (cardinality(motivations) <= 5);

comment on column households.meal_days is 'Jours planifiés (1 = lundi … 7 = dimanche)';
comment on column households.with_lunch is 'Midi + soir (true) ou soir seulement (false)';
comment on column households.weekly_budget_cents is 'Budget courses par semaine, en centimes (null = pas de budget)';
comment on column households.styles is 'Styles de repas (3 au plus) : equilibre, rapide, gourmand, famille, monde, vegetal';
comment on column households.equipment is 'Équipement de cuisine : four, plaques, air_fryer';
comment on column households.disliked_product_ids is 'Produits que le foyer n’aime pas (évités dans le plan)';
comment on column households.motivations is 'Ce qui a amené le foyer (stats du back-office)';

-- Modifiables par les membres du foyer (la RLS « modifier mon foyer » s'applique).
grant update (meal_days, with_lunch, weekly_budget_cents, styles, equipment, disliked_product_ids, motivations)
  on households to authenticated;

-- Équipement nécessaire à une recette. La cuisson au four d'une recette marquée 'air_fryer'
-- (tags) peut se faire au air fryer.
alter table recipes add column equipment text[] not null default '{plaques}'
  check (equipment <@ '{four,plaques}'::text[]);
comment on column recipes.equipment is 'Équipement nécessaire : four, plaques';
