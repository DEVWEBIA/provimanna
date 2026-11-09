import type { Metadata } from 'next';
import { cx, glassClasses, PageHeader } from '@repas/ui';
import { requireRole, ROLE_LABEL, type StaffRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';
import { GrantRoleForm, RevokeButton } from './role-forms';

export const metadata: Metadata = { title: 'Rôles et journal' };
export const dynamic = 'force-dynamic';

const ACTION_LABEL: Record<string, string> = {
  'prix.valider': 'a validé un prix',
  'prix.rejeter': 'a rejeté un prix',
  'prix.promo': 'a marqué un prix comme promo',
  'role.attribuer': 'a attribué un rôle',
  'role.retirer': 'a retiré un rôle',
};

/** Rôles staff et journal d'audit (maquette BORoles). Réservé aux administrateurs. */
export default async function RolesPage() {
  const { supabase, user } = await requireRole(['admin']);
  const [{ data: roles }, { data: log }, users] = await Promise.all([
    supabase.from('roles').select('user_id, role, granted_at').order('granted_at'),
    supabase
      .from('audit_log')
      .select('id, actor_id, actor_role, action, entity, entity_id, details, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
    createAdminClient().auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const email = (id: string | null) => users.data.users.find((u) => u.id === id)?.email ?? 'compte supprimé';

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Rôles et journal"
        lead="Chaque action de modération est enregistrée : qui, quoi, quand."
      />
      <section className={cx(glassClasses, 'p-6')} aria-labelledby="equipe">
        <h2 id="equipe" className="font-display text-[22px] font-extrabold">
          Équipe
        </h2>
        <table className="mt-4 w-full text-[15px]">
          <thead>
            <tr className="text-ink-muted text-left text-[12px] font-black tracking-[1px]">
              <th scope="col" className="pb-2">
                COMPTE
              </th>
              <th scope="col" className="pb-2">
                RÔLE
              </th>
              <th scope="col" className="pb-2">
                DEPUIS
              </th>
              <th scope="col" className="pb-2">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {(roles ?? []).map((r) => (
              <tr key={r.user_id} className="border-line border-t">
                <td className="py-2.5 font-extrabold">{email(r.user_id)}</td>
                <td className="py-2.5">
                  <span className="rounded-pill bg-brand-soft text-brand px-2.5 py-0.5 text-[13px] font-black">
                    {ROLE_LABEL[r.role as StaffRole]}
                  </span>
                </td>
                <td className="text-ink-muted py-2.5">
                  {new Date(r.granted_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="py-2.5 text-right">
                  {r.user_id !== user.id ? (
                    <RevokeButton userId={r.user_id} label={email(r.user_id)} />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-line mt-6 border-t pt-5">
          <GrantRoleForm />
        </div>
      </section>
      <section className={cx(glassClasses, 'p-6')} aria-labelledby="journal">
        <h2 id="journal" className="font-display text-[22px] font-extrabold">
          Journal
        </h2>
        {log?.length ? (
          <ol className="mt-4">
            {log.map((l) => (
              <li
                key={l.id}
                className="border-line flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t py-2.5 text-[14px]"
              >
                <time className="text-ink-muted w-[150px] tabular-nums" dateTime={l.created_at}>
                  {new Date(l.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </time>
                <span className="font-extrabold">{email(l.actor_id)}</span>
                <span>{ACTION_LABEL[l.action] ?? l.action}</span>
                <span className="text-ink-muted">
                  {l.entity} #{l.entity_id}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-ink-muted mt-3 font-bold">Aucune action pour l’instant.</p>
        )}
      </section>
    </>
  );
}
