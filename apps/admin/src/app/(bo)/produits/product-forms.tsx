'use client';

import { useActionState } from 'react';
import { Button, inputClasses } from '@repas/ui';
import { createProduct, mergeProducts, updateProduct, type ProductState } from './actions';

export interface ProductFormValues {
  id?: string;
  name: string;
  brand: string | null;
  quantity_label: string | null;
  aisle_id: string | null;
  ean: string | null;
}

const AISLES = [
  ['fruits_legumes', 'Fruits et légumes'],
  ['boulangerie', 'Boulangerie'],
  ['cremerie', 'Crèmerie'],
  ['epicerie', 'Épicerie'],
  ['viandes_poissons', 'Viandes et poissons'],
  ['surgeles', 'Surgelés'],
  ['placard', 'Placard'],
] as const;

function Message({ state }: { state: ProductState }) {
  if (state.status === 'idle') return null;
  return (
    <p
      role={state.status === 'error' ? 'alert' : 'status'}
      className={`text-[14px] font-extrabold ${state.status === 'error' ? 'text-danger' : 'text-success'}`}
    >
      {state.message}
    </p>
  );
}

/** Formulaire de fiche produit (création ou modification). */
export function ProductForm({ values }: { values?: ProductFormValues }) {
  const [state, action, pending] = useActionState(values?.id ? updateProduct : createProduct, {
    status: 'idle',
  } as ProductState);
  const p = values ?? { name: '', brand: null, quantity_label: null, aisle_id: 'epicerie', ean: null };
  const key = values?.id ?? 'new';
  return (
    <form action={action} className="flex flex-col gap-3" key={key}>
      {values?.id ? <input type="hidden" name="id" value={values.id} /> : null}
      {(
        [
          ['name', 'Nom', p.name],
          ['brand', 'Marque', p.brand],
          ['quantity_label', 'Format', p.quantity_label],
          ['ean', 'EAN', p.ean],
        ] as const
      ).map(([n, l, v]) => (
        <div key={n}>
          <label htmlFor={`${key}-${n}`} className="mb-1 block text-[13px] font-black">
            {l}
          </label>
          <input
            id={`${key}-${n}`}
            name={n}
            defaultValue={v ?? ''}
            required={n === 'name'}
            className={inputClasses(false, 'min-h-[44px]')}
          />
        </div>
      ))}
      <div>
        <label htmlFor={`${key}-aisle`} className="mb-1 block text-[13px] font-black">
          Rayon
        </label>
        <select
          id={`${key}-aisle`}
          name="aisle_id"
          defaultValue={p.aisle_id ?? 'epicerie'}
          className={inputClasses(false, 'min-h-[44px]')}
        >
          {AISLES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <Message state={state} />
      <Button type="submit" variant={values?.id ? 'secondary' : 'primary'} disabled={pending}>
        {values?.id ? 'Modifier la fiche' : 'Créer la fiche'}
      </Button>
    </form>
  );
}

/** Fusion d'une fiche en double dans la fiche affichée. */
export function MergeForm({
  keepId,
  candidates,
}: {
  keepId: string;
  candidates: { id: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(mergeProducts, { status: 'idle' } as ProductState);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="keep" value={keepId} />
      <label htmlFor="drop" className="text-[13px] font-black">
        Fiche à fusionner dans celle-ci
      </label>
      <select id="drop" name="drop" className={inputClasses(false, 'min-h-[44px]')}>
        {candidates.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <Message state={state} />
      <Button type="submit" variant="secondary" disabled={pending}>
        Fusionner les fiches
      </Button>
    </form>
  );
}
