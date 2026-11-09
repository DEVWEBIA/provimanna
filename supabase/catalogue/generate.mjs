// Catalogue de départ : produits, prix de DÉMONSTRATION et recettes d'automne / hiver.
// Usage : node supabase/catalogue/generate.mjs  →  écrit supabase/catalogue.sql (chargé après seed.sql).
//
// Les régimes (recipes.diets) et les marqueurs lactose / poisson / fruits à coque sont DÉDUITS des
// ingrédients (drapeaux des produits) : impossible d'oublier un allergène en ajoutant une recette.
// Les prix sont fictifs mais réalistes (niveau Lidl × écart moyen de chaque enseigne ± 5 %), avec
// source = 'manual'. Ils seront remplacés par les relevés Open Prices et les tickets (lot 10).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'catalogue.sql');

// ─── Produits ─────────────────────────────────────────────────────────────
// [clé, nom, conditionnement, rayon, prix Lidl (centimes), drapeaux]
// Drapeaux : porc, volaille, boeuf, poisson, oeuf, lactose, gluten, noix, epice.
// Les 8 produits du seed (ids …101 à …108) gardent leurs ids et leurs prix Lidl / Auchan existants.
const EXISTING = {
  potimarron: '00000000-0000-0000-0000-000000000101',
  oignons: '00000000-0000-0000-0000-000000000102',
  creme: '00000000-0000-0000-0000-000000000103',
  bouillon: '00000000-0000-0000-0000-000000000104',
  huile: '00000000-0000-0000-0000-000000000105',
  pain: '00000000-0000-0000-0000-000000000106',
  feta: '00000000-0000-0000-0000-000000000107',
  coco: '00000000-0000-0000-0000-000000000108',
};
// Prix déjà présents dans seed.sql pour ces produits (on ne les double pas, sinon les médianes changent).
const SEEDED_STORES = {
  potimarron: ['lidl', 'auchan'],
  oignons: ['lidl', 'auchan'],
  creme: ['lidl', 'auchan'],
  bouillon: ['lidl', 'auchan'],
  huile: ['lidl', 'auchan'],
  pain: ['lidl', 'auchan'],
  feta: ['lidl'],
  coco: ['carrefour'],
};

const PRODUCTS = [
  ['potimarron', 'Potimarron', 'pièce ≈ 1,2 kg', 'fruits_legumes', 199, []],
  ['oignons', 'Oignons jaunes', 'filet 1 kg', 'fruits_legumes', 120, []],
  ['creme', 'Crème liquide 15 %', '20 cl', 'cremerie', 89, ['lactose']],
  ['bouillon', 'Bouillon de légumes', 'boîte de 10', 'epicerie', 99, []],
  ['huile', "Huile d'olive", '1 L', 'placard', 399, []],
  ['pain', 'Pain de campagne', '400 g', 'boulangerie', 70, ['gluten']],
  ['feta', 'Feta AOP', '200 g', 'cremerie', 225, ['lactose']],
  ['coco', 'Lait de coco', '40 cl', 'epicerie', 115, []],
  // Fruits et légumes
  ['carottes', 'Carottes', 'sachet 1 kg', 'fruits_legumes', 109, []],
  ['poireaux', 'Poireaux', 'botte 1 kg', 'fruits_legumes', 199, []],
  ['pdt', 'Pommes de terre', 'filet 2,5 kg', 'fruits_legumes', 249, []],
  ['butternut', 'Courge butternut', 'pièce ≈ 1,5 kg', 'fruits_legumes', 189, []],
  ['patate_douce', 'Patates douces', '1 kg', 'fruits_legumes', 249, []],
  ['choufleur', 'Chou-fleur', 'pièce', 'fruits_legumes', 199, []],
  ['brocoli', 'Brocoli', '500 g', 'fruits_legumes', 149, []],
  ['champignons', 'Champignons de Paris', '500 g', 'fruits_legumes', 199, []],
  ['endives', 'Endives', '1 kg', 'fruits_legumes', 219, []],
  ['poivrons', 'Poivrons tricolores', 'lot de 3', 'fruits_legumes', 229, []],
  ['ail', 'Ail', '3 têtes', 'fruits_legumes', 129, []],
  ['citrons', 'Citrons', 'filet 500 g', 'fruits_legumes', 149, []],
  ['pommes', 'Pommes', 'sachet 1,5 kg', 'fruits_legumes', 249, []],
  ['mache', 'Mâche', '150 g', 'fruits_legumes', 129, []],
  ['gingembre', 'Gingembre', '100 g', 'fruits_legumes', 79, []],
  ['persil', 'Persil plat', 'botte', 'fruits_legumes', 79, []],
  ['navets', 'Navets', '1 kg', 'fruits_legumes', 189, []],
  ['chou', 'Chou vert', 'pièce', 'fruits_legumes', 179, []],
  // Crèmerie
  ['oeufs', 'Œufs plein air', 'boîte de 12', 'cremerie', 279, ['oeuf']],
  ['lait', 'Lait demi-écrémé', '1 L', 'cremerie', 95, ['lactose']],
  ['beurre', 'Beurre doux', '250 g', 'cremerie', 219, ['lactose']],
  ['emmental', 'Emmental râpé', '200 g', 'cremerie', 179, ['lactose']],
  ['parmesan', 'Parmesan râpé', '100 g', 'cremerie', 219, ['lactose']],
  ['mozzarella', 'Mozzarella', '125 g', 'cremerie', 79, ['lactose']],
  ['chevre', 'Bûche de chèvre', '180 g', 'cremerie', 199, ['lactose']],
  ['creme_fraiche', 'Crème fraîche épaisse', '20 cl', 'cremerie', 109, ['lactose']],
  ['pate_brisee', 'Pâte brisée', 'rouleau 230 g', 'cremerie', 89, ['gluten', 'lactose']],
  ['pate_feuilletee', 'Pâte feuilletée', 'rouleau 230 g', 'cremerie', 95, ['gluten', 'lactose']],
  ['pesto', 'Pesto au basilic', '190 g', 'epicerie', 149, ['lactose', 'noix']],
  // Épicerie
  ['pates', 'Penne', '500 g', 'epicerie', 85, ['gluten']],
  ['spaghetti', 'Spaghetti', '500 g', 'epicerie', 85, ['gluten']],
  ['lasagnes', 'Feuilles de lasagnes', '500 g', 'epicerie', 119, ['gluten']],
  ['riz', 'Riz basmati', '1 kg', 'epicerie', 189, []],
  ['riz_rond', 'Riz rond (risotto)', '1 kg', 'epicerie', 199, []],
  ['semoule', 'Semoule de blé', '1 kg', 'epicerie', 129, ['gluten']],
  ['quinoa', 'Quinoa', '400 g', 'epicerie', 249, []],
  ['lentilles_corail', 'Lentilles corail', '500 g', 'epicerie', 169, []],
  ['lentilles_vertes', 'Lentilles vertes', '500 g', 'epicerie', 149, []],
  ['pois_chiches', 'Pois chiches', 'boîte 400 g', 'epicerie', 69, []],
  ['haricots_rouges', 'Haricots rouges', 'boîte 400 g', 'epicerie', 69, []],
  ['tomates_conc', 'Tomates concassées', 'boîte 400 g', 'epicerie', 59, []],
  ['coulis', 'Coulis de tomate', '500 g', 'epicerie', 79, []],
  ['mais', 'Maïs doux', 'boîte 300 g', 'epicerie', 79, []],
  ['thon', 'Thon au naturel', 'boîte 140 g', 'epicerie', 159, ['poisson']],
  ['gnocchis', 'Gnocchis', '500 g', 'epicerie', 119, ['gluten']],
  ['tortillas', 'Tortillas de blé', 'paquet de 8', 'epicerie', 129, ['gluten']],
  ['chataignes', 'Châtaignes cuites', '400 g', 'epicerie', 349, []],
  ['noix', 'Cerneaux de noix', '100 g', 'epicerie', 199, ['noix']],
  ['soja', 'Sauce soja', '25 cl', 'epicerie', 129, ['gluten']],
  // Arachide : marquée comme fruit à coque par prudence (le questionnaire n'a pas d'allergie arachide).
  ['beurre_cacahuete', 'Beurre de cacahuète', '350 g', 'epicerie', 249, ['noix']],
  // Placard (épices, condiments : comptés au prorata, absents de la liste de courses)
  ['curry', 'Curry en poudre', '50 g', 'placard', 99, ['epice']],
  ['cumin', 'Cumin moulu', '40 g', 'placard', 99, []],
  ['paprika', 'Paprika doux', '40 g', 'placard', 99, []],
  ['ras_el_hanout', 'Ras el hanout', '40 g', 'placard', 119, ['epice']],
  ['herbes', 'Herbes de Provence', '30 g', 'placard', 89, []],
  ['farine', 'Farine de blé', '1 kg', 'placard', 65, ['gluten']],
  ['moutarde', 'Moutarde de Dijon', '370 g', 'placard', 89, []],
  ['curcuma', 'Curcuma moulu', '40 g', 'placard', 119, []],
  // Viandes et poissons
  ['poulet', 'Filets de poulet', '600 g', 'viandes_poissons', 699, ['volaille']],
  ['cuisses', 'Cuisses de poulet', '1 kg', 'viandes_poissons', 399, ['volaille']],
  ['boeuf_hache', 'Bœuf haché 5 %', '500 g', 'viandes_poissons', 499, ['boeuf']],
  ['boeuf_mijoter', 'Bœuf à mijoter', '600 g', 'viandes_poissons', 799, ['boeuf']],
  ['lardons', 'Lardons fumés', '2 × 100 g', 'viandes_poissons', 169, ['porc']],
  ['saucisses', 'Saucisses de Toulouse', '6 pièces', 'viandes_poissons', 349, ['porc']],
  ['jambon', 'Jambon blanc', '4 tranches', 'viandes_poissons', 199, ['porc']],
  ['saumon', 'Pavés de saumon', '2 × 125 g', 'viandes_poissons', 399, ['poisson']],
  // Surgelés
  ['colin', 'Filets de colin', '400 g', 'surgeles', 349, ['poisson']],
  ['epinards', 'Épinards hachés', '1 kg', 'surgeles', 179, []],
  ['haricots_verts', 'Haricots verts extra-fins', '1 kg', 'surgeles', 189, []],
  ['petits_pois', 'Petits pois', '1 kg', 'surgeles', 169, []],
];

const PANTRY = new Set(['curcuma', 'huile', 'curry', 'cumin', 'paprika', 'ras_el_hanout', 'herbes', 'farine', 'moutarde', 'bouillon', 'soja']);

// ─── Recettes (4 parts) ───────────────────────────────────────────────────
// family : variété du plan · plat : illustration <Plat> · tags : epice, enfants, batch (le reste est déduit).
const AUTOMNE = [9, 10, 11, 12, 1, 2, 3];
const HIVER = [11, 12, 1, 2, 3];
const TOUTE_ANNEE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const R = (slug, title, description, o) => ({ slug, title, description, ...o });

const RECIPES = [
  R('soupe-poireaux-pommes-de-terre', 'Soupe de poireaux et pommes de terre', 'La soupe de grand-mère, douce et rassasiante.', {
    family: 'soupe', plat: 'soupeverte', prep: 15, cook: 30, season: AUTOMNE, tags: ['enfants', 'batch'],
    ing: [['poireaux', 1, '1 kg de poireaux'], ['pdt', 0.2, '500 g de pommes de terre'], ['oignons', 0.1, '1 oignon'], ['bouillon', 0.1, '1 cube de bouillon'], ['creme', 0.5, '10 cl de crème'], ['huile', 0.01, "1 filet d'huile d'olive"]],
    steps: [['Lave et émince les poireaux, épluche et coupe les pommes de terre en cubes.', 15], ["Fais revenir l'oignon dans l'huile, ajoute les légumes, couvre d'eau et ajoute le bouillon.", 5], ['Laisse cuire 25 min, mixe et ajoute la crème.', 25]],
  }),
  R('veloute-carottes-cumin', 'Velouté de carottes au cumin', 'Une soupe orange, sucrée et un peu parfumée.', {
    family: 'soupe', plat: 'soupe', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants', 'batch'],
    ing: [['carottes', 1, '1 kg de carottes'], ['pdt', 0.1, '1 pomme de terre'], ['oignons', 0.1, '1 oignon'], ['bouillon', 0.1, '1 cube de bouillon'], ['cumin', 0.05, '1 c. à café de cumin'], ['creme', 0.5, '10 cl de crème']],
    steps: [['Épluche et coupe les carottes, la pomme de terre et l’oignon.', 10], ["Couvre d'eau avec le bouillon et le cumin, laisse cuire 20 min.", 20], ['Mixe avec la crème, rectifie l’assaisonnement.', 2]],
  }),
  R('veloute-chou-fleur', 'Velouté de chou-fleur', 'Onctueux sans beaucoup de crème, servi avec du pain grillé.', {
    family: 'soupe', plat: 'soupe', prep: 10, cook: 20, season: AUTOMNE, tags: ['batch'],
    ing: [['choufleur', 1, '1 chou-fleur'], ['pdt', 0.1, '1 pomme de terre'], ['lait', 0.3, '30 cl de lait'], ['bouillon', 0.1, '1 cube de bouillon'], ['emmental', 0.25, '50 g d’emmental râpé'], ['pain', 1, '1 pain de campagne']],
    steps: [['Détaille le chou-fleur en bouquets, coupe la pomme de terre.', 10], ['Fais cuire 20 min dans le lait et un peu d’eau avec le bouillon.', 20], ['Mixe, parsème d’emmental et sers avec le pain grillé.', 3]],
  }),
  R('curry-pois-chiches-courge', 'Curry de pois chiches et courge', 'Un curry doux au lait de coco, encore meilleur le lendemain.', {
    family: 'curry', plat: 'curry', prep: 10, cook: 20, season: AUTOMNE, tags: ['epice', 'batch'],
    ing: [['pois_chiches', 2, '2 boîtes de pois chiches'], ['butternut', 0.5, '½ courge butternut'], ['coco', 1, '40 cl de lait de coco'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.1, '1 oignon'], ['curry', 0.1, '2 c. à café de curry'], ['riz', 0.3, '300 g de riz']],
    steps: [['Coupe la courge en cubes et émince l’oignon.', 10], ['Fais revenir l’oignon avec le curry, ajoute la courge, les tomates et le lait de coco.', 5], ['Ajoute les pois chiches égouttés, laisse mijoter 15 min. Sers avec le riz.', 15]],
  }),
  R('dahl-lentilles-corail', 'Dahl de lentilles corail', 'Le plat complet le plus économique de la semaine.', {
    family: 'legumineuses', plat: 'dahl', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['epice', 'batch'],
    ing: [['lentilles_corail', 0.6, '300 g de lentilles corail'], ['coco', 1, '40 cl de lait de coco'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.1, '1 oignon'], ['ail', 0.1, '2 gousses d’ail'], ['gingembre', 0.5, '1 morceau de gingembre'], ['curry', 0.06, '1 c. à café de curry'], ['riz', 0.3, '300 g de riz']],
    steps: [['Émince l’oignon, l’ail et le gingembre.', 5], ['Fais-les revenir avec le curry, ajoute les lentilles rincées, les tomates, le lait de coco et 30 cl d’eau.', 5], ['Laisse cuire 20 min en remuant. Sers avec le riz.', 20]],
  }),
  R('chili-sin-carne', 'Chili sin carne', 'Haricots rouges, maïs et poivrons : un chili végétal qui tient au corps.', {
    family: 'legumineuses', plat: 'curry', prep: 15, cook: 30, season: TOUTE_ANNEE, tags: ['epice', 'batch'],
    ing: [['haricots_rouges', 2, '2 boîtes de haricots rouges'], ['tomates_conc', 2, '2 boîtes de tomates concassées'], ['mais', 1, '1 boîte de maïs'], ['poivrons', 0.67, '2 poivrons'], ['oignons', 0.1, '1 oignon'], ['cumin', 0.1, '2 c. à café de cumin'], ['paprika', 0.1, '2 c. à café de paprika'], ['riz', 0.35, '350 g de riz']],
    steps: [['Coupe les poivrons et l’oignon en dés.', 10], ['Fais-les revenir avec les épices, ajoute les tomates et laisse mijoter 15 min.', 15], ['Ajoute haricots et maïs égouttés, 10 min de plus. Sers avec le riz.', 15]],
  }),
  R('parmentier-lentilles', 'Parmentier de lentilles', 'Le hachis parmentier version végétarienne, gratiné au four.', {
    family: 'gratin', plat: 'gratin', prep: 20, cook: 30, season: AUTOMNE, tags: ['enfants', 'batch'],
    ing: [['lentilles_vertes', 0.6, '300 g de lentilles vertes'], ['pdt', 0.5, '1,2 kg de pommes de terre'], ['carottes', 0.3, '3 carottes'], ['oignons', 0.1, '1 oignon'], ['lait', 0.3, '30 cl de lait'], ['beurre', 0.15, '40 g de beurre'], ['emmental', 0.3, '60 g d’emmental râpé']],
    steps: [['Fais cuire les lentilles 20 min avec les carottes et l’oignon coupés.', 20], ['Prépare une purée avec les pommes de terre cuites, le lait et le beurre.', 15], ['Lentilles au fond du plat, purée dessus, emmental, 15 min au four à 200 °C.', 15]],
  }),
  R('pates-tomate-basilic', 'Pâtes à la tomate et au basilic', 'Le grand classique du soir pressé.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['pates', 1, '500 g de penne'], ['coulis', 1, '500 g de coulis de tomate'], ['ail', 0.1, '2 gousses d’ail'], ['parmesan', 0.3, '30 g de parmesan'], ['huile', 0.01, "1 filet d'huile d'olive"]],
    steps: [['Fais cuire les pâtes.', 12], ['Pendant ce temps, fais revenir l’ail dans l’huile et ajoute le coulis.', 8], ['Mélange, parsème de parmesan.', 2]],
  }),
  R('penne-au-thon', 'Penne au thon et à la tomate', 'Un placard, dix minutes, tout le monde à table.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['pates', 1, '500 g de penne'], ['thon', 2, '2 boîtes de thon'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.1, '1 oignon'], ['herbes', 0.05, '1 c. à café d’herbes de Provence']],
    steps: [['Fais cuire les pâtes.', 12], ['Fais revenir l’oignon, ajoute les tomates, les herbes et le thon émietté.', 8], ['Mélange avec les pâtes égouttées.', 2]],
  }),
  R('gnocchis-epinards-creme', 'Gnocchis aux épinards et à la crème', 'Fondant, vert et prêt en un quart d’heure.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['gnocchis', 2, '1 kg de gnocchis'], ['epinards', 0.5, '500 g d’épinards surgelés'], ['creme', 1, '20 cl de crème'], ['parmesan', 0.3, '30 g de parmesan'], ['ail', 0.1, '1 gousse d’ail']],
    steps: [['Fais dorer les gnocchis à la poêle.', 8], ['Ajoute les épinards et l’ail, laisse fondre 5 min.', 5], ['Verse la crème, parsème de parmesan.', 2]],
  }),
  R('pates-pesto-brocoli', 'Pâtes au pesto et brocoli', 'Le brocoli cuit avec les pâtes, une seule casserole.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: AUTOMNE, tags: ['enfants'],
    ing: [['pates', 1, '500 g de penne'], ['brocoli', 1, '500 g de brocoli'], ['pesto', 1, '1 pot de pesto'], ['parmesan', 0.2, '20 g de parmesan']],
    steps: [['Détaille le brocoli en petits bouquets.', 5], ['Plonge-les avec les pâtes dans l’eau bouillante.', 12], ['Égoutte, mélange avec le pesto et le parmesan.', 2]],
  }),
  R('pates-champignons-creme', 'Pâtes aux champignons et à la crème', 'Des champignons dorés, de la crème, du persil.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: AUTOMNE, tags: [],
    ing: [['pates', 1, '500 g de penne'], ['champignons', 1, '500 g de champignons'], ['creme', 1, '20 cl de crème'], ['ail', 0.1, '1 gousse d’ail'], ['persil', 1, '1 botte de persil']],
    steps: [['Fais cuire les pâtes.', 12], ['Fais dorer les champignons émincés avec l’ail.', 8], ['Ajoute la crème et le persil, mélange avec les pâtes.', 2]],
  }),
  R('spaghetti-bolognaise', 'Spaghetti bolognaise', 'La sauce mijote pendant que tu mets la table.', {
    family: 'pates', plat: 'pates', prep: 15, cook: 30, season: TOUTE_ANNEE, tags: ['enfants', 'batch'],
    ing: [['spaghetti', 1, '500 g de spaghetti'], ['boeuf_hache', 1, '500 g de bœuf haché'], ['coulis', 1, '500 g de coulis de tomate'], ['carottes', 0.1, '1 carotte'], ['oignons', 0.1, '1 oignon'], ['parmesan', 0.2, '20 g de parmesan']],
    steps: [['Hache l’oignon et la carotte, fais-les revenir avec la viande.', 10], ['Ajoute le coulis, laisse mijoter 20 min.', 20], ['Fais cuire les spaghetti, sers avec le parmesan.', 12]],
  }),
  R('lasagnes-vegetariennes', 'Lasagnes végétariennes', 'Épinards, champignons et mozzarella, en grandes parts.', {
    family: 'pates', plat: 'lasagnes', prep: 25, cook: 40, season: AUTOMNE, tags: ['enfants', 'batch'],
    ing: [['lasagnes', 0.5, '250 g de feuilles de lasagnes'], ['epinards', 0.5, '500 g d’épinards surgelés'], ['champignons', 0.5, '250 g de champignons'], ['coulis', 2, '1 kg de coulis de tomate'], ['mozzarella', 2, '2 mozzarellas'], ['emmental', 0.5, '100 g d’emmental râpé']],
    steps: [['Fais revenir les champignons et les épinards.', 10], ['Monte les couches : sauce, feuilles, légumes, mozzarella. Termine par l’emmental.', 15], ['40 min au four à 180 °C.', 40]],
  }),
  R('gratin-butternut', 'Gratin de courge butternut', 'Fondant, doré, parfait avec une salade verte.', {
    family: 'gratin', plat: 'gratin', prep: 15, cook: 40, season: AUTOMNE, tags: ['enfants'],
    ing: [['butternut', 1, '1 courge butternut'], ['pdt', 0.1, '2 pommes de terre'], ['creme_fraiche', 1, '20 cl de crème fraîche'], ['emmental', 0.5, '100 g d’emmental râpé'], ['ail', 0.1, '1 gousse d’ail']],
    steps: [['Épluche la courge et les pommes de terre, coupe-les en fines tranches.', 15], ['Dispose-les dans un plat frotté d’ail, nappe de crème, parsème d’emmental.', 5], ['40 min au four à 190 °C.', 40]],
  }),
  R('gratin-chou-fleur', 'Gratin de chou-fleur', 'Une béchamel légère et beaucoup de légumes.', {
    family: 'gratin', plat: 'gratin', prep: 15, cook: 30, season: AUTOMNE, tags: ['enfants'],
    ing: [['choufleur', 1, '1 chou-fleur'], ['lait', 0.5, '50 cl de lait'], ['beurre', 0.2, '50 g de beurre'], ['farine', 0.05, '50 g de farine'], ['emmental', 0.5, '100 g d’emmental râpé']],
    steps: [['Fais cuire les bouquets de chou-fleur 10 min à l’eau.', 10], ['Prépare la béchamel : beurre, farine, puis lait en fouettant.', 10], ['Nappe le chou-fleur, parsème d’emmental, 20 min au four à 200 °C.', 20]],
  }),
  R('hachis-parmentier', 'Hachis parmentier', 'Le plat du dimanche qui fait deux repas.', {
    family: 'gratin', plat: 'gratin', prep: 25, cook: 30, season: AUTOMNE, tags: ['enfants', 'batch'],
    ing: [['boeuf_hache', 1, '500 g de bœuf haché'], ['pdt', 0.5, '1,2 kg de pommes de terre'], ['lait', 0.3, '30 cl de lait'], ['beurre', 0.2, '50 g de beurre'], ['emmental', 0.5, '100 g d’emmental râpé'], ['oignons', 0.1, '1 oignon']],
    steps: [['Fais cuire les pommes de terre et prépare la purée avec le lait et le beurre.', 25], ['Fais revenir l’oignon et la viande.', 10], ['Viande au fond, purée dessus, emmental, 20 min au four à 200 °C.', 20]],
  }),
  R('endives-jambon', 'Endives au jambon', 'Le gratin d’hiver par excellence.', {
    family: 'gratin', plat: 'gratin', prep: 15, cook: 40, season: HIVER, tags: ['enfants'],
    ing: [['endives', 1, '8 endives'], ['jambon', 2, '8 tranches de jambon'], ['lait', 0.5, '50 cl de lait'], ['beurre', 0.2, '50 g de beurre'], ['farine', 0.05, '50 g de farine'], ['emmental', 0.5, '100 g d’emmental râpé']],
    steps: [['Fais cuire les endives 15 min à l’eau, égoutte-les bien.', 15], ['Roule chaque endive dans une tranche de jambon. Prépare la béchamel.', 10], ['Nappe, parsème d’emmental, 25 min au four à 200 °C.', 25]],
  }),
  R('saumon-haricots-verts', 'Saumon, haricots verts et citron', 'Un poisson simple, cuit en 10 minutes.', {
    family: 'poisson', plat: 'poisson', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: [],
    ing: [['saumon', 2, '4 pavés de saumon'], ['haricots_verts', 0.6, '600 g de haricots verts'], ['citrons', 0.3, '1 citron'], ['riz', 0.3, '300 g de riz'], ['beurre', 0.1, '25 g de beurre']],
    steps: [['Fais cuire le riz et les haricots verts.', 15], ['Saisis les pavés de saumon 4 min de chaque côté.', 8], ['Arrose de citron et d’une noisette de beurre.', 1]],
  }),
  R('colin-puree-carottes', 'Colin, purée maison et carottes', 'Un poisson doux que les enfants aiment bien.', {
    family: 'poisson', plat: 'poisson', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['colin', 1, '400 g de colin'], ['pdt', 0.4, '1 kg de pommes de terre'], ['lait', 0.2, '20 cl de lait'], ['beurre', 0.15, '40 g de beurre'], ['carottes', 0.3, '3 carottes']],
    steps: [['Fais cuire pommes de terre et carottes à l’eau.', 20], ['Fais cuire le colin 8 min à la poêle.', 8], ['Écrase les pommes de terre avec le lait et le beurre.', 5]],
  }),
  R('omelette-herbes-salade', 'Omelette aux herbes et salade', 'Dix minutes, et un vrai repas.', {
    family: 'oeufs', plat: 'omelette', prep: 10, cook: 10, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['oeufs', 0.75, '9 œufs'], ['persil', 1, '1 botte de persil'], ['emmental', 0.25, '50 g d’emmental râpé'], ['mache', 1, '1 sachet de mâche'], ['pain', 1, '1 pain de campagne']],
    steps: [['Bats les œufs avec le persil ciselé et l’emmental.', 5], ['Fais cuire l’omelette à feu moyen.', 6], ['Sers avec la mâche et le pain.', 2]],
  }),
  R('tortilla-pommes-de-terre', 'Tortilla de pommes de terre', 'L’omelette épaisse à l’espagnole, chaude ou froide.', {
    family: 'oeufs', plat: 'omelette', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['oeufs', 0.67, '8 œufs'], ['pdt', 0.3, '750 g de pommes de terre'], ['oignons', 0.2, '2 oignons'], ['mache', 1, '1 sachet de mâche'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Coupe les pommes de terre en fines rondelles, émince les oignons.', 8], ['Fais-les cuire 12 min à la poêle dans l’huile.', 12], ['Verse les œufs battus, cuis 5 min de chaque côté.', 10]],
  }),
  R('riz-saute-legumes', 'Riz sauté aux légumes', 'Le meilleur moyen d’utiliser un reste de riz.', {
    family: 'cereales', plat: 'riz', prep: 15, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['riz', 0.35, '350 g de riz'], ['oeufs', 0.33, '4 œufs'], ['petits_pois', 0.3, '300 g de petits pois'], ['carottes', 0.3, '3 carottes'], ['oignons', 0.1, '1 oignon'], ['soja', 0.3, '5 c. à soupe de sauce soja'], ['huile', 0.02, "2 c. à soupe d'huile"]],
    steps: [['Fais cuire le riz (ou utilise un reste).', 12], ['Fais sauter carottes, oignon et petits pois, ajoute le riz.', 8], ['Ajoute les œufs brouillés et la sauce soja.', 3]],
  }),
  R('risotto-champignons', 'Risotto aux champignons', 'Crémeux, sans crème, avec du parmesan.', {
    family: 'cereales', plat: 'riz', prep: 10, cook: 20, season: AUTOMNE, tags: [],
    ing: [['riz_rond', 0.35, '350 g de riz rond'], ['champignons', 1, '500 g de champignons'], ['oignons', 0.1, '1 oignon'], ['bouillon', 0.2, '2 cubes de bouillon'], ['parmesan', 0.5, '50 g de parmesan'], ['beurre', 0.1, '25 g de beurre']],
    steps: [['Fais revenir l’oignon et les champignons dans le beurre.', 5], ['Ajoute le riz, puis le bouillon louche par louche en remuant.', 18], ['Hors du feu, ajoute le parmesan.', 2]],
  }),
  R('couscous-legumes', 'Couscous de légumes', 'Des légumes d’hiver, des pois chiches, de la semoule.', {
    family: 'cereales', plat: 'riz', prep: 20, cook: 40, season: AUTOMNE, tags: ['batch'],
    ing: [['semoule', 0.4, '400 g de semoule'], ['pois_chiches', 1, '1 boîte de pois chiches'], ['carottes', 0.4, '4 carottes'], ['navets', 0.5, '4 navets'], ['butternut', 0.4, '½ courge butternut'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['ras_el_hanout', 0.1, '2 c. à café de ras el hanout']],
    steps: [['Coupe les légumes en gros morceaux.', 20], ['Fais-les mijoter 35 min avec les tomates, les épices et 1 L d’eau.', 35], ['Ajoute les pois chiches, prépare la semoule.', 5]],
  }),
  R('tarte-poireaux', 'Tarte aux poireaux', 'Fondue de poireaux et crème sur pâte brisée.', {
    family: 'tarte', plat: 'tarte', prep: 20, cook: 35, season: AUTOMNE, tags: [],
    ing: [['pate_brisee', 1, '1 pâte brisée'], ['poireaux', 0.8, '800 g de poireaux'], ['oeufs', 0.25, '3 œufs'], ['creme', 1, '20 cl de crème'], ['emmental', 0.5, '100 g d’emmental râpé']],
    steps: [['Émince les poireaux et fais-les fondre 15 min à la poêle.', 20], ['Bats les œufs avec la crème, ajoute les poireaux et l’emmental.', 5], ['Verse sur la pâte, 35 min au four à 180 °C.', 35]],
  }),
  R('quiche-lorraine', 'Quiche lorraine', 'La vraie, avec des lardons et beaucoup de crème.', {
    family: 'tarte', plat: 'tarte', prep: 15, cook: 35, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['pate_brisee', 1, '1 pâte brisée'], ['lardons', 1, '200 g de lardons'], ['oeufs', 0.25, '3 œufs'], ['creme', 1, '20 cl de crème'], ['lait', 0.2, '20 cl de lait'], ['mache', 1, '1 sachet de mâche']],
    steps: [['Fais dorer les lardons à la poêle.', 5], ['Bats œufs, crème et lait, ajoute les lardons.', 5], ['Verse sur la pâte, 35 min au four à 180 °C. Sers avec la mâche.', 35]],
  }),
  R('tarte-fine-butternut-chevre', 'Tarte fine butternut et chèvre', 'Sucré-salé, croustillante, avec des noix.', {
    family: 'tarte', plat: 'tarte', prep: 15, cook: 30, season: AUTOMNE, tags: [],
    ing: [['pate_feuilletee', 1, '1 pâte feuilletée'], ['butternut', 0.5, '½ courge butternut'], ['chevre', 1, '1 bûche de chèvre'], ['noix', 0.3, '30 g de cerneaux de noix'], ['herbes', 0.03, '1 pincée d’herbes de Provence'], ['mache', 1, '1 sachet de mâche']],
    steps: [['Coupe la courge en très fines tranches.', 10], ['Dispose-les sur la pâte avec le chèvre en rondelles et les noix.', 5], ['30 min au four à 200 °C. Sers avec la mâche.', 30]],
  }),
  R('salade-lentilles-feta', 'Salade de lentilles et feta', 'Tiède en hiver, froide en été, toujours rassasiante.', {
    family: 'salade', plat: 'salade', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: [],
    ing: [['lentilles_vertes', 0.6, '300 g de lentilles vertes'], ['feta', 1, '200 g de feta'], ['carottes', 0.2, '2 carottes'], ['oignons', 0.05, '½ oignon rouge'], ['persil', 1, '1 botte de persil'], ['moutarde', 0.05, '1 c. à soupe de moutarde'], ['huile', 0.02, "3 c. à soupe d'huile d'olive"]],
    steps: [['Fais cuire les lentilles 20 min.', 20], ['Râpe les carottes, cisèle le persil et l’oignon.', 8], ['Mélange avec la feta émiettée et la vinaigrette moutarde.', 3]],
  }),
  R('salade-quinoa-patate-douce', 'Salade tiède de quinoa et patate douce', 'Patate douce rôtie, mâche, feta et noix.', {
    family: 'salade', plat: 'salade', prep: 15, cook: 25, season: AUTOMNE, tags: [],
    ing: [['quinoa', 0.6, '250 g de quinoa'], ['patate_douce', 0.5, '2 patates douces'], ['mache', 1, '1 sachet de mâche'], ['feta', 0.5, '100 g de feta'], ['noix', 0.3, '30 g de cerneaux de noix'], ['huile', 0.02, "3 c. à soupe d'huile d'olive"], ['moutarde', 0.03, '1 c. à café de moutarde']],
    steps: [['Rôtis la patate douce en cubes 25 min à 200 °C.', 25], ['Fais cuire le quinoa 12 min.', 12], ['Mélange tout avec la mâche, la feta, les noix et la vinaigrette.', 5]],
  }),
  R('salade-endives-pommes-noix', 'Salade d’endives, pommes et noix', 'Croquante, avec du chèvre et du pain grillé.', {
    family: 'salade', plat: 'salade', prep: 15, cook: 0, season: HIVER, tags: [],
    ing: [['endives', 0.6, '5 endives'], ['pommes', 0.3, '2 pommes'], ['noix', 0.5, '50 g de cerneaux de noix'], ['chevre', 1, '1 bûche de chèvre'], ['pain', 1, '1 pain de campagne'], ['moutarde', 0.05, '1 c. à soupe de moutarde'], ['huile', 0.02, "3 c. à soupe d'huile d'olive"]],
    steps: [['Émince les endives, coupe les pommes en lamelles.', 10], ['Fais griller le pain avec le chèvre dessus.', 5], ['Mélange avec les noix et la vinaigrette moutarde.', 2]],
  }),
  R('legumes-rotis-pois-chiches', 'Légumes rôtis et pois chiches', 'Tout cuit sur la même plaque, avec un peu de feta.', {
    family: 'four', plat: 'salade', prep: 15, cook: 35, season: AUTOMNE, tags: ['batch'],
    ing: [['patate_douce', 0.5, '2 patates douces'], ['carottes', 0.4, '4 carottes'], ['oignons', 0.2, '2 oignons rouges'], ['pois_chiches', 2, '2 boîtes de pois chiches'], ['feta', 0.5, '100 g de feta'], ['cumin', 0.05, '1 c. à café de cumin'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Coupe les légumes en morceaux, égoutte les pois chiches.', 15], ['Mélange avec l’huile et le cumin sur une plaque, 35 min à 200 °C.', 35], ['Parsème de feta émiettée.', 1]],
  }),
  R('potimarron-chataignes-rotis', 'Potimarron et châtaignes rôtis', 'Le goût de l’automne, avec de la feta et des herbes.', {
    family: 'four', plat: 'gratin', prep: 15, cook: 35, season: [10, 11, 12], tags: ['enfants'],
    ing: [['potimarron', 1, '1 potimarron'], ['chataignes', 1, '400 g de châtaignes cuites'], ['oignons', 0.2, '2 oignons rouges'], ['feta', 0.5, '100 g de feta'], ['herbes', 0.05, '1 c. à café d’herbes'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Coupe le potimarron en quartiers (sans l’éplucher) et les oignons.', 15], ['Rôtis 25 min à 200 °C, ajoute les châtaignes, encore 10 min.', 35], ['Parsème de feta et d’herbes.', 1]],
  }),
  R('cuisses-poulet-roties', 'Cuisses de poulet rôties et pommes de terre', 'Tout au four : on enfourne et on s’occupe d’autre chose.', {
    family: 'four', plat: 'gratin', prep: 10, cook: 45, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['cuisses', 1, '4 cuisses de poulet'], ['pdt', 0.4, '1 kg de pommes de terre'], ['oignons', 0.1, '1 oignon'], ['herbes', 0.05, '1 c. à café d’herbes de Provence'], ['haricots_verts', 0.5, '500 g de haricots verts'], ['huile', 0.02, "2 c. à soupe d'huile"]],
    steps: [['Coupe les pommes de terre en quartiers, dispose-les avec le poulet.', 10], ['Arrose d’huile, d’herbes, 45 min au four à 200 °C.', 45], ['Fais cuire les haricots verts 10 min.', 10]],
  }),
  R('poulet-lait-de-coco', 'Poulet au lait de coco', 'Un curry doux, poivrons et riz basmati.', {
    family: 'curry', plat: 'curry', prep: 15, cook: 25, season: TOUTE_ANNEE, tags: ['epice'],
    ing: [['poulet', 0.67, '400 g de filets de poulet'], ['coco', 1, '40 cl de lait de coco'], ['poivrons', 0.67, '2 poivrons'], ['oignons', 0.1, '1 oignon'], ['curry', 0.08, '2 c. à café de curry'], ['riz', 0.35, '350 g de riz']],
    steps: [['Coupe le poulet et les poivrons en morceaux.', 10], ['Fais dorer le poulet avec l’oignon et le curry, ajoute les poivrons.', 10], ['Verse le lait de coco, laisse mijoter 15 min. Sers avec le riz.', 15]],
  }),
  R('curry-legumes', 'Curry de légumes', 'Chou-fleur, patate douce et petits pois au lait de coco.', {
    family: 'curry', plat: 'curry', prep: 15, cook: 30, season: AUTOMNE, tags: ['epice', 'batch'],
    ing: [['choufleur', 1, '1 chou-fleur'], ['patate_douce', 0.5, '2 patates douces'], ['petits_pois', 0.3, '300 g de petits pois'], ['coco', 1, '40 cl de lait de coco'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['curry', 0.08, '2 c. à café de curry'], ['riz', 0.35, '350 g de riz']],
    steps: [['Coupe les légumes en morceaux.', 15], ['Fais-les revenir avec le curry, ajoute tomates et lait de coco.', 5], ['Laisse mijoter 25 min, ajoute les petits pois. Sers avec le riz.', 25]],
  }),
  R('poulet-basquaise', 'Poulet basquaise', 'Des poivrons fondants et une sauce tomate au paprika.', {
    family: 'mijote', plat: 'curry', prep: 15, cook: 40, season: TOUTE_ANNEE, tags: [],
    ing: [['cuisses', 1, '4 cuisses de poulet'], ['poivrons', 1, '3 poivrons'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.2, '2 oignons'], ['ail', 0.1, '2 gousses d’ail'], ['paprika', 0.05, '1 c. à café de paprika'], ['riz', 0.35, '350 g de riz']],
    steps: [['Fais dorer les cuisses de poulet dans une cocotte.', 10], ['Ajoute oignons, ail et poivrons émincés, puis les tomates et le paprika.', 10], ['Laisse mijoter 35 min à couvert. Sers avec le riz.', 35]],
  }),
  R('chili-con-carne', 'Chili con carne', 'Le chili du week-end, qui se congèle très bien.', {
    family: 'mijote', plat: 'curry', prep: 15, cook: 40, season: TOUTE_ANNEE, tags: ['epice', 'batch'],
    ing: [['boeuf_hache', 1, '500 g de bœuf haché'], ['haricots_rouges', 2, '2 boîtes de haricots rouges'], ['tomates_conc', 2, '2 boîtes de tomates concassées'], ['oignons', 0.1, '1 oignon'], ['cumin', 0.1, '2 c. à café de cumin'], ['riz', 0.35, '350 g de riz']],
    steps: [['Fais revenir l’oignon et la viande avec le cumin.', 10], ['Ajoute les tomates, laisse mijoter 25 min.', 25], ['Ajoute les haricots égouttés, 10 min de plus. Sers avec le riz.', 10]],
  }),
  R('saucisses-lentilles', 'Saucisses aux lentilles', 'Un plat de bistrot, simple et réconfortant.', {
    family: 'mijote', plat: 'dahl', prep: 10, cook: 40, season: AUTOMNE, tags: ['batch'],
    ing: [['saucisses', 1, '6 saucisses de Toulouse'], ['lentilles_vertes', 0.6, '300 g de lentilles vertes'], ['carottes', 0.3, '3 carottes'], ['oignons', 0.1, '1 oignon'], ['bouillon', 0.1, '1 cube de bouillon']],
    steps: [['Fais dorer les saucisses dans une cocotte.', 10], ['Ajoute oignon, carottes, lentilles, bouillon et 80 cl d’eau.', 5], ['Laisse mijoter 35 min à couvert.', 35]],
  }),
  R('boeuf-bourguignon', 'Bœuf bourguignon', 'Le plat du dimanche, qui mijote tout l’après-midi.', {
    family: 'mijote', plat: 'curry', prep: 25, cook: 150, season: HIVER, tags: ['batch'],
    ing: [['boeuf_mijoter', 1, '600 g de bœuf à mijoter'], ['carottes', 0.4, '4 carottes'], ['champignons', 0.5, '250 g de champignons'], ['oignons', 0.1, '1 oignon'], ['lardons', 0.5, '100 g de lardons'], ['pdt', 0.3, '750 g de pommes de terre'], ['bouillon', 0.1, '1 cube de bouillon']],
    steps: [['Fais dorer la viande et les lardons dans une cocotte.', 15], ['Ajoute légumes, bouillon et eau à hauteur, laisse mijoter 2 h 30 à feu doux.', 150], ['Fais cuire les pommes de terre pour l’accompagnement.', 25]],
  }),
  R('fajitas-poulet-poivrons', 'Fajitas de poulet aux poivrons', 'Chacun garnit sa tortilla à table.', {
    family: 'wrap', plat: 'riz', prep: 15, cook: 15, season: TOUTE_ANNEE, tags: ['epice', 'enfants'],
    ing: [['tortillas', 1, '8 tortillas'], ['poulet', 0.67, '400 g de filets de poulet'], ['poivrons', 1, '3 poivrons'], ['oignons', 0.1, '1 oignon'], ['paprika', 0.1, '2 c. à café de paprika'], ['cumin', 0.05, '1 c. à café de cumin']],
    steps: [['Émince le poulet, les poivrons et l’oignon.', 10], ['Fais-les sauter avec les épices.', 12], ['Réchauffe les tortillas et garnis-les.', 3]],
  }),
  // Sans lactose, sans gluten et rapides : pour que les foyers aux préférences cumulées aient assez de choix.
  R('soupe-lentilles-corail-carottes', 'Soupe de lentilles corail et carottes', 'Épaisse, douce, relevée d’un trait de citron.', {
    family: 'soupe', plat: 'soupe', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['batch'],
    ing: [['lentilles_corail', 0.4, '200 g de lentilles corail'], ['carottes', 0.5, '5 carottes'], ['oignons', 0.1, '1 oignon'], ['cumin', 0.05, '1 c. à café de cumin'], ['bouillon', 0.1, '1 cube de bouillon'], ['citrons', 0.2, '½ citron']],
    steps: [['Épluche et coupe les carottes et l’oignon.', 10], ['Fais cuire 20 min avec les lentilles rincées, le cumin, le bouillon et 1 L d’eau.', 20], ['Mixe et ajoute le jus de citron.', 2]],
  }),
  R('soupe-butternut-coco', 'Soupe de butternut au lait de coco', 'Veloutée sans crème, parfumée au gingembre.', {
    family: 'soupe', plat: 'soupe', prep: 10, cook: 20, season: AUTOMNE, tags: ['enfants', 'batch'],
    ing: [['butternut', 1, '1 courge butternut'], ['coco', 1, '40 cl de lait de coco'], ['oignons', 0.1, '1 oignon'], ['gingembre', 0.3, '1 petit morceau de gingembre'], ['bouillon', 0.1, '1 cube de bouillon']],
    steps: [['Épluche la courge et coupe-la en cubes.', 10], ['Fais cuire 20 min avec l’oignon, le gingembre, le bouillon et 60 cl d’eau.', 20], ['Mixe avec le lait de coco.', 2]],
  }),
  R('poelee-pommes-de-terre-champignons', 'Poêlée de pommes de terre et champignons', 'Dorée à la poêle, avec beaucoup de persil et d’ail.', {
    family: 'poelee', plat: 'gratin', prep: 10, cook: 20, season: AUTOMNE, tags: ['enfants'],
    ing: [['pdt', 0.4, '1 kg de pommes de terre'], ['champignons', 1, '500 g de champignons'], ['persil', 1, '1 botte de persil'], ['ail', 0.1, '2 gousses d’ail'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"], ['mache', 1, '1 sachet de mâche']],
    steps: [['Coupe les pommes de terre en petits cubes.', 8], ['Fais-les dorer 15 min, ajoute les champignons émincés et l’ail.', 20], ['Parsème de persil, sers avec la mâche.', 2]],
  }),
  R('chou-saute-pommes-de-terre', 'Chou sauté aux pommes de terre et cumin', 'Un plat d’hiver simple et parfumé.', {
    family: 'poelee', plat: 'soupeverte', prep: 10, cook: 20, season: HIVER, tags: [],
    ing: [['chou', 1, '1 chou vert'], ['pdt', 0.3, '750 g de pommes de terre'], ['oignons', 0.1, '1 oignon'], ['cumin', 0.05, '1 c. à café de cumin'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Émince le chou, coupe les pommes de terre en dés.', 10], ['Fais dorer les pommes de terre et l’oignon 10 min.', 10], ['Ajoute le chou et le cumin, couvre et laisse cuire 10 min.', 10]],
  }),
  R('salade-pois-chiches-citron', 'Salade de pois chiches, carottes et citron', 'Fraîche, croquante, prête sans cuisson.', {
    family: 'salade', plat: 'salade', prep: 15, cook: 0, season: TOUTE_ANNEE, tags: [],
    ing: [['pois_chiches', 2, '2 boîtes de pois chiches'], ['carottes', 0.3, '3 carottes'], ['persil', 1, '1 botte de persil'], ['citrons', 0.3, '1 citron'], ['cumin', 0.05, '1 c. à café de cumin'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Rince et égoutte les pois chiches, râpe les carottes.', 10], ['Cisèle le persil.', 3], ['Mélange avec le jus de citron, l’huile et le cumin.', 2]],
  }),
  R('taboule-quinoa-hiver', 'Taboulé d’hiver au quinoa', 'Quinoa, pomme, carotte et persil, citronné.', {
    family: 'salade', plat: 'salade', prep: 15, cook: 12, season: AUTOMNE, tags: [],
    ing: [['quinoa', 0.6, '250 g de quinoa'], ['pommes', 0.2, '1 pomme'], ['carottes', 0.2, '2 carottes'], ['persil', 1, '1 botte de persil'], ['citrons', 0.3, '1 citron'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Fais cuire le quinoa 12 min, laisse tiédir.', 12], ['Coupe la pomme et râpe les carottes, cisèle le persil.', 10], ['Mélange avec le citron et l’huile.', 2]],
  }),
  R('riz-haricots-rouges-mais', 'Riz aux haricots rouges et maïs', 'Un riz complet en un plat, façon Louisiane.', {
    family: 'cereales', plat: 'riz', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['riz', 0.35, '350 g de riz'], ['haricots_rouges', 2, '2 boîtes de haricots rouges'], ['mais', 1, '1 boîte de maïs'], ['poivrons', 0.67, '2 poivrons'], ['oignons', 0.1, '1 oignon'], ['paprika', 0.05, '1 c. à café de paprika']],
    steps: [['Fais cuire le riz.', 15], ['Fais revenir l’oignon et les poivrons avec le paprika.', 10], ['Ajoute haricots et maïs égouttés, mélange avec le riz.', 3]],
  }),
  R('quinoa-saute-legumes', 'Quinoa sauté aux légumes et pois chiches', 'Comme un riz sauté, sans gluten.', {
    family: 'cereales', plat: 'riz', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: [],
    ing: [['quinoa', 0.6, '250 g de quinoa'], ['carottes', 0.3, '3 carottes'], ['petits_pois', 0.3, '300 g de petits pois'], ['pois_chiches', 1, '1 boîte de pois chiches'], ['cumin', 0.05, '1 c. à café de cumin'], ['huile', 0.02, "2 c. à soupe d'huile"]],
    steps: [['Fais cuire le quinoa 12 min.', 12], ['Fais sauter carottes et petits pois 8 min avec le cumin.', 8], ['Ajoute pois chiches et quinoa, mélange.', 3]],
  }),
  R('omelette-champignons', 'Omelette aux champignons', 'Des champignons dorés et une omelette baveuse.', {
    family: 'oeufs', plat: 'omelette', prep: 10, cook: 10, season: AUTOMNE, tags: ['enfants'],
    ing: [['oeufs', 0.67, '8 œufs'], ['champignons', 0.5, '250 g de champignons'], ['persil', 1, '1 botte de persil'], ['mache', 1, '1 sachet de mâche'], ['huile', 0.02, "2 c. à soupe d'huile d'olive"]],
    steps: [['Fais dorer les champignons émincés.', 5], ['Verse les œufs battus avec le persil, cuis à feu moyen.', 6], ['Sers avec la mâche.', 1]],
  }),
  R('spaghetti-epinards-tomate', 'Spaghetti aux épinards et à la tomate', 'Une sauce express, sans fromage.', {
    family: 'pates', plat: 'pates', prep: 5, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['spaghetti', 1, '500 g de spaghetti'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['epinards', 0.4, '400 g d’épinards surgelés'], ['ail', 0.15, '3 gousses d’ail'], ['huile', 0.03, "3 c. à soupe d'huile d'olive"]],
    steps: [['Fais cuire les spaghetti.', 12], ['Fais revenir l’ail, ajoute les épinards puis les tomates, 8 min.', 8], ['Mélange avec les pâtes.', 1]],
  }),
  R('colin-citron-riz', 'Colin au citron, riz et haricots verts', 'Un poisson léger, cuit au four en 15 minutes.', {
    family: 'poisson', plat: 'poisson', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants'],
    ing: [['colin', 1, '400 g de colin'], ['citrons', 0.3, '1 citron'], ['riz', 0.3, '300 g de riz'], ['haricots_verts', 0.5, '500 g de haricots verts'], ['huile', 0.02, "2 c. à soupe d'huile d'olive"]],
    steps: [['Fais cuire le riz et les haricots verts.', 15], ['Dispose le colin dans un plat avec l’huile et des rondelles de citron, 15 min à 200 °C.', 15], ['Sers aussitôt.', 1]],
  }),
  // ─── Cuisines du monde (demande du 08/11/2026) ───
  R('rougail-saucisses', 'Rougail saucisses', 'Le plat du dimanche à La Réunion : saucisses mijotées à la tomate, riz blanc.', {
    family: 'mijote', plat: 'curry', prep: 15, cook: 35, season: TOUTE_ANNEE, tags: ['batch'], cuisine: 'reunionnaise',
    ing: [['saucisses', 1, '6 saucisses'], ['tomates_conc', 2, '2 boîtes de tomates concassées'], ['oignons', 0.2, '2 oignons'], ['ail', 0.1, '3 gousses d’ail'], ['gingembre', 0.2, '20 g de gingembre'], ['riz', 0.3, '300 g de riz'], ['huile', 0.03, '3 c. à soupe d’huile']],
    steps: [['Pique les saucisses et fais-les bouillir 5 min pour les dessaler, puis coupe-les en rondelles.', 8], ['Fais-les dorer dans une cocotte avec l’huile, ajoute l’oignon émincé, l’ail et le gingembre pilés.', 7], ['Ajoute les tomates et laisse mijoter 25 min à couvert. Sers avec le riz, le piment à part.', 25]],
  }),
  R('cari-poulet', 'Cari de poulet', 'Le cari réunionnais : poulet mijoté au curcuma, tomate et gingembre.', {
    family: 'curry', plat: 'curry', prep: 15, cook: 40, season: TOUTE_ANNEE, tags: ['enfants', 'batch'], cuisine: 'reunionnaise',
    ing: [['cuisses', 1, '1 kg de cuisses de poulet'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.2, '2 oignons'], ['ail', 0.1, '3 gousses d’ail'], ['gingembre', 0.2, '20 g de gingembre'], ['curcuma', 0.1, '1 c. à soupe de curcuma'], ['riz', 0.3, '300 g de riz'], ['huile', 0.03, '3 c. à soupe d’huile']],
    steps: [['Fais dorer les morceaux de poulet dans l’huile, dans une cocotte.', 10], ['Ajoute l’oignon, l’ail et le gingembre pilés, puis le curcuma : remue 2 min.', 5], ['Ajoute les tomates, couvre et laisse mijoter 30 min. Sers avec le riz.', 30]],
  }),
  R('cari-lentilles', 'Cari de lentilles et riz', 'Les grains à la réunionnaise : lentilles mijotées au curcuma, riz blanc.', {
    family: 'legumineuses', plat: 'dahl', prep: 10, cook: 35, season: TOUTE_ANNEE, tags: ['batch'], cuisine: 'reunionnaise',
    ing: [['lentilles_vertes', 1, '500 g de lentilles'], ['oignons', 0.2, '2 oignons'], ['ail', 0.1, '3 gousses d’ail'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['curcuma', 0.1, '1 c. à soupe de curcuma'], ['gingembre', 0.1, '10 g de gingembre'], ['riz', 0.3, '300 g de riz'], ['huile', 0.03, '3 c. à soupe d’huile']],
    steps: [['Fais revenir l’oignon, l’ail et le gingembre dans l’huile, ajoute le curcuma.', 5], ['Ajoute les lentilles, les tomates et 1 L d’eau : laisse cuire 30 min à petit feu.', 30], ['Fais cuire le riz et sers ensemble.', 15]],
  }),
  R('colombo-poulet', 'Colombo de poulet', 'Le colombo des Antilles : poulet et pommes de terre aux épices, citron.', {
    family: 'curry', plat: 'curry', prep: 15, cook: 40, season: TOUTE_ANNEE, tags: ['epice'], cuisine: 'iles',
    ing: [['poulet', 1, '600 g de filets de poulet'], ['pdt', 0.2, '500 g de pommes de terre'], ['oignons', 0.2, '2 oignons'], ['ail', 0.1, '3 gousses d’ail'], ['curry', 0.1, '2 c. à soupe de poudre à colombo (ou curry)'], ['citrons', 0.5, '2 citrons'], ['riz', 0.3, '300 g de riz'], ['huile', 0.03, '3 c. à soupe d’huile']],
    steps: [['Coupe le poulet en morceaux et fais-le mariner 10 min avec le jus d’un citron et l’ail.', 10], ['Fais dorer le poulet et l’oignon dans l’huile, ajoute la poudre à colombo.', 8], ['Ajoute les pommes de terre en cubes et 40 cl d’eau, laisse mijoter 30 min. Sers avec le riz.', 30]],
  }),
  R('colin-coco-citron', 'Colin au lait de coco et citron', 'Un poisson des îles, doux et parfumé, prêt en 30 minutes.', {
    family: 'poisson', plat: 'poisson', prep: 10, cook: 20, season: TOUTE_ANNEE, tags: ['enfants'], cuisine: 'iles',
    ing: [['colin', 1.5, '600 g de filets de colin'], ['coco', 1, '40 cl de lait de coco'], ['citrons', 0.5, '2 citrons'], ['oignons', 0.1, '1 oignon'], ['gingembre', 0.2, '20 g de gingembre'], ['riz', 0.3, '300 g de riz'], ['huile', 0.02, '2 c. à soupe d’huile']],
    steps: [['Fais cuire le riz.', 15], ['Fais revenir l’oignon et le gingembre dans l’huile, verse le lait de coco et le jus des citrons.', 5], ['Ajoute le colin en morceaux et laisse frémir 10 min. Sers avec le riz.', 10]],
  }),
  R('poulet-yassa', 'Poulet yassa', 'Le classique sénégalais : poulet mariné au citron, fondue d’oignons.', {
    family: 'mijote', plat: 'curry', prep: 20, cook: 45, season: TOUTE_ANNEE, tags: [], cuisine: 'africaine',
    ing: [['cuisses', 1, '1 kg de cuisses de poulet'], ['oignons', 0.6, '6 oignons'], ['citrons', 1, '4 citrons'], ['moutarde', 0.08, '2 c. à soupe de moutarde'], ['ail', 0.1, '3 gousses d’ail'], ['riz', 0.3, '300 g de riz'], ['huile', 0.04, '4 c. à soupe d’huile']],
    steps: [['Fais mariner le poulet avec le jus des citrons, la moutarde, l’ail et les oignons émincés (1 h si tu as le temps).', 15], ['Fais dorer le poulet dans l’huile, puis les oignons de la marinade jusqu’à ce qu’ils fondent.', 15], ['Remets le poulet, ajoute la marinade et laisse mijoter 30 min. Sers avec le riz.', 30]],
  }),
  R('mafe-boeuf', 'Mafé de bœuf', 'Le mafé d’Afrique de l’Ouest : bœuf mijoté dans une sauce à l’arachide.', {
    family: 'mijote', plat: 'curry', prep: 20, cook: 70, season: AUTOMNE, tags: ['batch'], cuisine: 'africaine',
    ing: [['boeuf_mijoter', 1, '600 g de bœuf à mijoter'], ['beurre_cacahuete', 0.43, '150 g de beurre de cacahuète'], ['tomates_conc', 1, '1 boîte de tomates concassées'], ['oignons', 0.2, '2 oignons'], ['carottes', 0.3, '3 carottes'], ['patate_douce', 0.5, '500 g de patates douces'], ['riz', 0.3, '300 g de riz'], ['huile', 0.02, '2 c. à soupe d’huile']],
    steps: [['Fais dorer le bœuf en cubes et l’oignon dans l’huile, dans une cocotte.', 10], ['Délaye le beurre de cacahuète dans 50 cl d’eau chaude, verse-le avec les tomates.', 5], ['Ajoute carottes et patates douces, couvre et laisse mijoter 1 h. Sers avec le riz.', 60]],
  }),
  R('fish-pie', 'Fish pie', 'La tourte de poisson anglaise, sans pâte : colin et petits pois sous une purée gratinée.', {
    family: 'gratin', plat: 'gratin', prep: 25, cook: 30, season: TOUTE_ANNEE, tags: ['enfants'], cuisine: 'anglaise',
    ing: [['colin', 1, '400 g de filets de colin'], ['pdt', 0.4, '1 kg de pommes de terre'], ['lait', 0.4, '40 cl de lait'], ['beurre', 0.16, '40 g de beurre'], ['petits_pois', 0.3, '300 g de petits pois'], ['oignons', 0.1, '1 oignon'], ['farine', 0.03, '2 c. à soupe de farine']],
    steps: [['Fais cuire les pommes de terre et écrase-les avec la moitié du beurre et un peu de lait.', 20], ['Fais une sauce blanche avec le reste du beurre, la farine et le lait, ajoute le colin en morceaux, l’oignon et les petits pois.', 10], ['Verse dans un plat, couvre de purée et fais gratiner 25 min à 200 °C.', 25]],
  }),
  R('cottage-pie', 'Cottage pie', 'Le hachis anglais : bœuf, carottes et petits pois sous une purée dorée.', {
    family: 'gratin', plat: 'gratin', prep: 25, cook: 30, season: TOUTE_ANNEE, tags: ['enfants', 'batch'], cuisine: 'anglaise',
    ing: [['boeuf_hache', 1, '500 g de bœuf haché'], ['carottes', 0.3, '3 carottes'], ['petits_pois', 0.3, '300 g de petits pois'], ['oignons', 0.1, '1 oignon'], ['pdt', 0.4, '1 kg de pommes de terre'], ['beurre', 0.16, '40 g de beurre'], ['lait', 0.2, '20 cl de lait']],
    steps: [['Fais cuire les pommes de terre et écrase-les avec le beurre et le lait.', 20], ['Fais revenir l’oignon, le bœuf et les carottes en dés 10 min, ajoute les petits pois.', 10], ['Verse dans un plat, couvre de purée et fais dorer 25 min à 200 °C.', 25]],
  }),
  R('poulet-soja-gingembre', 'Poulet sauté soja et gingembre', 'Un wok express : poulet, brocoli et riz, sauce soja gingembre.', {
    family: 'wok', plat: 'riz', prep: 15, cook: 15, season: TOUTE_ANNEE, tags: ['enfants'], cuisine: 'asiatique',
    ing: [['poulet', 1, '600 g de filets de poulet'], ['soja', 0.24, '6 c. à soupe de sauce soja'], ['gingembre', 0.2, '20 g de gingembre'], ['ail', 0.1, '2 gousses d’ail'], ['brocoli', 1, '500 g de brocoli'], ['riz', 0.3, '300 g de riz'], ['huile', 0.03, '3 c. à soupe d’huile']],
    steps: [['Fais cuire le riz et le brocoli en petits bouquets.', 12], ['Fais sauter le poulet en lamelles dans l’huile bien chaude, avec l’ail et le gingembre râpés.', 6], ['Ajoute le brocoli et la sauce soja, mélange 2 min et sers sur le riz.', 3]],
  }),
];


// Velouté de potimarron : déjà dans seed.sql (prix de référence des maquettes), on complète ses champs.
const VELOUTE = {
  id: '00000000-0000-0000-0000-000000000201',
  family: 'soupe',
  tags: ['enfants', 'batch'],
  ing: ['potimarron', 'oignons', 'creme', 'bouillon', 'huile', 'pain'],
};

// Catégories Open Food Facts du vrac (vérifiées sur l'API Open Prices le 09/11/2026) et poids d'une unité de vente
// en kg pour convertir un prix au kilo ; null = vendu à la pièce (prix « UNIT » d'Open Prices).
const OFF_CATEGORIES = {
  potimarron: ['en:pumpkins', 1.2],
  oignons: ['en:yellow-onions', 1],
  carottes: ['en:carrots', 1],
  poireaux: ['en:leeks', 1],
  pdt: ['en:potatoes', 2.5],
  butternut: ['en:butternut-squashes', 1.5],
  patate_douce: ['en:sweet-potatoes', 1],
  choufleur: ['en:cauliflowers', 1],
  brocoli: ['en:broccoli', 0.5],
  champignons: ['en:mushrooms', 0.5],
  endives: ['en:endives', 1],
  ail: ['en:garlic', 0.15],
  citrons: ['en:lemons', 0.5],
  pommes: ['en:apples', 1.5],
  mache: ['en:corn-salad', 0.15],
  gingembre: ['en:ginger', 0.1],
  persil: ['en:parsley', null],
  chou: ['en:cabbages', 1.2],
};

// ─── Génération ───────────────────────────────────────────────────────────
const STORES = [
  ['lidl', 1.0],
  ['aldi', 1.02],
  ['leclerc', 1.07],
  ['intermarche', 1.145],
  ['carrefour', 1.17],
  ['auchan', 1.19],
  ['netto', 1.03],
  ['super-u', 1.1],
  ['grand-frais', 1.04],
  ['picard', 1.22],
  ['franprix', 1.32],
  ['monoprix', 1.3],
  ['match', 1.18],
];

// Assortiments partiels (démo) : Grand Frais = frais + une partie de l'épicerie, Picard = surgelés,
// viandes et poissons, quelques légumes. Les autres enseignes ont tout le catalogue.
function sells(store, key, aisle) {
  if (store === 'grand-frais') {
    if (aisle === 'surgeles') return false;
    if (aisle === 'epicerie' || aisle === 'placard') return hash(`${key}:gf`) % 2 === 0;
    return true;
  }
  if (store === 'picard') {
    if (aisle === 'surgeles' || aisle === 'viandes_poissons') return true;
    if (aisle === 'fruits_legumes') return hash(`${key}:pi`) % 4 === 0;
    return false;
  }
  return true;
}

const pad = (n, w) => String(n).padStart(w, '0');
const productId = (key, i) => EXISTING[key] ?? `00000000-0000-0000-0001-${pad(i + 1, 12)}`;
const recipeId = (i) => `00000000-0000-0000-0002-${pad(i + 1, 12)}`;
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `'{${a.join(',')}}'`;

// Petit hachage déterministe (FNV-1a) : mêmes prix à chaque génération.
function hash(s) {
  let h = 0x811c9dc5;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  return h;
}
const unit = (s) => (hash(s) % 10_000) / 10_000;

/** Prix d'enseigne : niveau Lidl × écart de l'enseigne ± 5 %, terminé par 9. */
function storeCents(key, base, store, factor) {
  const noisy = base * factor * (0.95 + unit(`${key}:${store}`) * 0.1);
  return Math.max(29, Math.round(noisy / 10) * 10 - 1);
}

const byKey = new Map(PRODUCTS.map((p, i) => [p[0], { id: productId(p[0], i), name: p[1], qty: p[2], aisle: p[3], base: p[4], flags: new Set(p[5]) }]));

function deduce(keys) {
  const flags = new Set(keys.flatMap((k) => [...byKey.get(k).flags]));
  const meat = flags.has('porc') || flags.has('volaille') || flags.has('boeuf');
  const veg = !meat && !flags.has('poisson');
  const diets = ['omnivore'];
  if (!flags.has('porc')) diets.push('sans_porc');
  if (veg) diets.push('vegetarien');
  if (veg && !flags.has('oeuf') && !flags.has('lactose')) diets.push('vegan');
  // Viandes du catalogue non certifiées halal : seuls les plats sans viande sont marqués halal.
  if (!meat) diets.push('halal');
  if (!flags.has('gluten')) diets.push('sans_gluten');
  const tags = [];
  if (flags.has('lactose')) tags.push('lactose');
  if (flags.has('poisson')) tags.push('poisson');
  if (flags.has('noix')) tags.push('fruits_a_coque');
  if (flags.has('epice')) tags.push('epice');
  return { diets, tags };
}

// Équipement nécessaire, déduit des étapes : four (« four », « °C ») et plaques (poêle, casserole…).
const OVEN = /\bfour\b|°C/i;
const HOB = /po[êe]le|casserole|faitout|cocotte|wok|revenir|bouillir|saisi|mijot|fais cuire|fais fondre|r[ée]chauffe|sauteuse|feu/i;
// Recettes dont la cuisson au four se fait aussi au air fryer (pièces, filets, légumes en morceaux).
const AIR_FRYER = new Set([
  'legumes-rotis-pois-chiches', 'potimarron-chataignes-rotis', 'cuisses-poulet-roties',
  'colin-citron-riz', 'salade-quinoa-patate-douce',
]);
function equipmentOf(r) {
  const text = r.steps.map(([t]) => t).join(' ');
  const eq = [];
  if (OVEN.test(text)) eq.push('four');
  if (HOB.test(text) || r.cook > 0 && !eq.length) eq.push('plaques');
  return eq;
}

// Styles (questionnaire « Quelle ambiance ? »), déduits des ingrédients comme les allergènes.
// 'rapide' (≤ 30 min), 'famille' (tag enfants) et 'vegetal' (végétarien) se lisent sans marqueur.
const RICH = new Set(['beurre', 'creme', 'creme_fraiche', 'emmental', 'parmesan', 'mozzarella', 'chevre', 'lardons', 'saucisses', 'pate_brisee', 'pate_feuilletee', 'lasagnes', 'gnocchis', 'feta']);
const WORLD = new Set(['curry', 'cumin', 'ras_el_hanout', 'soja', 'coco', 'tortillas', 'gingembre', 'haricots_rouges']);
function stylesOf(r, keys) {
  const fresh = keys.filter((k) => byKey.get(k).aisle === 'fruits_legumes' || ['epinards', 'haricots_verts', 'petits_pois'].includes(k));
  const rich = keys.filter((k) => RICH.has(k));
  const tags = [];
  if (rich.length === 0 && new Set(fresh).size >= 2) tags.push('equilibre');
  if (rich.length >= 2 || ['gratin', 'tarte'].includes(r.family)) tags.push('gourmand');
  if (keys.some((k) => WORLD.has(k)) || ['curry', 'wrap'].includes(r.family) || cuisineOf(r) !== 'francaise') tags.push('monde');
  if (AIR_FRYER.has(r.slug)) tags.push('air_fryer');
  // Faisable au robot cuiseur (Thermomix, Cookeo…) : soupes, mijotés, currys, légumineuses, risotto.
  if (['soupe', 'mijote', 'curry', 'legumineuses'].includes(r.family) || r.slug.startsWith('risotto')) tags.push('robot');
  return tags;
}

// Cuisine de chaque recette (questionnaire « Quelles cuisines te font envie ? »).
// Par défaut : française. Les recettes du monde la précisent dans leur définition (`cuisine`).
const CUISINE_BY_SLUG = {
  italienne: ['pates-tomate-basilic', 'penne-au-thon', 'gnocchis-epinards-creme', 'pates-pesto-brocoli', 'pates-champignons-creme', 'spaghetti-bolognaise', 'lasagnes-vegetariennes', 'risotto-champignons', 'spaghetti-epinards-tomate'],
  indienne: ['curry-pois-chiches-courge', 'dahl-lentilles-corail', 'curry-legumes'],
  asiatique: ['riz-saute-legumes', 'quinoa-saute-legumes', 'poulet-lait-de-coco'],
  americaine: ['chili-sin-carne', 'chili-con-carne', 'fajitas-poulet-poivrons', 'riz-haricots-rouges-mais'],
  africaine: ['couscous-legumes'],
  europeenne: ['tortilla-pommes-de-terre', 'salade-lentilles-feta'],
};
const cuisineOf = (r) =>
  r.cuisine ?? Object.entries(CUISINE_BY_SLUG).find(([, slugs]) => slugs.includes(r.slug))?.[0] ?? 'francaise';

const out = [];
out.push('-- catalogue.sql — GÉNÉRÉ par supabase/catalogue/generate.mjs : ne pas modifier à la main.');
out.push('-- Catalogue de départ (lot 5) : produits, recettes d’automne / hiver et PRIX DE DÉMONSTRATION');
out.push("-- (source = 'manual'), à remplacer par les relevés Open Prices et les tickets (lot 10).");
out.push('');

// Produits (hors 8 déjà présents dans seed.sql)
out.push('insert into products (id, name, quantity_label, aisle_id) values');
out.push(
  PRODUCTS.filter((p) => !EXISTING[p[0]])
    .map((p) => `  (${q(byKey.get(p[0]).id)}, ${q(p[1])}, ${q(p[2])}, ${q(p[3])})`)
    .join(',\n') + ';',
);
out.push('');

// Prix : 1 à 2 relevés par produit et par enseigne. Quelques relevés plus anciens (8 à 20 jours)
// chez Intermarché et Carrefour, pour montrer des estimations (≈) et un indice ●●○.
const priceRows = [];
for (const [key, p] of byKey) {
  for (const [store, factor] of STORES) {
    if (SEEDED_STORES[key]?.includes(store)) continue;
    if (!sells(store, key, p.aisle)) continue;
    const cents = storeCents(key, p.base, store, factor);
    const old = (store === 'intermarche' || store === 'carrefour') && hash(`${key}:${store}:age`) % 6 === 0;
    const days = old ? 8 + (hash(key) % 12) : 1 + (hash(`${key}:${store}:d`) % 5);
    priceRows.push(`  (${q(p.id)}, ${q(store)}, ${cents}, now() - interval '${days} days', 'manual')`);
  }
}
out.push('insert into prices (product_id, store_id, cents, observed_at, source) values');
out.push(priceRows.join(',\n') + ';');
out.push('');

// Relevés aberrants de démonstration (écart > 40 % avec la médiane) : file de modération du back-office.
const ABERRANT = [
  ['coco', 'carrefour', 89, 'ticket', 1],
  ['pates', 'auchan', 45, 'ticket', 2],
  ['oeufs', 'leclerc', 499, 'open_prices', 1],
  ['saumon', 'aldi', 199, 'ticket', 3],
  ['potimarron', 'intermarche', 349, 'open_prices', 2],
];
out.push('insert into prices (product_id, store_id, cents, observed_at, source, flagged_aberrant) values');
out.push(
  ABERRANT.map(([k, store, cents, src, days]) => `  (${q(byKey.get(k).id)}, ${q(store)}, ${cents}, now() - interval '${days} days', '${src}', true)`).join(',\n') + ';',
);
out.push('');

// Import Open Prices (lot 10) : catégorie du vrac et poids d'une unité de vente.
out.push('-- Catégories Open Food Facts du vrac (import Open Prices).');
for (const [key, [category, kg]] of Object.entries(OFF_CATEGORIES)) {
  if (!byKey.has(key)) throw new Error(`catégorie OFF : produit inconnu ${key}`);
  out.push(`update products set off_category = ${q(category)}, unit_kg = ${kg === null ? 'null' : kg} where id = ${q(byKey.get(key).id)};`);
}
out.push('');

// Velouté (seed) : famille, marqueurs, régimes recalculés
{
  const { diets, tags } = deduce(VELOUTE.ing);
  out.push(
    `update recipes set family = ${q(VELOUTE.family)}, tags = ${arr([...new Set([...tags, ...VELOUTE.tags])])}, diets = ${arr(diets)} where id = ${q(VELOUTE.id)};`,
  );
  out.push('');
}

const report = [];
RECIPES.forEach((r, i) => {
  const id = recipeId(i);
  const keys = r.ing.map(([k]) => {
    if (!byKey.has(k)) throw new Error(`${r.slug} : produit inconnu ${k}`);
    return k;
  });
  const { diets, tags } = deduce(keys);
  const allTags = [...new Set([...tags, ...r.tags, ...stylesOf(r, keys)])];
  const equipment = equipmentOf(r);
  const steps = JSON.stringify(r.steps.map(([text, minutes]) => ({ text, minutes })));
  out.push(
    `insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values (${q(id)}, ${q(r.slug)}, ${q(r.title)}, ${q(r.description)}, 4, ${r.prep}, ${r.cook}, ${arr(diets)}, ${arr(r.season)}, ${q(r.plat)}, ${q(r.family)}, ${arr(allTags)}, ${arr(equipment)}, ${q(cuisineOf(r))}, ${q(steps)}, true);`,
  );
  out.push('insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values');
  out.push(
    r.ing
      .map(([k, units, label], j) => `  (${q(id)}, ${q(label)}, ${q(byKey.get(k).id)}, ${units}, ${PANTRY.has(k)}, ${j + 1})`)
      .join(',\n') + ';',
  );
  out.push('');
  const lidl = r.ing.reduce((s, [k, u]) => s + byKey.get(k).base * u, 0);
  report.push(`${(lidl / 400).toFixed(2).padStart(5)} €/part · ${String(r.prep + r.cook).padStart(3)} min · ${r.family.padEnd(12)} · ${diets.includes('vegetarien') ? 'végé ' : '     '} ${r.title} · ${cuisineOf(r)} · [${equipment}] ${stylesOf(r, keys).join(' ')}`);
});

writeFileSync(OUT, out.join('\n') + '\n');
console.log(`${RECIPES.length + 1} recettes, ${PRODUCTS.length} produits, ${priceRows.length} prix → ${OUT}`);
if (process.argv.includes('--rapport')) console.log(report.sort().join('\n'));
