-- 0007_audit.sql — journal d'audit du back-office (lot 9, principe validé par Emmanuel le 08/11/2026).
-- Chaque action de modération ou d'administration est journalisée : qui, quoi, sur quelle ligne, quand.
-- L'auteur est fixé par la base (auth.uid()), jamais par l'appelant. Le journal est en ajout seul.

create table audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_role staff_role,
  action text not null,                      -- 'prix.valider', 'prix.rejeter', 'recette.publier', 'role.attribuer'…
  entity text not null,                      -- 'prices', 'recipes', 'roles'…
  entity_id text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index audit_log_created on audit_log (created_at desc);
create index audit_log_entity on audit_log (entity, entity_id);

alter table audit_log enable row level security;
create policy "admin lit le journal" on audit_log for select using (has_role('admin'));
-- Aucune policy d'écriture : on n'écrit que par log_action() (ou le serveur en service_role).
grant select on audit_log to authenticated;

-- Rôle staff de l'utilisateur connecté (null s'il n'en a pas).
create or replace function my_staff_role() returns staff_role
language sql stable security definer set search_path = public as $$
  select role from roles where user_id = auth.uid()
$$;
grant execute on function my_staff_role() to authenticated;

-- Journalise une action faite par un membre du staff. Refuse si l'appelant n'a aucun rôle.
create or replace function log_action(p_action text, p_entity text, p_entity_id text, p_details jsonb default '{}')
returns void
language plpgsql security definer set search_path = public as $$
declare r staff_role;
begin
  select role into r from roles where user_id = auth.uid();
  if r is null then
    raise exception 'réservé au staff' using errcode = '42501';
  end if;
  insert into audit_log (actor_id, actor_role, action, entity, entity_id, details)
  values (auth.uid(), r, p_action, p_entity, p_entity_id, coalesce(p_details, '{}'));
end $$;
revoke all on function log_action(text, text, text, jsonb) from public;
grant execute on function log_action(text, text, text, jsonb) to authenticated;
