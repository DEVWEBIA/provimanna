import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@repas/core/database.types';

export interface IngredientGroup {
  id: string;
  label: string;
  items: { id: string; name: string }[];
}

/**
 * Produits utilisés par les recettes publiées (hors placard : épices, huile…), groupés par rayon :
 * la liste de l'écran « Tu n'aimes pas ? ». Lisible sans compte (référentiels publics).
 */
export async function dislikableIngredients(supabase: SupabaseClient<Database>): Promise<IngredientGroup[]> {
  const [{ data: rows }, { data: aisles }] = await Promise.all([
    supabase
      .from('recipe_ingredients')
      .select('product_id, products(id, name, aisle_id), recipes!inner(published)')
      .eq('pantry', false)
      .eq('recipes.published', true),
    supabase.from('aisles').select('id, label, position').order('position'),
  ]);
  const byAisle = new Map<string, Map<string, string>>();
  for (const r of rows ?? []) {
    const p = r.products;
    if (!p?.aisle_id || p.aisle_id === 'placard') continue;
    if (!byAisle.has(p.aisle_id)) byAisle.set(p.aisle_id, new Map());
    byAisle.get(p.aisle_id)!.set(p.id, p.name);
  }
  return (aisles ?? [])
    .filter((a) => byAisle.has(a.id))
    .map((a) => ({
      id: a.id,
      label: a.label,
      items: [...byAisle.get(a.id)!]
        .map(([id, name]) => ({ id, name }))
        .sort((x, y) => x.name.localeCompare(y.name, 'fr')),
    }));
}
