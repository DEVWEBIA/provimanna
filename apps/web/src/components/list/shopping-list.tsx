'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatEuro, sumCents } from '@repas/core';
import { animDelay, cx, Price, Toast } from '@repas/ui';
import { createClient } from '@/lib/supabase/client';

export interface ListItemView {
  id: string;
  label: string;
  quantity: string | null;
  aisleId: string | null;
  cents: number | null;
  checked: boolean;
  checkedBy: string | null;
  addedBy: string | null;
  manual: boolean;
}

export interface AisleView {
  id: string;
  label: string;
  position: number;
}

export interface ShoppingListProps {
  listId: string;
  items: ListItemView[];
  aisles: AisleView[];
  /** Utilisateur connecté, et prénoms des membres du foyer (« coché par Léa »). */
  me: string;
  names: Record<string, string>;
  /** Total de la même liste dans l'enseigne la moins chère, si ce n'est pas celle-ci. */
  cheaper: { name: string; cents: number } | null;
  /** Encart de droite (ticket de caisse…), rendu par le serveur. */
  aside?: React.ReactNode;
}

type Pending = Record<string, boolean>;
const queueKey = (listId: string) => `liste-file-${listId}`;

function readQueue(listId: string): Pending {
  try {
    return JSON.parse(localStorage.getItem(queueKey(listId)) ?? '{}') as Pending;
  } catch {
    return {};
  }
}
function writeQueue(listId: string, q: Pending) {
  try {
    if (Object.keys(q).length) localStorage.setItem(queueKey(listId), JSON.stringify(q));
    else localStorage.removeItem(queueKey(listId));
  } catch {
    // Stockage indisponible (navigation privée) : le cochage reste en mémoire.
  }
}

const TINT: Record<string, string> = {
  fruits_legumes: 'bg-site-mint',
  epicerie: 'bg-chip-4',
  cremerie: 'bg-chip-1',
  viandes_poissons: 'bg-chip-6',
  boulangerie: 'bg-warning-soft',
  surgeles: 'bg-chip-5',
  placard: 'bg-chip-3',
};

const RING = 2 * Math.PI * 52;

/**
 * Liste de courses (maquettes AppListe / MListe) : cochage instantané, synchronisé en temps réel avec
 * la famille. Hors connexion, les cases cochées attendent dans une file locale et partent au retour du réseau.
 */
export function ShoppingList({
  listId,
  items: initial,
  aisles,
  me,
  names,
  cheaper,
  aside,
}: ShoppingListProps) {
  const [items, setItems] = useState(initial);
  const [source, setSource] = useState(initial);
  const [offline, setOffline] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const flushing = useRef(false);

  // Nouvelle version envoyée par le serveur (plan modifié, enseigne changée) : on repart de celle-ci.
  if (source !== initial) {
    setSource(initial);
    setItems(initial);
  }

  const send = useCallback(
    async (id: string, checked: boolean) => {
      const { error } = await supabase.from('shopping_list_items').update({ checked }).eq('id', id);
      return !error;
    },
    [supabase],
  );

  // Rejoue la file locale (au chargement et au retour du réseau).
  const flush = useCallback(async () => {
    const q = readQueue(listId);
    if (flushing.current || Object.keys(q).length === 0) return;
    flushing.current = true;
    // Les cases cochées hors ligne restent affichées cochées pendant l'envoi.
    setItems((prev) => prev.map((i) => (i.id in q ? { ...i, checked: q[i.id]! } : i)));
    const remaining: Pending = {};
    for (const [id, checked] of Object.entries(q)) {
      if (!(await send(id, checked))) remaining[id] = checked;
    }
    writeQueue(listId, remaining);
    setOffline(Object.keys(remaining).length > 0);
    flushing.current = false;
  }, [listId, send]);

  useEffect(() => {
    void flush();
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, [flush]);

  // Temps réel : les cases cochées par la famille apparaissent sans recharger.
  useEffect(() => {
    const channel = supabase
      .channel(`liste-${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shopping_list_items', filter: `list_id=eq.${listId}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as { id?: string };
            setItems((prev) => prev.filter((i) => i.id !== old.id));
            return;
          }
          const row = payload.new as {
            id: string;
            label: string;
            quantity_label: string | null;
            aisle_id: string | null;
            est_cents: number | null;
            checked: boolean;
            checked_by: string | null;
            added_by: string | null;
            manual: boolean;
          };
          const next: ListItemView = {
            id: row.id,
            label: row.label,
            quantity: row.quantity_label,
            aisleId: row.aisle_id,
            cents: row.est_cents,
            checked: row.checked,
            checkedBy: row.checked_by,
            addedBy: row.added_by,
            manual: row.manual,
          };
          setItems((prev) =>
            prev.some((i) => i.id === row.id)
              ? prev.map((i) => (i.id === row.id ? next : i))
              : [...prev, next],
          );
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, listId]);

  const toggle = async (item: ListItemView) => {
    const checked = !item.checked;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked, checkedBy: checked ? me : null } : i)),
    );
    if (!(await send(item.id, checked))) {
      const q = readQueue(listId);
      q[item.id] = checked;
      writeQueue(listId, q);
      setOffline(true);
    }
  };

  const groups = aisles
    .map((a) => ({ aisle: a, items: items.filter((i) => (i.aisleId ?? 'divers') === a.id) }))
    .filter((g) => g.items.length > 0);
  const done = items.filter((i) => i.checked).length;
  const total = sumCents(items.map((i) => i.cents));
  const left = sumCents(items.filter((i) => !i.checked).map((i) => i.cents));
  const ratio = items.length ? done / items.length : 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-5">
        {groups.map((g, gi) => (
          <section
            key={g.aisle.id}
            aria-labelledby={`rayon-${g.aisle.id}`}
            className="anim-rise border-line overflow-hidden rounded-[22px] border bg-white/80 shadow-[0_2px_20px_rgba(42,26,40,0.05)] backdrop-blur"
            style={animDelay(150 + gi * 80)}
          >
            <h2
              id={`rayon-${g.aisle.id}`}
              className={cx(
                'flex items-center justify-between px-5 py-3 text-[13px] font-black uppercase tracking-[1.2px]',
                TINT[g.aisle.id] ?? 'bg-surface-50',
              )}
            >
              <span>{g.aisle.label}</span>
              <span className="tabular-nums">
                {g.items.filter((i) => i.checked).length} / {g.items.length}
              </span>
            </h2>
            <ul>
              {g.items.map((it) => {
                const who =
                  it.checked && it.checkedBy && it.checkedBy !== me
                    ? `coché par ${names[it.checkedBy] ?? 'un proche'}`
                    : it.manual && it.addedBy && it.addedBy !== me
                      ? `ajouté par ${names[it.addedBy] ?? 'un proche'}`
                      : null;
                return (
                  <li key={it.id} className="border-line border-t first:border-t-0">
                    <label className="hover:bg-surface-50/60 flex min-h-[56px] cursor-pointer items-center gap-3.5 px-5 py-2.5">
                      <input
                        type="checkbox"
                        checked={it.checked}
                        onChange={() => void toggle(it)}
                        className="accent-brand h-[22px] w-[22px] shrink-0"
                      />
                      <span
                        className={cx(
                          'min-w-0 flex-1 text-[16px] font-extrabold',
                          it.checked && 'text-ink-muted line-through',
                        )}
                      >
                        {it.label}{' '}
                        {it.quantity ? (
                          <span className="text-ink-muted font-bold">· {it.quantity}</span>
                        ) : null}
                      </span>
                      {who ? (
                        <span className="rounded-pill bg-brand-soft text-brand hidden px-2 py-0.5 text-[12px] font-black sm:inline">
                          {who}
                        </span>
                      ) : null}
                      <Price cents={it.cents} size="sm" className={cx(it.checked && 'text-ink-muted')} />
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
        <div className="anim-ticket">
          <div className="relative rounded-t-[26px] bg-white px-6 pb-8 pt-6 shadow-[0_24px_50px_rgba(42,26,40,0.10)]">
            <div className="flex items-center gap-5">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                role="img"
                aria-label={`${Math.round(ratio * 100)} % des articles pris`}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-site-track"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(RING * ratio).toFixed(1)} ${RING.toFixed(1)}`}
                  transform="rotate(-90 60 60)"
                  className="text-saving transition-[stroke-dasharray] duration-500 motion-reduce:transition-none"
                />
                <text
                  x="60"
                  y="66"
                  textAnchor="middle"
                  className="fill-ink font-display text-[22px] font-extrabold"
                >
                  {Math.round(ratio * 100)} %
                </text>
              </svg>
              <div>
                <p className="text-ink-muted text-[12px] font-black tracking-[1.2px]">RESTE À PRENDRE</p>
                <p className="font-display text-[34px] font-extrabold tabular-nums tracking-[-1px]">
                  {formatEuro(left)}
                </p>
                <p className="text-ink-muted text-[14px] font-bold">
                  {done} articles sur {items.length}
                </p>
              </div>
            </div>
            <div className="border-line mt-5 flex flex-col gap-2 border-t-2 border-dashed pt-4 text-[15px]">
              <p className="flex justify-between font-bold">
                <span>Total de la liste</span>
                <strong className="tabular-nums">{formatEuro(total)}</strong>
              </p>
              {cheaper ? (
                <p className="text-saving-ink flex justify-between font-bold">
                  <span>Chez {cheaper.name}, cette liste</span>
                  <span className="tabular-nums">{formatEuro(cheaper.cents)}</span>
                </p>
              ) : null}
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 right-0 h-4"
              style={{
                background: 'radial-gradient(circle, var(--surface-50) 7px, transparent 7.5px) repeat-x',
                backgroundSize: '22px 16px',
              }}
            />
          </div>
        </div>
        {aside}
      </aside>

      {offline ? (
        <div className="fixed inset-x-4 bottom-28 z-30 mx-auto max-w-[520px] lg:bottom-8">
          <Toast>
            Pas de réseau : tes cases cochées sont gardées et partiront dès le retour de la connexion.
          </Toast>
        </div>
      ) : null}
    </div>
  );
}
