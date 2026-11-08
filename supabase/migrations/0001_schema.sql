-- 0001_schema.sql — schéma initial Appli Repas
-- Montants en CENTIMES (integer). Dates en timestamptz. Identifiants uuid sauf référentiels (text).

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ─── Référentiels ──────────────────────────────────────────────────────────

create type diet as enum ('omnivore', 'sans_porc', 'vegetarien', 'vegan', 'halal', 'sans_gluten');
create type price_source as enum ('open_prices', 'ticket', 'manual');
create type plan_tier as enum ('free', 'trial', 'premium');
create type staff_role as enum ('admin', 'moderateur_prix', 'editeur', 'support');
create type meal_slot as enum ('dejeuner', 'diner');
create type receipt_status as enum ('en_attente', 'en_revue', 'valide', 'rejete');
create type line_decision as enum ('auto', 'accepte', 'corrige', 'ignore');

create table stores (
  id text primary key,                       -- 'lidl', 'super-u', 'picard'… (liste : packages/core/src/stores.ts)
  name text not null,                        -- 'E.Leclerc'
  initials char(2) not null,                 -- 'EL' (pastille neutre, jamais de logo)
  country char(2) not null default 'FR',
  drive_url text,                            -- lien d'ouverture du drive (pas de scraping)
  active boolean not null default true
);

create table store_locations (
  id uuid primary key default gen_random_uuid(),
  store_id text not null references stores(id),
  label text not null,
  postal_code text not null,
  city text not null,
  lat double precision,
  lng double precision,
  osm_id text unique
);
create index on store_locations (postal_code);

create table aisles (
  id text primary key,                       -- 'fruits_legumes', 'cremerie'…
  label text not null,
  position int not null
);

create table products (
  id uuid primary key default gen_random_uuid(),
  ean text unique,                           -- null pour un produit générique (vrac)
  name text not null,
  brand text,
  quantity_label text,                       -- '500 g', '1 L'
  aisle_id text references aisles(id),
  off_synced_at timestamptz,
  created_at timestamptz not null default now()
);
create index products_name_trgm on products using gin (name gin_trgm_ops);

create table prices (
  id bigint generated always as identity primary key,
  product_id uuid not null references products(id) on delete cascade,
  store_id text not null references stores(id),
  location_id uuid references store_locations(id),
  cents int not null check (cents > 0),
  observed_at timestamptz not null,
  source price_source not null,
  receipt_id uuid,                           -- fk ajoutée plus bas
  flagged_aberrant boolean not null default false,
  moderated_by uuid,
  created_at timestamptz not null default now()
);
create index prices_lookup on prices (product_id, store_id, observed_at desc);
create index prices_flagged on prices (flagged_aberrant) where flagged_aberrant;

-- ─── Utilisateurs et foyers ────────────────────────────────────────────────

create table households (
  id uuid primary key default gen_random_uuid(),
  name text,
  adults smallint not null default 2 check (adults between 1 and 8),
  children smallint not null default 0 check (children between 0 and 8),
  diet diet not null default 'omnivore',
  exclusions text[] not null default '{}',   -- ingrédients à éviter
  postal_code text,
  preferred_store_id text references stores(id),
  meals_per_week smallint not null default 14,
  created_at timestamptz not null default now()
);

-- Profil applicatif, 1–1 avec auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  household_id uuid references households(id) on delete set null,
  display_name text,
  is_household_owner boolean not null default true,
  notify_thursday boolean not null default true,
  notify_promos boolean not null default true,
  referral_code text unique default substr(md5(gen_random_uuid()::text), 1, 8),
  referred_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  email text not null,
  invited_by uuid not null references profiles(id),
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  accepted_at timestamptz,
  expires_at timestamptz not null default now() + interval '7 days'
);

create table roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role staff_role not null,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now()
);

-- ─── Recettes ──────────────────────────────────────────────────────────────

create table recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  servings smallint not null default 4,
  prep_minutes smallint,
  cook_minutes smallint,
  diets diet[] not null default '{omnivore}',
  season_months smallint[] not null default '{1,2,3,4,5,6,7,8,9,10,11,12}',
  illustration text,                         -- variante du composant <Plat> : 'soupe', 'curry'…
  steps jsonb not null default '[]',         -- [{ "text": "...", "minutes": 10 }]
  published boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  label text not null,                       -- '1 potimarron (≈ 1,2 kg)'
  product_id uuid references products(id),   -- correspondance vers un produit vendu
  units numeric(8,3) not null,               -- en unités de vente (cf. packages/core)
  pantry boolean not null default false,
  position smallint not null default 0
);
create index on recipe_ingredients (recipe_id);

-- ─── Plans, listes ─────────────────────────────────────────────────────────

create table meal_plans (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  week_start date not null,                  -- lundi
  store_id text not null references stores(id), -- enseigne choisie pour cette semaine
  total_cents int,                           -- coût dans l'enseigne choisie, figé à la validation
  reference_cents int,                       -- coût dans l'enseigne habituelle du foyer (base des économies)
  cheapest_store_id text references stores(id),
  cheapest_cents int,
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (household_id, week_start)
);

create table meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references meal_plans(id) on delete cascade,
  day smallint not null check (day between 1 and 7),
  slot meal_slot not null,
  recipe_id uuid not null references recipes(id),
  servings smallint not null,
  locked boolean not null default false,
  unique (meal_plan_id, day, slot)
);

create table shopping_lists (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null unique references meal_plans(id) on delete cascade,
  store_id text not null references stores(id),
  share_token text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now()
);

create table shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references shopping_lists(id) on delete cascade,
  product_id uuid references products(id),
  label text not null,
  quantity_label text,
  aisle_id text references aisles(id),
  est_cents int,
  checked boolean not null default false,
  checked_by uuid references profiles(id),
  added_by uuid references profiles(id),      -- « ajouté par Léa »
  manual boolean not null default false,
  updated_at timestamptz not null default now()
);
create index on shopping_list_items (list_id);

-- ─── Tickets de caisse ─────────────────────────────────────────────────────

create table receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  store_id text references stores(id),
  location_id uuid references store_locations(id),
  photo_path text not null,                  -- Storage : receipts/{user_id}/{id}.jpg
  purchased_at date,
  total_cents int,
  status receipt_status not null default 'en_attente',
  ocr_confidence real,
  reward_days smallint not null default 0,
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
create index on receipts (status, created_at);

alter table prices add constraint prices_receipt_fk foreign key (receipt_id) references receipts(id) on delete set null;

create table receipt_lines (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references receipts(id) on delete cascade,
  raw_text text not null,
  cents int,
  product_id uuid references products(id),
  match_confidence real,
  decision line_decision not null default 'auto'
);

-- ─── Engagement ────────────────────────────────────────────────────────────

create table streaks (
  household_id uuid primary key references households(id) on delete cascade,
  current_weeks int not null default 0,
  best_weeks int not null default 0,
  last_validated_week date
);

create table challenges (
  id text primary key,                       -- 'sous_70_3_sur_4'
  title text not null,
  description text not null,
  target int not null,
  window_weeks int not null,
  active boolean not null default true
);

create table user_challenges (
  household_id uuid not null references households(id) on delete cascade,
  challenge_id text not null references challenges(id),
  progress int not null default 0,
  started_at date not null default current_date,
  completed_at timestamptz,
  primary key (household_id, challenge_id, started_at)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null,                        -- 'menu_pret', 'promo', 'liste', 'ticket', 'serie', 'defi'
  title text not null,
  body text not null,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index on notifications (user_id, created_at desc);

-- ─── Abonnements (miroir Stripe, écrit uniquement par le webhook) ──────────

create table subscriptions (
  household_id uuid primary key references households(id) on delete cascade,
  tier plan_tier not null default 'trial',
  trial_ends_at timestamptz default now() + interval '14 days',
  bonus_days int not null default 0,         -- jours offerts (tickets, parrainage)
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  interval text check (interval in ('month', 'year')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ─── Helpers ───────────────────────────────────────────────────────────────

create or replace function my_household_id() returns uuid
language sql stable security definer set search_path = public as $$
  select household_id from profiles where id = auth.uid()
$$;

create or replace function has_role(r staff_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from roles where user_id = auth.uid() and (role = r or role = 'admin'))
$$;

create or replace function is_premium(h uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from subscriptions s where s.household_id = h and (
      (s.tier = 'premium' and coalesce(s.current_period_end, now()) >= now())
      or (s.tier = 'trial' and s.trial_ends_at + make_interval(days => s.bonus_days) >= now())
    )
  )
$$;

-- Création automatique du profil, du foyer et de l'essai à l'inscription
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare h uuid;
begin
  insert into households default values returning id into h;
  insert into profiles (id, household_id, display_name)
    values (new.id, h, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  insert into subscriptions (household_id) values (h);
  insert into streaks (household_id) values (h);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- Vue « prix courant » : médiane des 7 derniers jours (le calcul de référence reste packages/core)
create or replace view current_prices as
select product_id, store_id,
       percentile_cont(0.5) within group (order by cents)::int as median_cents,
       max(observed_at) as last_observed_at,
       count(*) as n
from prices
where observed_at >= now() - interval '7 days' and not flagged_aberrant
group by product_id, store_id;
