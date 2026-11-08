import { STORE_IDS, STORES_INFO, type StoreId } from '@repas/core';

/**
 * Panier d'exemple de la landing (famille de 4, 14 repas, semaine 46), cohérent avec supabase/seed.sql
 * et verrouillé par packages/core/src/seed-consistency.test.ts.
 * TODO(lot 8) : brancher sur le comparatif hebdomadaire réel (ISR) quand /comparatif-prix-supermarches existera.
 */
export const EXAMPLE_WEEK = { label: 'sem. 46', week: 46 } as const;

export interface ExampleStore {
  id: StoreId;
  name: string;
  initials: string;
  cents: number;
  /** Ligne du ticket du hero (les 6 enseignes des maquettes, montants verrouillés par les tests). */
  hero: boolean;
}

const example = (id: StoreId, cents: number, hero = false): ExampleStore => ({
  id,
  name: STORES_INFO[id].name,
  initials: STORES_INFO[id].initials,
  cents,
  hero,
});

/** Enseignes à assortiment complet (Picard et Grand Frais n'ont pas de total sur un panier complet). */
export const EXAMPLE_STORES: ExampleStore[] = [
  example('lidl', 6010, true),
  example('aldi', 6140, true),
  example('netto', 6250),
  example('leclerc', 6420, true),
  example('super-u', 6680),
  example('intermarche', 6890, true),
  example('carrefour', 7030, true),
  example('auchan', 7160, true),
  example('franprix', 7920),
  example('monoprix', 7790),
];

/** Lignes du ticket interactif du hero. */
export const HERO_STORES = EXAMPLE_STORES.filter((s) => s.hero);

/** Toutes les enseignes comparées, pour le bandeau de logos. */
export const ALL_STORES = STORE_IDS.map((id) => STORES_INFO[id]);

/** Enseigne habituelle du foyer d'exemple. */
export const EXAMPLE_MY_STORE: StoreId = 'auchan';

/** Facteur d'échelle du panier selon la taille du foyer (maquette Main). */
export const HOUSEHOLD_FACTORS = [
  { people: 1, label: '1 pers.', factor: 0.32 },
  { people: 2, label: '2 pers.', factor: 0.55 },
  { people: 4, label: '4 pers.', factor: 1 },
  { people: 6, label: '6 pers.', factor: 1.42 },
] as const;

export const LANDING_FAQ: { q: string; a: string }[] = [
  {
    q: 'Est-ce vraiment gratuit ?',
    a: 'Oui. Le plan de la semaine, la liste de courses et le prix détaillé dans ton enseigne sont gratuits, sans limite de durée. Premium ajoute le détail produit par produit, les plans illimités et les alertes promo.',
  },
  {
    q: 'D’où viennent les prix ?',
    a: 'Des relevés publics Open Prices (Open Food Facts) et des tickets de caisse envoyés par la communauté. Chaque total affiche la date du relevé et un indice de fiabilité.',
  },
  {
    q: 'Quelles enseignes sont comparées ?',
    a: 'Lidl, Aldi, Netto, E.Leclerc, Super U, Intermarché, Carrefour, Auchan, Franprix et Monoprix, plus Grand Frais et Picard pour les produits qu’ils vendent, en France. La Belgique, la Suisse et le Canada suivront.',
  },
  {
    q: 'Dois-je changer de supermarché ?',
    a: 'Non. Le prix est un repère : tu gardes ton enseigne si tu préfères, même si elle est plus chère.',
  },
  {
    q: 'Comment fonctionne l’essai Premium ?',
    a: '14 jours offerts dès l’inscription, sans carte bancaire. À la fin, tu repasses automatiquement au gratuit, sans rien perdre.',
  },
  {
    q: 'Puis-je commander en drive ?',
    a: 'Tu exportes ta liste et tu ouvres le drive de ton enseigne en un clic. La commande directe viendra plus tard.',
  },
];

/**
 * Recettes mises en avant sur la landing (photos : src/assets/photos, crédits dans CREDITS.md).
 * Coût pour 4 parts chez Lidl (données de démo, semaine 46) ; le velouté vient du seed (4,06 €).
 * TODO(lot 8) : lire les recettes publiées et leur coût réel.
 */
export const LANDING_RECIPES = [
  { slug: 'veloute-potimarron', title: 'Velouté de potimarron', minutes: 35, tag: 'de saison', cents4: 406 },
  {
    slug: 'curry-pois-chiches-courge',
    title: 'Curry de pois chiches et courge',
    minutes: 30,
    tag: 'végé',
    cents4: 468,
  },
  { slug: 'couscous-legumes', title: 'Couscous de légumes', minutes: 40, tag: 'familial', cents4: 512 },
  { slug: 'legumes-rotis', title: 'Plaque de légumes rôtis', minutes: 45, tag: 'sans effort', cents4: 380 },
] as const;
