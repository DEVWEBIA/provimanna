'use client';

import Link from 'next/link';
import { useRef, useState, useTransition, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { storeDisplayName, type StoreId } from '@repas/core';
import { buttonClasses, cx, glassClasses, Icon, inputClasses, Notice, TicketCard } from '@repas/ui';
import { href } from '@/lib/site';
import { sendReceiptAction, type SendReceiptResult } from './actions';

const ACCEPT = 'image/jpeg,image/png,image/webp';

type Done = Extract<SendReceiptResult, { ok: true }>['summary'];

/** Envoi d'une photo de ticket : choix du fichier (ou glisser-déposer), enseigne, lecture puis résultat. */
export function TicketUpload({
  stores,
  nextReward,
}: {
  stores: { id: StoreId; name: string }[];
  nextReward: number;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [store, setStore] = useState('');
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [pending, start] = useTransition();

  const pick = (f: File | undefined | null) => {
    setError(null);
    if (f) setFile(f);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files[0]);
  };
  const submit = () => {
    if (!file) return setError('Choisis la photo de ton ticket.');
    const data = new FormData();
    data.set('photo', file);
    if (store) data.set('store', store);
    start(async () => {
      const res = await sendReceiptAction(data);
      if (res.ok) setDone(res.summary);
      else setError(res.error);
    });
  };

  if (done)
    return <Result summary={done} nextReward={nextReward} onAgain={() => (setDone(null), setFile(null))} />;

  return (
    <section className={cx(glassClasses, 'p-5')} aria-labelledby="envoi-titre">
      <h2 id="envoi-titre" className="sr-only">
        Envoyer la photo du ticket
      </h2>
      <AnimatePresence mode="wait" initial={false}>
        {pending ? (
          <Reading key="lecture" />
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <label
              onDragOver={(e) => (e.preventDefault(), setDrag(true))}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={cx(
                'flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[22px] border-2 border-dashed px-6 py-8 text-center transition-colors',
                drag ? 'border-brand bg-brand-soft' : 'border-line hover:border-brand bg-white/60',
              )}
            >
              <input
                ref={input}
                type="file"
                name="photo"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => pick(e.target.files?.[0])}
              />
              <span className="bg-brand-soft text-brand grid h-14 w-14 place-items-center rounded-full">
                <Icon name="ticket" size={26} />
              </span>
              {file ? (
                <>
                  <span className="text-[18px] font-black">{file.name}</span>
                  <span className="text-ink-muted text-[14px] font-bold">
                    {(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} Mo · clique pour changer de photo
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[18px] font-black">Glisse la photo ici</span>
                  <span className="text-ink-muted text-[14px] font-bold">
                    ou clique pour choisir un fichier · JPG, PNG, WEBP · 10 Mo max
                  </span>
                </>
              )}
            </label>

            <div className="mt-5">
              <label htmlFor="enseigne" className="mb-2 block text-[15px] font-black">
                Enseigne du ticket
              </label>
              <select
                id="enseigne"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                className={inputClasses(false, 'px-3.5')}
              >
                <option value="">Détection automatique</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-ink-muted mt-4 flex items-start gap-2 text-[14px] font-bold">
              <Icon name="verrou" size={16} className="mt-0.5 shrink-0" />
              La photo est supprimée après vérification. Seuls les prix et le magasin sont gardés, sans lien
              avec ton nom.
            </p>
            {error ? <Notice tone="error" title={error} className="mt-4" /> : null}
            <button type="button" onClick={submit} className={buttonClasses('primary', 'md', 'mt-5 w-full')}>
              Envoyer mon ticket
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Écran d'attente pendant la lecture (maquette : « On lit ton ticket… »). */
function Reading() {
  const steps = ['Photo reçue', 'Lecture des lignes', 'Correspondance avec les produits'];
  return (
    <motion.div
      key="lecture"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center"
    >
      <span className="anim-float bg-brand-soft text-brand grid h-16 w-16 place-items-center rounded-full">
        <Icon name="ticket" size={30} />
      </span>
      <div>
        <p className="font-display text-[26px] font-extrabold">On lit ton ticket…</p>
        <p className="text-ink-muted mt-1 font-bold">Environ 10 secondes.</p>
      </div>
      <ul className="flex flex-col gap-2 text-left">
        {steps.map((s, i) => (
          <motion.li
            key={s}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 1.2 }}
            className="flex items-center gap-2 font-bold"
          >
            <Icon name="check" size={16} className="text-success" />
            {s}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function Result({
  summary,
  nextReward,
  onAgain,
}: {
  summary: Done;
  nextReward: number;
  onAgain: () => void;
}) {
  const store = summary.storeId ? storeDisplayName(summary.storeId) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <TicketCard edge="surface-50" tone="brand" className="rounded-t-[26px] px-6 pb-10 pt-6">
        <p className="text-site-lilac text-[12px] font-black tracking-[1.2px]">MERCI, TICKET BIEN REÇU</p>
        <p className="font-display mt-2 text-[30px] font-extrabold leading-tight">
          {summary.read
            ? `${summary.read} lignes lues${store ? ` chez ${store}` : ''}.`
            : 'L’équipe va lire ton ticket à la main.'}
        </p>
        {summary.read ? (
          <ul className="text-site-on-brand-muted mt-3 flex flex-col gap-1 text-[15px] font-bold">
            <li>✓ {summary.recognized} produits reconnus</li>
            {summary.toReview ? <li>· {summary.toReview} lignes vérifiées par l’équipe</li> : null}
            {summary.ignored ? <li>· {summary.ignored} lignes hors produits ignorées</li> : null}
          </ul>
        ) : null}
        <p className="mt-5 text-[16px] font-bold">
          {nextReward > 0
            ? `Tes +${nextReward} jours de Premium arrivent dès que l’équipe a validé le ticket.`
            : 'Tu as atteint le maximum de jours gagnés ce mois-ci : merci pour tes prix, ils comptent quand même.'}
        </p>
      </TicketCard>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link href={href('/app/plan')} className={buttonClasses('primary', 'md', 'no-underline')}>
          Revenir à mon plan
        </Link>
        <button type="button" onClick={onAgain} className="text-brand min-h-tap text-[15px] font-black">
          Envoyer un autre ticket
        </button>
      </div>
    </motion.div>
  );
}
