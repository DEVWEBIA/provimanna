'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireRole } from '@/lib/staff';

export type SaveResult = { ok: true; message: string } | { ok: false; error: string };

const DIETS = ['omnivore', 'sans_porc', 'vegetarien', 'vegan', 'halal', 'sans_gluten'] as const;
const recipeSchema = z.object({
  id: z.guid(),
  title: z.string().trim().min(3, 'Le titre est trop court.').max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'L’adresse ne contient que des minuscules, chiffres et tirets.'),
  description: z.string().trim().max(400).nullable(),
  servings: z.number().int().min(1).max(12),
  prepMinutes: z.number().int().min(0).max(600),
  cookMinutes: z.number().int().min(0).max(600),
  family: z.string().trim().min(2).max(40),
  illustration: z.string().max(20),
  diets: z.array(z.enum(DIETS)).min(1),
  tags: z.array(z.string().max(30)).max(12),
  seasonMonths: z.array(z.number().int().min(1).max(12)).min(1),
  steps: z
    .array(z.object({ text: z.string().trim().min(3), minutes: z.number().int().min(0).max(600).nullable() }))
    .min(1, 'Ajoute au moins une étape.'),
  ingredients: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        productId: z.guid().nullable(),
        units: z.number().min(0).max(100),
        pantry: z.boolean(),
      }),
    )
    .min(1, 'Ajoute au moins un ingrédient.'),
  seoTitle: z.string().trim().max(70).nullable(),
  seoDescription: z.string().trim().max(170).nullable(),
  published: z.boolean(),
});

/** Enregistre une recette (session de l'éditeur : RLS « édition »), remplace ses ingrédients, journalise. */
export async function saveRecipe(input: unknown): Promise<SaveResult> {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' };
  const r = parsed.data;
  const { supabase } = await requireRole(['editeur']);
  const { data: before } = await supabase.from('recipes').select('published').eq('id', r.id).maybeSingle();
  const { error } = await supabase
    .from('recipes')
    .update({
      title: r.title,
      slug: r.slug,
      description: r.description,
      servings: r.servings,
      prep_minutes: r.prepMinutes,
      cook_minutes: r.cookMinutes,
      family: r.family,
      illustration: r.illustration,
      diets: r.diets,
      tags: r.tags,
      season_months: r.seasonMonths,
      steps: r.steps,
      seo_title: r.seoTitle,
      seo_description: r.seoDescription,
      published: r.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', r.id);
  if (error)
    return {
      ok: false,
      error:
        error.code === '23505'
          ? 'Cette adresse est déjà prise par une autre recette.'
          : 'Enregistrement impossible.',
    };
  const del = await supabase.from('recipe_ingredients').delete().eq('recipe_id', r.id);
  if (del.error) return { ok: false, error: 'Ingrédients non enregistrés.' };
  const ins = await supabase.from('recipe_ingredients').insert(
    r.ingredients.map((i, k) => ({
      recipe_id: r.id,
      label: i.label,
      product_id: i.productId,
      units: i.units,
      pantry: i.pantry,
      position: k + 1,
    })),
  );
  if (ins.error) return { ok: false, error: 'Ingrédients non enregistrés.' };
  const action =
    before?.published !== r.published
      ? r.published
        ? 'recette.publier'
        : 'recette.depublier'
      : 'recette.enregistrer';
  await supabase.rpc('log_action', {
    p_action: action,
    p_entity: 'recipes',
    p_entity_id: r.id,
    p_details: { slug: r.slug },
  });
  revalidatePath('/recettes', 'layout');
  return {
    ok: true,
    message:
      action === 'recette.publier'
        ? 'Recette publiée.'
        : action === 'recette.depublier'
          ? 'Recette retirée du site.'
          : 'Recette enregistrée.',
  };
}

const newSchema = z.object({ title: z.string().trim().min(3).max(120) });
const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Nouvelle recette en brouillon, puis ouverture de l'éditeur. */
export async function createRecipe(formData: FormData) {
  const parsed = newSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { supabase } = await requireRole(['editeur']);
  const { data } = await supabase
    .from('recipes')
    .insert({
      title: parsed.data.title,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      published: false,
      family: 'autre',
    })
    .select('id')
    .single();
  if (!data) return;
  await supabase.rpc('log_action', {
    p_action: 'recette.creer',
    p_entity: 'recipes',
    p_entity_id: data.id,
    p_details: {},
  });
  redirect(`/recettes/${data.id}`);
}
