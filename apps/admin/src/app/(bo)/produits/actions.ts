'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';
import { createAdminClient } from '@/lib/supabase/admin';

export type ProductState =
  { status: 'idle' } | { status: 'ok'; message: string } | { status: 'error'; message: string };

const AISLES = [
  'fruits_legumes',
  'boulangerie',
  'cremerie',
  'epicerie',
  'viandes_poissons',
  'surgeles',
  'placard',
] as const;
const productSchema = z.object({
  name: z.string().trim().min(2, 'Le nom est trop court.').max(120),
  brand: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => v || null),
  quantity_label: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => v || null),
  aisle_id: z.enum(AISLES),
  ean: z
    .string()
    .trim()
    .optional()
    .transform((v) => v?.replace(/\s/g, '') || null)
    .refine((v) => v === null || /^\d{8}(\d{5})?$/.test(v), 'Un EAN fait 8 ou 13 chiffres.'),
});

const fail = (message: string): ProductState => ({ status: 'error', message });

export async function updateProduct(_prev: ProductState, formData: FormData): Promise<ProductState> {
  const id = z.guid().safeParse(formData.get('id'));
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!id.success) return fail('Fiche invalide.');
  if (!parsed.success) return fail(parsed.error.issues[0]!.message);
  const { supabase } = await requireRole(['moderateur_prix']);
  const { error } = await supabase.from('products').update(parsed.data).eq('id', id.data);
  if (error)
    return fail(
      error.code === '23505' ? 'Cet EAN est déjà utilisé par une autre fiche.' : 'Enregistrement impossible.',
    );
  await supabase.rpc('log_action', {
    p_action: 'produit.modifier',
    p_entity: 'products',
    p_entity_id: id.data,
    p_details: { name: parsed.data.name },
  });
  revalidatePath('/produits');
  return { status: 'ok', message: 'Fiche enregistrée.' };
}

export async function createProduct(_prev: ProductState, formData: FormData): Promise<ProductState> {
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail(parsed.error.issues[0]!.message);
  const { supabase } = await requireRole(['moderateur_prix']);
  const { data, error } = await supabase.from('products').insert(parsed.data).select('id').single();
  if (error || !data)
    return fail(error?.code === '23505' ? 'Cet EAN est déjà utilisé.' : 'Création impossible.');
  await supabase.rpc('log_action', {
    p_action: 'produit.creer',
    p_entity: 'products',
    p_entity_id: data.id,
    p_details: { name: parsed.data.name },
  });
  redirect(`/produits?id=${data.id}`);
}

/**
 * Fusionne une fiche en double dans la fiche gardée : prix, ingrédients, articles de liste et lignes de
 * tickets pointent ensuite vers la fiche gardée, puis la fiche en double est supprimée.
 * Écritures sur plusieurs tables : faites avec la clé serveur, après contrôle du rôle.
 */
export async function mergeProducts(_prev: ProductState, formData: FormData): Promise<ProductState> {
  const keep = z.guid().safeParse(formData.get('keep'));
  const drop = z.guid().safeParse(formData.get('drop'));
  if (!keep.success || !drop.success || keep.data === drop.data) return fail('Choisis la fiche à fusionner.');
  const { supabase } = await requireRole(['moderateur_prix']);
  const admin = createAdminClient();
  for (const table of ['prices', 'recipe_ingredients', 'shopping_list_items', 'receipt_lines'] as const) {
    const { error } = await admin.from(table).update({ product_id: keep.data }).eq('product_id', drop.data);
    if (error) return fail(`Fusion interrompue (${table}).`);
  }
  const { error } = await admin.from('products').delete().eq('id', drop.data);
  if (error) return fail('La fiche en double n’a pas pu être supprimée.');
  await supabase.rpc('log_action', {
    p_action: 'produit.fusionner',
    p_entity: 'products',
    p_entity_id: keep.data,
    p_details: { fusionne: drop.data },
  });
  redirect(`/produits?id=${keep.data}&fait=fusion`);
}
