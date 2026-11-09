-- 0010 — Import Open Prices (lot 10, validé par le propriétaire le 09/11/2026).
-- Données Open Prices sous licence ODbL 1.0 : créditer « © Open Food Facts contributors ».

-- Catégorie Open Food Facts d'un produit en vrac (ex. « en:pumpkins ») : rattache les prix sans code-barres.
alter table products add column off_category text;
-- Poids d'une unité de vente en kg (« pièce ≈ 1,2 kg » → 1.2) : convertit un prix au kilo en prix de l'unité.
alter table products add column unit_kg numeric(6, 3) check (unit_kg > 0);
create index products_off_category on products (off_category) where off_category is not null;

-- Identifiant du prix chez sa source (ex. « op:361454 ») : un prix n'est jamais importé deux fois.
alter table prices add column external_id text unique;

-- Historique des imports (écran Imports du back-office). Écrit uniquement par l'Edge Function (clé serveur).
create table import_runs (
  id bigint generated always as identity primary key,
  source text not null default 'open_prices',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  -- Prix créés chez la source à partir de cette date (import incrémental).
  since timestamptz,
  fetched int not null default 0,      -- prix lus chez la source
  imported int not null default 0,     -- prix ajoutés
  unmatched int not null default 0,    -- produit ou enseigne non reconnus
  aberrant int not null default 0,     -- ajoutés mais signalés (écart > 40 % avec la médiane)
  skipped int not null default 0,      -- hors France, autre devise, déjà importés, promos
  error text,
  triggered_by uuid references auth.users(id)
);
create index import_runs_started on import_runs (started_at desc);

alter table import_runs enable row level security;
create policy "lecture modération" on import_runs for select using (has_role('moderateur_prix'));
grant select on import_runs to authenticated;
