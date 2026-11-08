import { describe, expect, it } from 'vitest';
import {
  generatePlan,
  isRecipeAllowed,
  mealServings,
  PlannerError,
  replaceMeal,
  seededRandom,
  type PlannedMeal,
  type PlannerHousehold,
  type PlannerRecipe,
} from './planner.ts';
import type { Diet } from './household.ts';

// Catalogue de test : 12 familles × 3 recettes, régimes et marqueurs variés.
const FAMILIES = [
  'soupe',
  'pates',
  'curry',
  'gratin',
  'poisson',
  'oeufs',
  'cereales',
  'tarte',
  'salade',
  'four',
  'mijote',
  'legumineuses',
];
function catalogue(): PlannerRecipe[] {
  return FAMILIES.flatMap((family, f) =>
    [0, 1, 2].map((v) => {
      const meat = family === 'mijote';
      const fish = family === 'poisson';
      const diets: Diet[] = ['omnivore'];
      if (!(meat && v === 0)) diets.push('sans_porc');
      if (!meat && !fish) diets.push('vegetarien', 'halal');
      if (v !== 1) diets.push('sans_gluten');
      const tags: string[] = [];
      if (v === 0) tags.push('lactose');
      if (fish) tags.push('poisson');
      if (family === 'curry') tags.push('epice');
      if (family === 'salade' && v === 2) tags.push('fruits_a_coque');
      if (v === 1) tags.push('enfants');
      if (v === 2) tags.push('batch');
      return {
        id: `${family}-${v}`,
        family,
        diets,
        tags,
        seasonMonths: v === 2 && f % 2 === 0 ? [6, 7, 8] : [9, 10, 11, 12, 1, 2, 3],
        totalMinutes: [20, 30, 45, 60][(f + v) % 4]!,
        costPerServingCents: 60 + (((f * 3 + v) * 37) % 200),
      };
    }),
  );
}
const RECIPES = catalogue();
const byId = new Map(RECIPES.map((r) => [r.id, r]));
const OMNI: PlannerHousehold = { diet: 'omnivore', exclusions: [], cookingTime: 'peu_importe' };
const opts = (seed = 1, extra = {}) => ({ month: 11, random: seededRandom(seed), ...extra });
const recipe = (m: PlannedMeal) => byId.get(m.recipeId)!;

describe('generatePlan', () => {
  it('compose 14 repas, un par créneau, triés du lundi midi au dimanche soir', () => {
    const plan = generatePlan(OMNI, RECIPES, opts());
    expect(plan).toHaveLength(14);
    expect(plan.map((m) => `${m.day}:${m.slot}`)).toEqual(
      [1, 2, 3, 4, 5, 6, 7].flatMap((d) => [`${d}:dejeuner`, `${d}:diner`]),
    );
    expect(new Set(plan.map((m) => `${m.day}:${m.slot}`)).size).toBe(14);
    expect(plan.filter((m) => m.slot === 'dejeuner')).toHaveLength(7);
  });

  it('est déterministe avec le même aléa, et varie avec un autre', () => {
    const a = generatePlan(OMNI, RECIPES, opts(42));
    const b = generatePlan(OMNI, RECIPES, opts(42));
    const c = generatePlan(OMNI, RECIPES, opts(7));
    expect(a).toEqual(b);
    expect(a.map((m) => m.recipeId)).not.toEqual(c.map((m) => m.recipeId));
  });

  it('ne sert jamais deux fois la même recette dans la semaine', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const plan = generatePlan(OMNI, RECIPES, opts(seed));
      expect(new Set(plan.map((m) => m.recipeId)).size).toBe(14);
    }
  });

  it('varie les familles : au plus 2 par semaine, jamais deux fois la même le même jour', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const plan = generatePlan(OMNI, RECIPES, opts(seed));
      const counts = new Map<string, number>();
      for (const m of plan) counts.set(recipe(m).family, (counts.get(recipe(m).family) ?? 0) + 1);
      expect(Math.max(...counts.values())).toBeLessThanOrEqual(2);
      for (let d = 1; d <= 7; d++) {
        const fams = plan.filter((m) => m.day === d).map((m) => recipe(m).family);
        expect(new Set(fams).size).toBe(fams.length);
      }
    }
  });

  it.each([
    [
      'végétarien (régime)',
      { diet: 'vegetarien' as Diet, exclusions: [] },
      (r: PlannerRecipe) => r.diets.includes('vegetarien'),
    ],
    [
      'halal (régime)',
      { diet: 'halal' as Diet, exclusions: [] },
      (r: PlannerRecipe) => r.diets.includes('halal'),
    ],
    [
      'sans porc (régime)',
      { diet: 'sans_porc' as Diet, exclusions: [] },
      (r: PlannerRecipe) => r.diets.includes('sans_porc'),
    ],
    [
      'sans gluten',
      { diet: 'omnivore' as Diet, exclusions: ['sans_gluten'] },
      (r: PlannerRecipe) => r.diets.includes('sans_gluten'),
    ],
    [
      'sans lactose',
      { diet: 'omnivore' as Diet, exclusions: ['sans_lactose'] },
      (r: PlannerRecipe) => !r.tags.includes('lactose'),
    ],
    [
      'sans poisson',
      { diet: 'omnivore' as Diet, exclusions: ['sans_poisson'] },
      (r: PlannerRecipe) => !r.tags.includes('poisson'),
    ],
    [
      'sans fruits à coque',
      { diet: 'omnivore' as Diet, exclusions: ['sans_fruits_a_coque'] },
      (r: PlannerRecipe) => !r.tags.includes('fruits_a_coque'),
    ],
    [
      'peu épicé',
      { diet: 'omnivore' as Diet, exclusions: ['peu_epice'] },
      (r: PlannerRecipe) => !r.tags.includes('epice'),
    ],
    [
      'halal en exclusion secondaire',
      { diet: 'vegetarien' as Diet, exclusions: ['halal', 'sans_lactose'] },
      (r: PlannerRecipe) => r.diets.includes('halal') && !r.tags.includes('lactose'),
    ],
  ])('respecte toujours : %s', (_, h, ok) => {
    const household = { ...h, cookingTime: 'peu_importe' as const };
    for (let seed = 1; seed <= 10; seed++) {
      const plan = generatePlan(household, RECIPES, opts(seed));
      expect(plan).toHaveLength(14);
      expect(plan.every((m) => ok(recipe(m)))).toBe(true);
    }
  });

  it('« moins de 30 min » : soirs et midis de semaine rapides, week-end libre', () => {
    const h: PlannerHousehold = { ...OMNI, cookingTime: 'moins_30' };
    for (let seed = 1; seed <= 20; seed++) {
      const plan = generatePlan(h, RECIPES, opts(seed));
      expect(plan.filter((m) => m.day <= 5).every((m) => recipe(m).totalMinutes <= 30)).toBe(true);
    }
  });

  it('privilégie les recettes de saison et les moins chères', () => {
    let offSeason = 0;
    let planCost = 0;
    const avgCatalogue = RECIPES.reduce((s, r) => s + r.costPerServingCents!, 0) / RECIPES.length;
    for (let seed = 1; seed <= 20; seed++) {
      const plan = generatePlan(OMNI, RECIPES, opts(seed));
      offSeason += plan.filter((m) => !recipe(m).seasonMonths.includes(11)).length;
      planCost += plan.reduce((s, m) => s + recipe(m).costPerServingCents!, 0) / 14;
    }
    expect(offSeason / 20).toBeLessThan(1);
    expect(planCost / 20).toBeLessThan(avgCatalogue);
  });

  it('conserve les repas verrouillés à leur place', () => {
    const locked: PlannedMeal[] = [
      { day: 3, slot: 'diner', recipeId: 'mijote-0', locked: true },
      { day: 6, slot: 'dejeuner', recipeId: 'tarte-1', locked: true },
    ];
    for (let seed = 1; seed <= 10; seed++) {
      const plan = generatePlan(OMNI, RECIPES, opts(seed, { locked }));
      expect(plan.find((m) => m.day === 3 && m.slot === 'diner')).toEqual(locked[0]);
      expect(plan.find((m) => m.day === 6 && m.slot === 'dejeuner')).toEqual(locked[1]);
      expect(plan.filter((m) => m.recipeId === 'mijote-0')).toHaveLength(1);
    }
  });

  it('évite les recettes de la semaine précédente', () => {
    const first = generatePlan(OMNI, RECIPES, opts(3));
    const second = generatePlan(OMNI, RECIPES, opts(4, { recentRecipeIds: first.map((m) => m.recipeId) }));
    const repeated = second.filter((m) => first.some((f) => f.recipeId === m.recipeId)).length;
    expect(repeated).toBeLessThanOrEqual(4);
  });

  it('applique les filtres de la maquette (végé, enfants…)', () => {
    const veg = generatePlan(OMNI, RECIPES, opts(5, { filters: { vegetarian: true } }));
    expect(veg.every((m) => recipe(m).diets.includes('vegetarien'))).toBe(true);
    const quick = generatePlan(OMNI, RECIPES, opts(5, { filters: { quick: true } }));
    expect(quick.every((m) => recipe(m).totalMinutes <= 30)).toBe(true);
  });

  it('ignore un filtre qui laisserait trop peu de recettes pour varier', () => {
    const plan = generatePlan(OMNI, RECIPES, opts(5, { filters: { kids: true, batch: true } }));
    expect(plan).toHaveLength(14);
  });

  it('petit catalogue : relâche la variété mais jamais deux fois la même recette le même jour', () => {
    const tiny = RECIPES.filter((r) => ['soupe-0', 'pates-1', 'curry-2'].includes(r.id));
    const plan = generatePlan(OMNI, tiny, opts(1));
    expect(plan).toHaveLength(14);
    for (let d = 1; d <= 7; d++) {
      const ids = plan.filter((m) => m.day === d).map((m) => m.recipeId);
      expect(new Set(ids).size).toBe(2);
    }
  });

  it('signale clairement un foyer sans aucune recette compatible', () => {
    const h: PlannerHousehold = { diet: 'vegan', exclusions: [], cookingTime: 'peu_importe' };
    expect(() => generatePlan(h, RECIPES, opts())).toThrow(PlannerError);
  });
});

describe('replaceMeal', () => {
  it('propose une autre recette compatible sans toucher au reste', () => {
    const h: PlannerHousehold = { diet: 'vegetarien', exclusions: [], cookingTime: 'peu_importe' };
    const plan = generatePlan(h, RECIPES, opts(9));
    const target = plan[4]!;
    const next = replaceMeal(plan, target, h, RECIPES, opts(10));
    expect(next.day).toBe(target.day);
    expect(next.slot).toBe(target.slot);
    expect(next.recipeId).not.toBe(target.recipeId);
    expect(byId.get(next.recipeId)!.diets).toContain('vegetarien');
    expect(plan.some((m) => m.recipeId === next.recipeId)).toBe(false);
  });
});

describe('isRecipeAllowed', () => {
  it('omnivore sans exclusion : tout passe', () => {
    expect(RECIPES.every((r) => isRecipeAllowed(r, OMNI))).toBe(true);
  });
  it('ignore les préférences inconnues', () => {
    expect(isRecipeAllowed(RECIPES[0]!, { ...OMNI, exclusions: ['inconnue'] })).toBe(true);
  });
});

describe('mealServings', () => {
  it.each([
    [2, 2, 4],
    [2, 0, 2],
    [1, 1, 2],
    [2, 1, 3],
    [1, 0, 1],
    [4, 3, 7],
  ])('%i adulte(s) + %i enfant(s) → %i parts', (a, c, n) => expect(mealServings(a, c)).toBe(n));
});
