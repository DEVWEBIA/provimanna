-- catalogue.sql — GÉNÉRÉ par supabase/catalogue/generate.mjs : ne pas modifier à la main.
-- Catalogue de départ (lot 5) : produits, recettes d’automne / hiver et PRIX DE DÉMONSTRATION
-- (source = 'manual'), à remplacer par les relevés Open Prices et les tickets (lot 10).

insert into products (id, name, quantity_label, aisle_id) values
  ('00000000-0000-0000-0001-000000000009', 'Carottes', 'sachet 1 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000010', 'Poireaux', 'botte 1 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000011', 'Pommes de terre', 'filet 2,5 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000012', 'Courge butternut', 'pièce ≈ 1,5 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000013', 'Patates douces', '1 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000014', 'Chou-fleur', 'pièce', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000015', 'Brocoli', '500 g', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000016', 'Champignons de Paris', '500 g', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000017', 'Endives', '1 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000018', 'Poivrons tricolores', 'lot de 3', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000019', 'Ail', '3 têtes', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000020', 'Citrons', 'filet 500 g', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000021', 'Pommes', 'sachet 1,5 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000022', 'Mâche', '150 g', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000023', 'Gingembre', '100 g', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000024', 'Persil plat', 'botte', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000025', 'Navets', '1 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000026', 'Chou vert', 'pièce', 'fruits_legumes'),
  ('00000000-0000-0000-0001-000000000027', 'Œufs plein air', 'boîte de 12', 'cremerie'),
  ('00000000-0000-0000-0001-000000000028', 'Lait demi-écrémé', '1 L', 'cremerie'),
  ('00000000-0000-0000-0001-000000000029', 'Beurre doux', '250 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000030', 'Emmental râpé', '200 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000031', 'Parmesan râpé', '100 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000032', 'Mozzarella', '125 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000033', 'Bûche de chèvre', '180 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000034', 'Crème fraîche épaisse', '20 cl', 'cremerie'),
  ('00000000-0000-0000-0001-000000000035', 'Pâte brisée', 'rouleau 230 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000036', 'Pâte feuilletée', 'rouleau 230 g', 'cremerie'),
  ('00000000-0000-0000-0001-000000000037', 'Pesto au basilic', '190 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000038', 'Penne', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000039', 'Spaghetti', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000040', 'Feuilles de lasagnes', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000041', 'Riz basmati', '1 kg', 'epicerie'),
  ('00000000-0000-0000-0001-000000000042', 'Riz rond (risotto)', '1 kg', 'epicerie'),
  ('00000000-0000-0000-0001-000000000043', 'Semoule de blé', '1 kg', 'epicerie'),
  ('00000000-0000-0000-0001-000000000044', 'Quinoa', '400 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000045', 'Lentilles corail', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000046', 'Lentilles vertes', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000047', 'Pois chiches', 'boîte 400 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000048', 'Haricots rouges', 'boîte 400 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000049', 'Tomates concassées', 'boîte 400 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000050', 'Coulis de tomate', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000051', 'Maïs doux', 'boîte 300 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000052', 'Thon au naturel', 'boîte 140 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000053', 'Gnocchis', '500 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000054', 'Tortillas de blé', 'paquet de 8', 'epicerie'),
  ('00000000-0000-0000-0001-000000000055', 'Châtaignes cuites', '400 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000056', 'Cerneaux de noix', '100 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000057', 'Sauce soja', '25 cl', 'epicerie'),
  ('00000000-0000-0000-0001-000000000058', 'Beurre de cacahuète', '350 g', 'epicerie'),
  ('00000000-0000-0000-0001-000000000059', 'Curry en poudre', '50 g', 'placard'),
  ('00000000-0000-0000-0001-000000000060', 'Cumin moulu', '40 g', 'placard'),
  ('00000000-0000-0000-0001-000000000061', 'Paprika doux', '40 g', 'placard'),
  ('00000000-0000-0000-0001-000000000062', 'Ras el hanout', '40 g', 'placard'),
  ('00000000-0000-0000-0001-000000000063', 'Herbes de Provence', '30 g', 'placard'),
  ('00000000-0000-0000-0001-000000000064', 'Farine de blé', '1 kg', 'placard'),
  ('00000000-0000-0000-0001-000000000065', 'Moutarde de Dijon', '370 g', 'placard'),
  ('00000000-0000-0000-0001-000000000066', 'Curcuma moulu', '40 g', 'placard'),
  ('00000000-0000-0000-0001-000000000067', 'Filets de poulet', '600 g', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000068', 'Cuisses de poulet', '1 kg', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000069', 'Bœuf haché 5 %', '500 g', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000070', 'Bœuf à mijoter', '600 g', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000071', 'Lardons fumés', '2 × 100 g', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000072', 'Saucisses de Toulouse', '6 pièces', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000073', 'Jambon blanc', '4 tranches', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000074', 'Pavés de saumon', '2 × 125 g', 'viandes_poissons'),
  ('00000000-0000-0000-0001-000000000075', 'Filets de colin', '400 g', 'surgeles'),
  ('00000000-0000-0000-0001-000000000076', 'Épinards hachés', '1 kg', 'surgeles'),
  ('00000000-0000-0000-0001-000000000077', 'Haricots verts extra-fins', '1 kg', 'surgeles'),
  ('00000000-0000-0000-0001-000000000078', 'Petits pois', '1 kg', 'surgeles');

insert into prices (product_id, store_id, cents, observed_at, source) values
  ('00000000-0000-0000-0000-000000000101', 'aldi', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'leclerc', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'intermarche', 239, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'carrefour', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'netto', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'super-u', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'grand-frais', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'franprix', 249, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'monoprix', 269, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000101', 'match', 229, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'aldi', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'leclerc', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'intermarche', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'carrefour', 149, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'netto', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'super-u', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'grand-frais', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'franprix', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'monoprix', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000102', 'match', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'aldi', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'leclerc', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'intermarche', 109, now() - interval '9 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'carrefour', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'netto', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'super-u', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'grand-frais', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'franprix', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'monoprix', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000103', 'match', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'aldi', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'intermarche', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'carrefour', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'netto', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'super-u', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'grand-frais', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'franprix', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'monoprix', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000104', 'match', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'aldi', 419, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'leclerc', 419, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'intermarche', 449, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'carrefour', 469, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'netto', 419, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'super-u', 449, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'franprix', 529, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'monoprix', 519, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000105', 'match', 449, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'aldi', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'leclerc', 69, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'intermarche', 79, now() - interval '17 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'carrefour', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'netto', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'super-u', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'grand-frais', 69, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'franprix', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'monoprix', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000106', 'match', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'aldi', 219, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'leclerc', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'intermarche', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'carrefour', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'auchan', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'netto', 239, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'super-u', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'grand-frais', 229, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'franprix', 289, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'monoprix', 299, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000107', 'match', 259, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'lidl', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'aldi', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'leclerc', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'intermarche', 129, now() - interval '17 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'auchan', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'netto', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'super-u', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'grand-frais', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'franprix', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'monoprix', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0000-000000000108', 'match', 139, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'lidl', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'aldi', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'leclerc', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'intermarche', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'carrefour', 129, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'auchan', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'netto', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'super-u', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'grand-frais', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'franprix', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'monoprix', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000009', 'match', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'lidl', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'aldi', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'leclerc', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'intermarche', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'carrefour', 239, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'auchan', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'netto', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'super-u', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'grand-frais', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'franprix', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'monoprix', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000010', 'match', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'lidl', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'aldi', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'leclerc', 259, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'intermarche', 279, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'carrefour', 299, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'auchan', 289, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'netto', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'super-u', 269, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'grand-frais', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'picard', 319, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'franprix', 339, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'monoprix', 329, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000011', 'match', 279, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'lidl', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'aldi', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'leclerc', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'intermarche', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'carrefour', 219, now() - interval '14 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'auchan', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'netto', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'super-u', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'grand-frais', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'franprix', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'monoprix', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000012', 'match', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'lidl', 249, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'aldi', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'leclerc', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'intermarche', 289, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'carrefour', 289, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'auchan', 289, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'netto', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'super-u', 269, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'grand-frais', 269, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'franprix', 319, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'monoprix', 339, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000013', 'match', 299, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'lidl', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'aldi', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'leclerc', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'intermarche', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'carrefour', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'auchan', 229, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'netto', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'super-u', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'grand-frais', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'franprix', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'monoprix', 249, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000014', 'match', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'lidl', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'aldi', 149, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'leclerc', 169, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'intermarche', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'carrefour', 179, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'auchan', 169, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'netto', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'super-u', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'grand-frais', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'picard', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'franprix', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'monoprix', 189, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000015', 'match', 169, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'lidl', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'aldi', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'leclerc', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'intermarche', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'carrefour', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'auchan', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'netto', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'super-u', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'grand-frais', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'franprix', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'monoprix', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000016', 'match', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'lidl', 229, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'aldi', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'leclerc', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'intermarche', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'carrefour', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'auchan', 269, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'netto', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'super-u', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'grand-frais', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'franprix', 299, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'monoprix', 299, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000017', 'match', 259, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'lidl', 239, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'aldi', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'leclerc', 239, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'intermarche', 279, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'carrefour', 259, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'auchan', 279, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'netto', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'super-u', 249, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'grand-frais', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'picard', 289, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'franprix', 309, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'monoprix', 309, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000018', 'match', 279, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'lidl', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'aldi', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'leclerc', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'intermarche', 149, now() - interval '17 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'carrefour', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'auchan', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'netto', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'super-u', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'grand-frais', 139, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'franprix', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'monoprix', 169, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000019', 'match', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'lidl', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'aldi', 159, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'leclerc', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'intermarche', 159, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'carrefour', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'auchan', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'netto', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'super-u', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'grand-frais', 149, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'picard', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'franprix', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'monoprix', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000020', 'match', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'lidl', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'aldi', 259, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'leclerc', 259, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'intermarche', 269, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'carrefour', 299, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'auchan', 289, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'netto', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'super-u', 269, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'grand-frais', 259, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'franprix', 319, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'monoprix', 339, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000021', 'match', 299, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'lidl', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'aldi', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'leclerc', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'intermarche', 149, now() - interval '19 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'carrefour', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'auchan', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'netto', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'super-u', 139, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'grand-frais', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'picard', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'franprix', 169, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'monoprix', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000022', 'match', 149, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'lidl', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'aldi', 79, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'leclerc', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'intermarche', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'carrefour', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'auchan', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'netto', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'super-u', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'grand-frais', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'picard', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'franprix', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'monoprix', 99, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000023', 'match', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'lidl', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'aldi', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'leclerc', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'intermarche', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'carrefour', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'auchan', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'netto', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'super-u', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'grand-frais', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'franprix', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'monoprix', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000024', 'match', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'lidl', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'aldi', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'leclerc', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'intermarche', 219, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'carrefour', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'auchan', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'netto', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'super-u', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'grand-frais', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'franprix', 249, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'monoprix', 249, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000025', 'match', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'lidl', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'aldi', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'leclerc', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'intermarche', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'carrefour', 219, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'auchan', 219, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'netto', 189, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'super-u', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'grand-frais', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'franprix', 229, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'monoprix', 229, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000026', 'match', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'lidl', 289, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'aldi', 279, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'leclerc', 279, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'intermarche', 309, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'carrefour', 329, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'auchan', 319, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'netto', 279, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'super-u', 299, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'grand-frais', 279, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'franprix', 369, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'monoprix', 359, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000027', 'match', 339, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'lidl', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'aldi', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'leclerc', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'intermarche', 109, now() - interval '11 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'carrefour', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'auchan', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'netto', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'super-u', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'grand-frais', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'franprix', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'monoprix', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000028', 'match', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'lidl', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'aldi', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'leclerc', 219, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'intermarche', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'carrefour', 259, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'auchan', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'netto', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'super-u', 239, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'grand-frais', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'franprix', 279, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'monoprix', 279, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000029', 'match', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'lidl', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'aldi', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'leclerc', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'intermarche', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'carrefour', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'auchan', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'netto', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'super-u', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'grand-frais', 179, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'franprix', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'monoprix', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000030', 'match', 209, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'lidl', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'aldi', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'leclerc', 239, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'intermarche', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'carrefour', 249, now() - interval '8 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'auchan', 249, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'netto', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'super-u', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'grand-frais', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'franprix', 279, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'monoprix', 269, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000031', 'match', 269, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'lidl', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'aldi', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'leclerc', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'intermarche', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'carrefour', 89, now() - interval '12 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'auchan', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'netto', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'super-u', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'grand-frais', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'franprix', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'monoprix', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000032', 'match', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'lidl', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'aldi', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'leclerc', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'intermarche', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'carrefour', 239, now() - interval '8 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'auchan', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'netto', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'super-u', 219, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'grand-frais', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'franprix', 259, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'monoprix', 269, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000033', 'match', 239, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'lidl', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'aldi', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'leclerc', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'intermarche', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'carrefour', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'auchan', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'netto', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'super-u', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'grand-frais', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'franprix', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'monoprix', 139, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000034', 'match', 129, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'lidl', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'aldi', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'leclerc', 99, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'intermarche', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'carrefour', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'auchan', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'netto', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'super-u', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'grand-frais', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'franprix', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'monoprix', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000035', 'match', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'lidl', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'aldi', 99, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'intermarche', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'carrefour', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'auchan', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'netto', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'super-u', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'grand-frais', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'franprix', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'monoprix', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000036', 'match', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'lidl', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'aldi', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'leclerc', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'intermarche', 169, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'carrefour', 169, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'auchan', 169, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'netto', 159, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'super-u', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'franprix', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'monoprix', 189, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000037', 'match', 179, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'lidl', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'aldi', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'leclerc', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'intermarche', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'carrefour', 99, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'auchan', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'netto', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'super-u', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'franprix', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'monoprix', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000038', 'match', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'lidl', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'aldi', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'leclerc', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'intermarche', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'carrefour', 99, now() - interval '12 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'auchan', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'netto', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'super-u', 99, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'franprix', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'monoprix', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000039', 'match', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'lidl', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'aldi', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'leclerc', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'intermarche', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'carrefour', 149, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'auchan', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'netto', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'super-u', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'grand-frais', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'franprix', 159, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'monoprix', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000040', 'match', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'lidl', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'aldi', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'leclerc', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'intermarche', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'carrefour', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'auchan', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'netto', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'super-u', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'franprix', 239, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'monoprix', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000041', 'match', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'lidl', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'aldi', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'leclerc', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'intermarche', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'carrefour', 229, now() - interval '14 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'auchan', 239, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'netto', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'super-u', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'franprix', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'monoprix', 249, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000042', 'match', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'lidl', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'aldi', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'leclerc', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'intermarche', 149, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'carrefour', 149, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'auchan', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'netto', 129, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'super-u', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'grand-frais', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'franprix', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'monoprix', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000043', 'match', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'lidl', 259, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'aldi', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'leclerc', 269, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'intermarche', 279, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'carrefour', 309, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'auchan', 289, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'netto', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'super-u', 279, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'franprix', 339, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'monoprix', 339, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000044', 'match', 299, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'lidl', 169, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'aldi', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'leclerc', 189, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'intermarche', 189, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'carrefour', 189, now() - interval '18 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'auchan', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'netto', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'super-u', 179, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'franprix', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'monoprix', 229, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000045', 'match', 209, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'lidl', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'aldi', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'leclerc', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'intermarche', 179, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'carrefour', 179, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'auchan', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'netto', 149, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'super-u', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'grand-frais', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'franprix', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'monoprix', 189, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000046', 'match', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'lidl', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'aldi', 69, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'leclerc', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'intermarche', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'carrefour', 79, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'auchan', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'netto', 69, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'super-u', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'franprix', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'monoprix', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000047', 'match', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'lidl', 69, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'aldi', 69, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'leclerc', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'intermarche', 79, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'carrefour', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'auchan', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'netto', 69, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'super-u', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'franprix', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'monoprix', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000048', 'match', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'lidl', 59, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'aldi', 59, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'leclerc', 59, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'intermarche', 69, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'carrefour', 69, now() - interval '10 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'auchan', 69, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'netto', 59, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'super-u', 69, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'franprix', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'monoprix', 69, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000049', 'match', 69, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'lidl', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'aldi', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'leclerc', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'intermarche', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'carrefour', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'auchan', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'netto', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'super-u', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'franprix', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'monoprix', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000050', 'match', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'lidl', 79, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'aldi', 79, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'leclerc', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'intermarche', 89, now() - interval '15 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'carrefour', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'auchan', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'netto', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'super-u', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'grand-frais', 79, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'franprix', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'monoprix', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000051', 'match', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'lidl', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'aldi', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'leclerc', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'intermarche', 189, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'carrefour', 189, now() - interval '16 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'auchan', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'netto', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'super-u', 169, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'franprix', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'monoprix', 199, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000052', 'match', 189, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'lidl', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'aldi', 129, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'leclerc', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'intermarche', 139, now() - interval '13 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'carrefour', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'auchan', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'netto', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'super-u', 129, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'grand-frais', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'franprix', 159, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'monoprix', 149, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000053', 'match', 139, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'lidl', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'aldi', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'leclerc', 139, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'intermarche', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'carrefour', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'auchan', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'netto', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'super-u', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'grand-frais', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'franprix', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'monoprix', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000054', 'match', 149, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'lidl', 369, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'aldi', 359, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'leclerc', 369, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'intermarche', 409, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'carrefour', 399, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'auchan', 429, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'netto', 359, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'super-u', 369, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'franprix', 469, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'monoprix', 439, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000055', 'match', 389, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'lidl', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'aldi', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'leclerc', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'intermarche', 229, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'carrefour', 239, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'auchan', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'netto', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'super-u', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'grand-frais', 209, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'franprix', 269, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'monoprix', 259, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000056', 'match', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'lidl', 129, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'aldi', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'leclerc', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'intermarche', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'carrefour', 149, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'auchan', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'netto', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'super-u', 149, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'franprix', 179, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'monoprix', 179, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000057', 'match', 149, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'lidl', 239, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'aldi', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'leclerc', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'intermarche', 299, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'carrefour', 299, now() - interval '8 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'auchan', 309, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'netto', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'super-u', 269, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'franprix', 339, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'monoprix', 319, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000058', 'match', 299, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'lidl', 99, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'aldi', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'intermarche', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'carrefour', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'auchan', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'netto', 99, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'super-u', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'franprix', 139, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'monoprix', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000059', 'match', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'lidl', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'aldi', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'intermarche', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'carrefour', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'auchan', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'netto', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'super-u', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'grand-frais', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'franprix', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'monoprix', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000060', 'match', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'lidl', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'aldi', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'intermarche', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'carrefour', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'auchan', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'netto', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'super-u', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'grand-frais', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'franprix', 129, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'monoprix', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000061', 'match', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'lidl', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'aldi', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'leclerc', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'intermarche', 139, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'carrefour', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'auchan', 139, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'netto', 119, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'super-u', 129, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'grand-frais', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'franprix', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'monoprix', 159, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000062', 'match', 129, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'lidl', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'aldi', 89, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'leclerc', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'intermarche', 109, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'carrefour', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'auchan', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'netto', 89, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'super-u', 89, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'franprix', 119, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'monoprix', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000063', 'match', 109, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'lidl', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'aldi', 59, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'leclerc', 69, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'intermarche', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'carrefour', 79, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'auchan', 79, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'netto', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'super-u', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'franprix', 79, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'monoprix', 89, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000064', 'match', 69, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'lidl', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'aldi', 89, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'leclerc', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'intermarche', 109, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'carrefour', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'auchan', 99, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'netto', 99, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'super-u', 99, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'franprix', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'monoprix', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000065', 'match', 109, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'lidl', 109, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'aldi', 119, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'leclerc', 119, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'intermarche', 139, now() - interval '11 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'carrefour', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'auchan', 139, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'netto', 119, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'super-u', 139, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'grand-frais', 129, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'franprix', 159, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'monoprix', 149, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000066', 'match', 139, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'lidl', 719, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'aldi', 689, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'leclerc', 729, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'intermarche', 779, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'carrefour', 799, now() - interval '12 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'auchan', 829, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'netto', 729, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'super-u', 759, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'grand-frais', 729, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'picard', 839, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'franprix', 959, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'monoprix', 919, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000067', 'match', 809, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'lidl', 409, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'aldi', 399, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'leclerc', 409, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'intermarche', 459, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'carrefour', 459, now() - interval '14 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'auchan', 469, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'netto', 429, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'super-u', 439, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'grand-frais', 419, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'picard', 489, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'franprix', 499, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'monoprix', 539, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000068', 'match', 449, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'lidl', 479, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'aldi', 489, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'leclerc', 539, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'intermarche', 559, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'carrefour', 569, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'auchan', 579, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'netto', 519, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'super-u', 519, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'grand-frais', 529, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'picard', 619, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'franprix', 649, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'monoprix', 649, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000069', 'match', 579, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'lidl', 839, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'aldi', 849, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'leclerc', 809, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'intermarche', 899, now() - interval '17 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'carrefour', 929, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'auchan', 919, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'netto', 799, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'super-u', 869, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'grand-frais', 869, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'picard', 929, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'franprix', 1049, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'monoprix', 999, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000070', 'match', 969, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'lidl', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'aldi', 179, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'leclerc', 169, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'intermarche', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'carrefour', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'auchan', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'netto', 169, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'super-u', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'grand-frais', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'picard', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'franprix', 229, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'monoprix', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000071', 'match', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'lidl', 359, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'aldi', 349, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'leclerc', 369, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'intermarche', 399, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'carrefour', 409, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'auchan', 419, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'netto', 349, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'super-u', 369, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'grand-frais', 369, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'picard', 429, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'franprix', 449, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'monoprix', 439, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000072', 'match', 409, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'lidl', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'aldi', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'leclerc', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'intermarche', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'carrefour', 229, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'auchan', 239, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'netto', 199, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'super-u', 209, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'grand-frais', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'picard', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'franprix', 259, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'monoprix', 269, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000073', 'match', 239, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'lidl', 409, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'aldi', 409, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'leclerc', 449, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'intermarche', 449, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'carrefour', 449, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'auchan', 459, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'netto', 409, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'super-u', 459, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'grand-frais', 429, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'picard', 489, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'franprix', 529, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'monoprix', 519, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000074', 'match', 479, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'lidl', 359, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'aldi', 359, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'leclerc', 379, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'intermarche', 409, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'carrefour', 419, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'auchan', 399, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'netto', 379, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'super-u', 389, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'picard', 429, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'franprix', 449, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'monoprix', 439, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000075', 'match', 419, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'lidl', 179, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'aldi', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'leclerc', 189, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'intermarche', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'carrefour', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'auchan', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'netto', 189, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'super-u', 189, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'picard', 209, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'franprix', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'monoprix', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000076', 'match', 219, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'lidl', 189, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'aldi', 189, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'leclerc', 209, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'intermarche', 219, now() - interval '15 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'carrefour', 219, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'auchan', 229, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'netto', 199, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'super-u', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'picard', 219, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'franprix', 249, now() - interval '2 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'monoprix', 249, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000077', 'match', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'lidl', 169, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'aldi', 159, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'leclerc', 179, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'intermarche', 189, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'carrefour', 189, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'auchan', 199, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'netto', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'super-u', 179, now() - interval '5 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'picard', 199, now() - interval '4 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'franprix', 209, now() - interval '1 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'monoprix', 219, now() - interval '3 days', 'manual'),
  ('00000000-0000-0000-0001-000000000078', 'match', 189, now() - interval '5 days', 'manual');

insert into prices (product_id, store_id, cents, observed_at, source, flagged_aberrant) values
  ('00000000-0000-0000-0000-000000000108', 'carrefour', 89, now() - interval '1 days', 'ticket', true),
  ('00000000-0000-0000-0001-000000000038', 'auchan', 45, now() - interval '2 days', 'ticket', true),
  ('00000000-0000-0000-0001-000000000027', 'leclerc', 499, now() - interval '1 days', 'open_prices', true),
  ('00000000-0000-0000-0001-000000000074', 'aldi', 199, now() - interval '3 days', 'ticket', true),
  ('00000000-0000-0000-0000-000000000101', 'intermarche', 349, now() - interval '2 days', 'open_prices', true);

-- Catégories Open Food Facts (import Open Prices : vrac et produits emballés).
update products set off_category = 'en:pumpkins', unit_kg = 1.2 where id = '00000000-0000-0000-0000-000000000101';
update products set off_category = 'en:yellow-onions', unit_kg = 1 where id = '00000000-0000-0000-0000-000000000102';
update products set off_category = 'en:carrots', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000009';
update products set off_category = 'en:leeks', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000010';
update products set off_category = 'en:potatoes', unit_kg = 2.5 where id = '00000000-0000-0000-0001-000000000011';
update products set off_category = 'en:butternut-squashes', unit_kg = 1.5 where id = '00000000-0000-0000-0001-000000000012';
update products set off_category = 'en:sweet-potatoes', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000013';
update products set off_category = 'en:cauliflowers', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000014';
update products set off_category = 'en:broccoli', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000015';
update products set off_category = 'en:mushrooms', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000016';
update products set off_category = 'en:endives', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000017';
update products set off_category = 'en:garlic', unit_kg = 0.15 where id = '00000000-0000-0000-0001-000000000019';
update products set off_category = 'en:lemons', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000020';
update products set off_category = 'en:apples', unit_kg = 1.5 where id = '00000000-0000-0000-0001-000000000021';
update products set off_category = 'en:corn-salad', unit_kg = 0.15 where id = '00000000-0000-0000-0001-000000000022';
update products set off_category = 'en:ginger', unit_kg = 0.1 where id = '00000000-0000-0000-0001-000000000023';
update products set off_category = 'en:parsley', unit_kg = null where id = '00000000-0000-0000-0001-000000000024';
update products set off_category = 'en:cabbages', unit_kg = 1.2 where id = '00000000-0000-0000-0001-000000000026';
update products set off_category = 'en:fresh-turnips', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000025';
update products set off_category = 'en:fresh-sweet-peppers', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000018';
update products set off_category = 'en:unfermented-creams', unit_kg = 0.2 where id = '00000000-0000-0000-0000-000000000103';
update products set off_category = 'en:vegetable-bouillon-cubes', unit_kg = 0.1 where id = '00000000-0000-0000-0000-000000000104';
update products set off_category = 'en:extra-virgin-olive-oils', unit_kg = 1 where id = '00000000-0000-0000-0000-000000000105';
update products set off_category = 'en:pains-de-campagne', unit_kg = 0.4 where id = '00000000-0000-0000-0000-000000000106';
update products set off_category = 'en:feta', unit_kg = 0.2 where id = '00000000-0000-0000-0000-000000000107';
update products set off_category = 'en:coconut-milks', unit_kg = 0.4 where id = '00000000-0000-0000-0000-000000000108';
update products set off_category = 'en:semi-skimmed-milks', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000028';
update products set off_category = 'en:unsalted-butters', unit_kg = 0.25 where id = '00000000-0000-0000-0001-000000000029';
update products set off_category = 'en:grated-emmentaler', unit_kg = 0.2 where id = '00000000-0000-0000-0001-000000000030';
update products set off_category = 'en:parmigiano-reggiano', unit_kg = 0.1 where id = '00000000-0000-0000-0001-000000000031';
update products set off_category = 'en:mozzarella', unit_kg = 0.125 where id = '00000000-0000-0000-0001-000000000032';
update products set off_category = 'en:goat-cheese-logs', unit_kg = 0.18 where id = '00000000-0000-0000-0001-000000000033';
update products set off_category = 'en:cremes-fraiches', unit_kg = 0.2 where id = '00000000-0000-0000-0001-000000000034';
update products set off_category = 'en:shortcrust-pastry', unit_kg = 0.23 where id = '00000000-0000-0000-0001-000000000035';
update products set off_category = 'en:puff-pastry-sheets', unit_kg = 0.23 where id = '00000000-0000-0000-0001-000000000036';
update products set off_category = 'en:green-pestos', unit_kg = 0.19 where id = '00000000-0000-0000-0001-000000000037';
update products set off_category = 'en:penne', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000038';
update products set off_category = 'en:spaghetti', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000039';
update products set off_category = 'en:lasagna-sheets', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000040';
update products set off_category = 'en:basmati-rices', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000041';
update products set off_category = 'en:rices-for-risotto', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000042';
update products set off_category = 'en:durum-wheat-semolinas-for-couscous', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000043';
update products set off_category = 'en:quinoa', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000044';
update products set off_category = 'en:decorticated-red-lentils', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000045';
update products set off_category = 'en:green-lentils', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000046';
update products set off_category = 'en:canned-chickpeas', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000047';
update products set off_category = 'en:canned-red-kidney-beans', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000048';
update products set off_category = 'en:canned-tomatoes', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000049';
update products set off_category = 'en:strained-tomatoes', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000050';
update products set off_category = 'en:canned-sweet-corn', unit_kg = 0.3 where id = '00000000-0000-0000-0001-000000000051';
update products set off_category = 'en:tunas-in-brine', unit_kg = 0.14 where id = '00000000-0000-0000-0001-000000000052';
update products set off_category = 'en:potato-gnocchi', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000053';
update products set off_category = 'en:wheat-flatbreads', unit_kg = 0.32 where id = '00000000-0000-0000-0001-000000000054';
update products set off_category = 'en:shelled-chestnuts', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000055';
update products set off_category = 'en:walnut-kernels', unit_kg = 0.1 where id = '00000000-0000-0000-0001-000000000056';
update products set off_category = 'en:soy-sauces', unit_kg = 0.25 where id = '00000000-0000-0000-0001-000000000057';
update products set off_category = 'en:peanut-butters', unit_kg = 0.35 where id = '00000000-0000-0000-0001-000000000058';
update products set off_category = 'en:curry-powders', unit_kg = 0.05 where id = '00000000-0000-0000-0001-000000000059';
update products set off_category = 'en:ground-cumin-seeds', unit_kg = 0.04 where id = '00000000-0000-0000-0001-000000000060';
update products set off_category = 'en:paprika', unit_kg = 0.04 where id = '00000000-0000-0000-0001-000000000061';
update products set off_category = 'en:ras-el-hanout', unit_kg = 0.04 where id = '00000000-0000-0000-0001-000000000062';
update products set off_category = 'en:herbes-de-provence', unit_kg = 0.03 where id = '00000000-0000-0000-0001-000000000063';
update products set off_category = 'en:wheat-flours', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000064';
update products set off_category = 'en:dijon-mustards', unit_kg = 0.37 where id = '00000000-0000-0000-0001-000000000065';
update products set off_category = 'en:turmeric', unit_kg = 0.04 where id = '00000000-0000-0000-0001-000000000066';
update products set off_category = 'en:chicken-breasts', unit_kg = 0.6 where id = '00000000-0000-0000-0001-000000000067';
update products set off_category = 'en:chicken-thighs', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000068';
update products set off_category = 'en:ground-beef-steaks', unit_kg = 0.5 where id = '00000000-0000-0000-0001-000000000069';
update products set off_category = 'en:beef-stew-meat', unit_kg = 0.6 where id = '00000000-0000-0000-0001-000000000070';
update products set off_category = 'en:smoked-lardons', unit_kg = 0.2 where id = '00000000-0000-0000-0001-000000000071';
update products set off_category = 'en:toulouse-sausages', unit_kg = 0.6 where id = '00000000-0000-0000-0001-000000000072';
update products set off_category = 'en:white-hams', unit_kg = 0.16 where id = '00000000-0000-0000-0001-000000000073';
update products set off_category = 'en:salmon-fillets', unit_kg = 0.25 where id = '00000000-0000-0000-0001-000000000074';
update products set off_category = 'en:pollock-fillets', unit_kg = 0.4 where id = '00000000-0000-0000-0001-000000000075';
update products set off_category = 'en:frozen-chopped-spinachs', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000076';
update products set off_category = 'en:frozen-green-beans', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000077';
update products set off_category = 'en:frozen-green-peas', unit_kg = 1 where id = '00000000-0000-0000-0001-000000000078';

update recipes set family = 'soupe', tags = '{lactose,enfants,batch}', diets = '{omnivore,sans_porc,vegetarien,halal}' where id = '00000000-0000-0000-0000-000000000201';

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000001', 'soupe-poireaux-pommes-de-terre', 'Soupe de poireaux et pommes de terre', 'La soupe de grand-mère, douce et rassasiante.', 4, 15, 30, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'soupeverte', 'soupe', '{lactose,enfants,batch,robot}', '{plaques}', 'francaise', '[{"text":"Lave et émince les poireaux, épluche et coupe les pommes de terre en cubes.","minutes":15},{"text":"Fais revenir l''oignon dans l''huile, ajoute les légumes, couvre d''eau et ajoute le bouillon.","minutes":5},{"text":"Laisse cuire 25 min, mixe et ajoute la crème.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000001', '1 kg de poireaux', '00000000-0000-0000-0001-000000000010', 1, false, 1),
  ('00000000-0000-0000-0002-000000000001', '500 g de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.2, false, 2),
  ('00000000-0000-0000-0002-000000000001', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000001', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 4),
  ('00000000-0000-0000-0002-000000000001', '10 cl de crème', '00000000-0000-0000-0000-000000000103', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000001', '1 filet d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.01, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000002', 'veloute-carottes-cumin', 'Velouté de carottes au cumin', 'Une soupe orange, sucrée et un peu parfumée.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'soupe', 'soupe', '{lactose,enfants,batch,monde,robot}', '{plaques}', 'francaise', '[{"text":"Épluche et coupe les carottes, la pomme de terre et l’oignon.","minutes":10},{"text":"Couvre d''eau avec le bouillon et le cumin, laisse cuire 20 min.","minutes":20},{"text":"Mixe avec la crème, rectifie l’assaisonnement.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000002', '1 kg de carottes', '00000000-0000-0000-0001-000000000009', 1, false, 1),
  ('00000000-0000-0000-0002-000000000002', '1 pomme de terre', '00000000-0000-0000-0001-000000000011', 0.1, false, 2),
  ('00000000-0000-0000-0002-000000000002', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000002', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 4),
  ('00000000-0000-0000-0002-000000000002', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 5),
  ('00000000-0000-0000-0002-000000000002', '10 cl de crème', '00000000-0000-0000-0000-000000000103', 0.5, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000003', 'veloute-chou-fleur', 'Velouté de chou-fleur', 'Onctueux sans beaucoup de crème, servi avec du pain grillé.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'soupe', 'soupe', '{lactose,batch,robot}', '{plaques}', 'francaise', '[{"text":"Détaille le chou-fleur en bouquets, coupe la pomme de terre.","minutes":10},{"text":"Fais cuire 20 min dans le lait et un peu d’eau avec le bouillon.","minutes":20},{"text":"Mixe, parsème d’emmental et sers avec le pain grillé.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000003', '1 chou-fleur', '00000000-0000-0000-0001-000000000014', 1, false, 1),
  ('00000000-0000-0000-0002-000000000003', '1 pomme de terre', '00000000-0000-0000-0001-000000000011', 0.1, false, 2),
  ('00000000-0000-0000-0002-000000000003', '30 cl de lait', '00000000-0000-0000-0001-000000000028', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000003', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 4),
  ('00000000-0000-0000-0002-000000000003', '50 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.25, false, 5),
  ('00000000-0000-0000-0002-000000000003', '1 pain de campagne', '00000000-0000-0000-0000-000000000106', 1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000004', 'curry-pois-chiches-courge', 'Curry de pois chiches et courge', 'Un curry doux au lait de coco, encore meilleur le lendemain.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'curry', 'curry', '{epice,batch,equilibre,monde,robot}', '{plaques}', 'indienne', '[{"text":"Coupe la courge en cubes et émince l’oignon.","minutes":10},{"text":"Fais revenir l’oignon avec le curry, ajoute la courge, les tomates et le lait de coco.","minutes":5},{"text":"Ajoute les pois chiches égouttés, laisse mijoter 15 min. Sers avec le riz.","minutes":15}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000004', '2 boîtes de pois chiches', '00000000-0000-0000-0001-000000000047', 2, false, 1),
  ('00000000-0000-0000-0002-000000000004', '½ courge butternut', '00000000-0000-0000-0001-000000000012', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000004', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 3),
  ('00000000-0000-0000-0002-000000000004', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 4),
  ('00000000-0000-0000-0002-000000000004', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000004', '2 c. à café de curry', '00000000-0000-0000-0001-000000000059', 0.1, true, 6),
  ('00000000-0000-0000-0002-000000000004', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000005', 'dahl-lentilles-corail', 'Dahl de lentilles corail', 'Le plat complet le plus économique de la semaine.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'dahl', 'legumineuses', '{epice,batch,equilibre,monde,robot}', '{plaques}', 'indienne', '[{"text":"Émince l’oignon, l’ail et le gingembre.","minutes":5},{"text":"Fais-les revenir avec le curry, ajoute les lentilles rincées, les tomates, le lait de coco et 30 cl d’eau.","minutes":5},{"text":"Laisse cuire 20 min en remuant. Sers avec le riz.","minutes":20}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000005', '300 g de lentilles corail', '00000000-0000-0000-0001-000000000045', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000005', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 2),
  ('00000000-0000-0000-0002-000000000005', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 3),
  ('00000000-0000-0000-0002-000000000005', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000005', '2 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000005', '1 morceau de gingembre', '00000000-0000-0000-0001-000000000023', 0.5, false, 6),
  ('00000000-0000-0000-0002-000000000005', '1 c. à café de curry', '00000000-0000-0000-0001-000000000059', 0.06, true, 7),
  ('00000000-0000-0000-0002-000000000005', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000006', 'chili-sin-carne', 'Chili sin carne', 'Haricots rouges, maïs et poivrons : un chili végétal qui tient au corps.', 4, 15, 30, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'legumineuses', '{epice,batch,equilibre,monde,robot}', '{plaques}', 'americaine', '[{"text":"Coupe les poivrons et l’oignon en dés.","minutes":10},{"text":"Fais-les revenir avec les épices, ajoute les tomates et laisse mijoter 15 min.","minutes":15},{"text":"Ajoute haricots et maïs égouttés, 10 min de plus. Sers avec le riz.","minutes":15}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000006', '2 boîtes de haricots rouges', '00000000-0000-0000-0001-000000000048', 2, false, 1),
  ('00000000-0000-0000-0002-000000000006', '2 boîtes de tomates concassées', '00000000-0000-0000-0001-000000000049', 2, false, 2),
  ('00000000-0000-0000-0002-000000000006', '1 boîte de maïs', '00000000-0000-0000-0001-000000000051', 1, false, 3),
  ('00000000-0000-0000-0002-000000000006', '2 poivrons', '00000000-0000-0000-0001-000000000018', 0.67, false, 4),
  ('00000000-0000-0000-0002-000000000006', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000006', '2 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.1, true, 6),
  ('00000000-0000-0000-0002-000000000006', '2 c. à café de paprika', '00000000-0000-0000-0001-000000000061', 0.1, true, 7),
  ('00000000-0000-0000-0002-000000000006', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000007', 'parmentier-lentilles', 'Parmentier de lentilles', 'Le hachis parmentier version végétarienne, gratiné au four.', 4, 20, 30, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'gratin', 'gratin', '{lactose,enfants,batch,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Fais cuire les lentilles 20 min avec les carottes et l’oignon coupés.","minutes":20},{"text":"Prépare une purée avec les pommes de terre cuites, le lait et le beurre.","minutes":15},{"text":"Lentilles au fond du plat, purée dessus, emmental, 15 min au four à 200 °C.","minutes":15}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000007', '300 g de lentilles vertes', '00000000-0000-0000-0001-000000000046', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000007', '1,2 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000007', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000007', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000007', '30 cl de lait', '00000000-0000-0000-0001-000000000028', 0.3, false, 5),
  ('00000000-0000-0000-0002-000000000007', '40 g de beurre', '00000000-0000-0000-0001-000000000029', 0.15, false, 6),
  ('00000000-0000-0000-0002-000000000007', '60 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.3, false, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000008', 'pates-tomate-basilic', 'Pâtes à la tomate et au basilic', 'Le grand classique du soir pressé.', 4, 5, 15, '{omnivore,sans_porc,vegetarien,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'pates', 'pates', '{lactose,enfants,monde}', '{plaques}', 'italienne', '[{"text":"Fais cuire les pâtes.","minutes":12},{"text":"Pendant ce temps, fais revenir l’ail dans l’huile et ajoute le coulis.","minutes":8},{"text":"Mélange, parsème de parmesan.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000008', '500 g de penne', '00000000-0000-0000-0001-000000000038', 1, false, 1),
  ('00000000-0000-0000-0002-000000000008', '500 g de coulis de tomate', '00000000-0000-0000-0001-000000000050', 1, false, 2),
  ('00000000-0000-0000-0002-000000000008', '2 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000008', '30 g de parmesan', '00000000-0000-0000-0001-000000000031', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000008', '1 filet d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.01, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000009', 'penne-au-thon', 'Penne au thon et à la tomate', 'Un placard, dix minutes, tout le monde à table.', 4, 5, 15, '{omnivore,sans_porc,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'pates', 'pates', '{poisson,enfants,monde}', '{plaques}', 'italienne', '[{"text":"Fais cuire les pâtes.","minutes":12},{"text":"Fais revenir l’oignon, ajoute les tomates, les herbes et le thon émietté.","minutes":8},{"text":"Mélange avec les pâtes égouttées.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000009', '500 g de penne', '00000000-0000-0000-0001-000000000038', 1, false, 1),
  ('00000000-0000-0000-0002-000000000009', '2 boîtes de thon', '00000000-0000-0000-0001-000000000052', 2, false, 2),
  ('00000000-0000-0000-0002-000000000009', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 3),
  ('00000000-0000-0000-0002-000000000009', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000009', '1 c. à café d’herbes de Provence', '00000000-0000-0000-0001-000000000063', 0.05, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000010', 'gnocchis-epinards-creme', 'Gnocchis aux épinards et à la crème', 'Fondant, vert et prêt en un quart d’heure.', 4, 5, 15, '{omnivore,sans_porc,vegetarien,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'pates', 'pates', '{lactose,enfants,gourmand,monde}', '{plaques}', 'italienne', '[{"text":"Fais dorer les gnocchis à la poêle.","minutes":8},{"text":"Ajoute les épinards et l’ail, laisse fondre 5 min.","minutes":5},{"text":"Verse la crème, parsème de parmesan.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000010', '1 kg de gnocchis', '00000000-0000-0000-0001-000000000053', 2, false, 1),
  ('00000000-0000-0000-0002-000000000010', '500 g d’épinards surgelés', '00000000-0000-0000-0001-000000000076', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000010', '20 cl de crème', '00000000-0000-0000-0000-000000000103', 1, false, 3),
  ('00000000-0000-0000-0002-000000000010', '30 g de parmesan', '00000000-0000-0000-0001-000000000031', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000010', '1 gousse d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000011', 'pates-pesto-brocoli', 'Pâtes au pesto et brocoli', 'Le brocoli cuit avec les pâtes, une seule casserole.', 4, 5, 15, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'pates', 'pates', '{lactose,fruits_a_coque,enfants,monde}', '{plaques}', 'italienne', '[{"text":"Détaille le brocoli en petits bouquets.","minutes":5},{"text":"Plonge-les avec les pâtes dans l’eau bouillante.","minutes":12},{"text":"Égoutte, mélange avec le pesto et le parmesan.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000011', '500 g de penne', '00000000-0000-0000-0001-000000000038', 1, false, 1),
  ('00000000-0000-0000-0002-000000000011', '500 g de brocoli', '00000000-0000-0000-0001-000000000015', 1, false, 2),
  ('00000000-0000-0000-0002-000000000011', '1 pot de pesto', '00000000-0000-0000-0001-000000000037', 1, false, 3),
  ('00000000-0000-0000-0002-000000000011', '20 g de parmesan', '00000000-0000-0000-0001-000000000031', 0.2, false, 4);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000012', 'pates-champignons-creme', 'Pâtes aux champignons et à la crème', 'Des champignons dorés, de la crème, du persil.', 4, 5, 15, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'pates', 'pates', '{lactose,monde}', '{plaques}', 'italienne', '[{"text":"Fais cuire les pâtes.","minutes":12},{"text":"Fais dorer les champignons émincés avec l’ail.","minutes":8},{"text":"Ajoute la crème et le persil, mélange avec les pâtes.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000012', '500 g de penne', '00000000-0000-0000-0001-000000000038', 1, false, 1),
  ('00000000-0000-0000-0002-000000000012', '500 g de champignons', '00000000-0000-0000-0001-000000000016', 1, false, 2),
  ('00000000-0000-0000-0002-000000000012', '20 cl de crème', '00000000-0000-0000-0000-000000000103', 1, false, 3),
  ('00000000-0000-0000-0002-000000000012', '1 gousse d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000012', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000013', 'spaghetti-bolognaise', 'Spaghetti bolognaise', 'La sauce mijote pendant que tu mets la table.', 4, 15, 30, '{omnivore,sans_porc}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'pates', 'pates', '{lactose,enfants,batch,monde}', '{plaques}', 'italienne', '[{"text":"Hache l’oignon et la carotte, fais-les revenir avec la viande.","minutes":10},{"text":"Ajoute le coulis, laisse mijoter 20 min.","minutes":20},{"text":"Fais cuire les spaghetti, sers avec le parmesan.","minutes":12}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000013', '500 g de spaghetti', '00000000-0000-0000-0001-000000000039', 1, false, 1),
  ('00000000-0000-0000-0002-000000000013', '500 g de bœuf haché', '00000000-0000-0000-0001-000000000069', 1, false, 2),
  ('00000000-0000-0000-0002-000000000013', '500 g de coulis de tomate', '00000000-0000-0000-0001-000000000050', 1, false, 3),
  ('00000000-0000-0000-0002-000000000013', '1 carotte', '00000000-0000-0000-0001-000000000009', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000013', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000013', '20 g de parmesan', '00000000-0000-0000-0001-000000000031', 0.2, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000014', 'lasagnes-vegetariennes', 'Lasagnes végétariennes', 'Épinards, champignons et mozzarella, en grandes parts.', 4, 25, 40, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'lasagnes', 'pates', '{lactose,enfants,batch,gourmand,monde}', '{four,plaques}', 'italienne', '[{"text":"Fais revenir les champignons et les épinards.","minutes":10},{"text":"Monte les couches : sauce, feuilles, légumes, mozzarella. Termine par l’emmental.","minutes":15},{"text":"40 min au four à 180 °C.","minutes":40}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000014', '250 g de feuilles de lasagnes', '00000000-0000-0000-0001-000000000040', 0.5, false, 1),
  ('00000000-0000-0000-0002-000000000014', '500 g d’épinards surgelés', '00000000-0000-0000-0001-000000000076', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000014', '250 g de champignons', '00000000-0000-0000-0001-000000000016', 0.5, false, 3),
  ('00000000-0000-0000-0002-000000000014', '1 kg de coulis de tomate', '00000000-0000-0000-0001-000000000050', 2, false, 4),
  ('00000000-0000-0000-0002-000000000014', '2 mozzarellas', '00000000-0000-0000-0001-000000000032', 2, false, 5),
  ('00000000-0000-0000-0002-000000000014', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000015', 'gratin-butternut', 'Gratin de courge butternut', 'Fondant, doré, parfait avec une salade verte.', 4, 15, 40, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'gratin', 'gratin', '{lactose,enfants,gourmand}', '{four}', 'francaise', '[{"text":"Épluche la courge et les pommes de terre, coupe-les en fines tranches.","minutes":15},{"text":"Dispose-les dans un plat frotté d’ail, nappe de crème, parsème d’emmental.","minutes":5},{"text":"40 min au four à 190 °C.","minutes":40}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000015', '1 courge butternut', '00000000-0000-0000-0001-000000000012', 1, false, 1),
  ('00000000-0000-0000-0002-000000000015', '2 pommes de terre', '00000000-0000-0000-0001-000000000011', 0.1, false, 2),
  ('00000000-0000-0000-0002-000000000015', '20 cl de crème fraîche', '00000000-0000-0000-0001-000000000034', 1, false, 3),
  ('00000000-0000-0000-0002-000000000015', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 4),
  ('00000000-0000-0000-0002-000000000015', '1 gousse d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000016', 'gratin-chou-fleur', 'Gratin de chou-fleur', 'Une béchamel légère et beaucoup de légumes.', 4, 15, 30, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'gratin', 'gratin', '{lactose,enfants,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Fais cuire les bouquets de chou-fleur 10 min à l’eau.","minutes":10},{"text":"Prépare la béchamel : beurre, farine, puis lait en fouettant.","minutes":10},{"text":"Nappe le chou-fleur, parsème d’emmental, 20 min au four à 200 °C.","minutes":20}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000016', '1 chou-fleur', '00000000-0000-0000-0001-000000000014', 1, false, 1),
  ('00000000-0000-0000-0002-000000000016', '50 cl de lait', '00000000-0000-0000-0001-000000000028', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000016', '50 g de beurre', '00000000-0000-0000-0001-000000000029', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000016', '50 g de farine', '00000000-0000-0000-0001-000000000064', 0.05, true, 4),
  ('00000000-0000-0000-0002-000000000016', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000017', 'hachis-parmentier', 'Hachis parmentier', 'Le plat du dimanche qui fait deux repas.', 4, 25, 30, '{omnivore,sans_porc,sans_gluten}', '{9,10,11,12,1,2,3}', 'gratin', 'gratin', '{lactose,enfants,batch,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Fais cuire les pommes de terre et prépare la purée avec le lait et le beurre.","minutes":25},{"text":"Fais revenir l’oignon et la viande.","minutes":10},{"text":"Viande au fond, purée dessus, emmental, 20 min au four à 200 °C.","minutes":20}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000017', '500 g de bœuf haché', '00000000-0000-0000-0001-000000000069', 1, false, 1),
  ('00000000-0000-0000-0002-000000000017', '1,2 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000017', '30 cl de lait', '00000000-0000-0000-0001-000000000028', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000017', '50 g de beurre', '00000000-0000-0000-0001-000000000029', 0.2, false, 4),
  ('00000000-0000-0000-0002-000000000017', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000017', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000018', 'endives-jambon', 'Endives au jambon', 'Le gratin d’hiver par excellence.', 4, 15, 40, '{omnivore}', '{11,12,1,2,3}', 'gratin', 'gratin', '{lactose,enfants,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Fais cuire les endives 15 min à l’eau, égoutte-les bien.","minutes":15},{"text":"Roule chaque endive dans une tranche de jambon. Prépare la béchamel.","minutes":10},{"text":"Nappe, parsème d’emmental, 25 min au four à 200 °C.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000018', '8 endives', '00000000-0000-0000-0001-000000000017', 1, false, 1),
  ('00000000-0000-0000-0002-000000000018', '8 tranches de jambon', '00000000-0000-0000-0001-000000000073', 2, false, 2),
  ('00000000-0000-0000-0002-000000000018', '50 cl de lait', '00000000-0000-0000-0001-000000000028', 0.5, false, 3),
  ('00000000-0000-0000-0002-000000000018', '50 g de beurre', '00000000-0000-0000-0001-000000000029', 0.2, false, 4),
  ('00000000-0000-0000-0002-000000000018', '50 g de farine', '00000000-0000-0000-0001-000000000064', 0.05, true, 5),
  ('00000000-0000-0000-0002-000000000018', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000019', 'saumon-haricots-verts', 'Saumon, haricots verts et citron', 'Un poisson simple, cuit en 10 minutes.', 4, 10, 20, '{omnivore,sans_porc,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'poisson', 'poisson', '{lactose,poisson}', '{plaques}', 'francaise', '[{"text":"Fais cuire le riz et les haricots verts.","minutes":15},{"text":"Saisis les pavés de saumon 4 min de chaque côté.","minutes":8},{"text":"Arrose de citron et d’une noisette de beurre.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000019', '4 pavés de saumon', '00000000-0000-0000-0001-000000000074', 2, false, 1),
  ('00000000-0000-0000-0002-000000000019', '600 g de haricots verts', '00000000-0000-0000-0001-000000000077', 0.6, false, 2),
  ('00000000-0000-0000-0002-000000000019', '1 citron', '00000000-0000-0000-0001-000000000020', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000019', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000019', '25 g de beurre', '00000000-0000-0000-0001-000000000029', 0.1, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000020', 'colin-puree-carottes', 'Colin, purée maison et carottes', 'Un poisson doux que les enfants aiment bien.', 4, 10, 20, '{omnivore,sans_porc,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'poisson', 'poisson', '{lactose,poisson,enfants}', '{plaques}', 'francaise', '[{"text":"Fais cuire pommes de terre et carottes à l’eau.","minutes":20},{"text":"Fais cuire le colin 8 min à la poêle.","minutes":8},{"text":"Écrase les pommes de terre avec le lait et le beurre.","minutes":5}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000020', '400 g de colin', '00000000-0000-0000-0001-000000000075', 1, false, 1),
  ('00000000-0000-0000-0002-000000000020', '1 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.4, false, 2),
  ('00000000-0000-0000-0002-000000000020', '20 cl de lait', '00000000-0000-0000-0001-000000000028', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000020', '40 g de beurre', '00000000-0000-0000-0001-000000000029', 0.15, false, 4),
  ('00000000-0000-0000-0002-000000000020', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000021', 'omelette-herbes-salade', 'Omelette aux herbes et salade', 'Dix minutes, et un vrai repas.', 4, 10, 10, '{omnivore,sans_porc,vegetarien,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'omelette', 'oeufs', '{lactose,enfants}', '{plaques}', 'francaise', '[{"text":"Bats les œufs avec le persil ciselé et l’emmental.","minutes":5},{"text":"Fais cuire l’omelette à feu moyen.","minutes":6},{"text":"Sers avec la mâche et le pain.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000021', '9 œufs', '00000000-0000-0000-0001-000000000027', 0.75, false, 1),
  ('00000000-0000-0000-0002-000000000021', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 2),
  ('00000000-0000-0000-0002-000000000021', '50 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.25, false, 3),
  ('00000000-0000-0000-0002-000000000021', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 4),
  ('00000000-0000-0000-0002-000000000021', '1 pain de campagne', '00000000-0000-0000-0000-000000000106', 1, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000022', 'tortilla-pommes-de-terre', 'Tortilla de pommes de terre', 'L’omelette épaisse à l’espagnole, chaude ou froide.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'omelette', 'oeufs', '{enfants,equilibre,monde}', '{plaques}', 'europeenne', '[{"text":"Coupe les pommes de terre en fines rondelles, émince les oignons.","minutes":8},{"text":"Fais-les cuire 12 min à la poêle dans l’huile.","minutes":12},{"text":"Verse les œufs battus, cuis 5 min de chaque côté.","minutes":10}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000022', '8 œufs', '00000000-0000-0000-0001-000000000027', 0.67, false, 1),
  ('00000000-0000-0000-0002-000000000022', '750 g de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000022', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000022', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 4),
  ('00000000-0000-0000-0002-000000000022', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000023', 'riz-saute-legumes', 'Riz sauté aux légumes', 'Le meilleur moyen d’utiliser un reste de riz.', 4, 15, 15, '{omnivore,sans_porc,vegetarien,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'riz', 'cereales', '{enfants,equilibre,monde}', '{plaques}', 'asiatique', '[{"text":"Fais cuire le riz (ou utilise un reste).","minutes":12},{"text":"Fais sauter carottes, oignon et petits pois, ajoute le riz.","minutes":8},{"text":"Ajoute les œufs brouillés et la sauce soja.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000023', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 1),
  ('00000000-0000-0000-0002-000000000023', '4 œufs', '00000000-0000-0000-0001-000000000027', 0.33, false, 2),
  ('00000000-0000-0000-0002-000000000023', '300 g de petits pois', '00000000-0000-0000-0001-000000000078', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000023', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000023', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000023', '5 c. à soupe de sauce soja', '00000000-0000-0000-0001-000000000057', 0.3, true, 6),
  ('00000000-0000-0000-0002-000000000023', '2 c. à soupe d''huile', '00000000-0000-0000-0000-000000000105', 0.02, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000024', 'risotto-champignons', 'Risotto aux champignons', 'Crémeux, sans crème, avec du parmesan.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'riz', 'cereales', '{lactose,gourmand,monde,robot}', '{plaques}', 'italienne', '[{"text":"Fais revenir l’oignon et les champignons dans le beurre.","minutes":5},{"text":"Ajoute le riz, puis le bouillon louche par louche en remuant.","minutes":18},{"text":"Hors du feu, ajoute le parmesan.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000024', '350 g de riz rond', '00000000-0000-0000-0001-000000000042', 0.35, false, 1),
  ('00000000-0000-0000-0002-000000000024', '500 g de champignons', '00000000-0000-0000-0001-000000000016', 1, false, 2),
  ('00000000-0000-0000-0002-000000000024', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000024', '2 cubes de bouillon', '00000000-0000-0000-0000-000000000104', 0.2, true, 4),
  ('00000000-0000-0000-0002-000000000024', '50 g de parmesan', '00000000-0000-0000-0001-000000000031', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000024', '25 g de beurre', '00000000-0000-0000-0001-000000000029', 0.1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000025', 'couscous-legumes', 'Couscous de légumes', 'Des légumes d’hiver, des pois chiches, de la semoule.', 4, 20, 40, '{omnivore,sans_porc,vegetarien,vegan,halal}', '{9,10,11,12,1,2,3}', 'riz', 'cereales', '{epice,batch,equilibre,monde}', '{plaques}', 'africaine', '[{"text":"Coupe les légumes en gros morceaux.","minutes":20},{"text":"Fais-les mijoter 35 min avec les tomates, les épices et 1 L d’eau.","minutes":35},{"text":"Ajoute les pois chiches, prépare la semoule.","minutes":5}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000025', '400 g de semoule', '00000000-0000-0000-0001-000000000043', 0.4, false, 1),
  ('00000000-0000-0000-0002-000000000025', '1 boîte de pois chiches', '00000000-0000-0000-0001-000000000047', 1, false, 2),
  ('00000000-0000-0000-0002-000000000025', '4 carottes', '00000000-0000-0000-0001-000000000009', 0.4, false, 3),
  ('00000000-0000-0000-0002-000000000025', '4 navets', '00000000-0000-0000-0001-000000000025', 0.5, false, 4),
  ('00000000-0000-0000-0002-000000000025', '½ courge butternut', '00000000-0000-0000-0001-000000000012', 0.4, false, 5),
  ('00000000-0000-0000-0002-000000000025', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 6),
  ('00000000-0000-0000-0002-000000000025', '2 c. à café de ras el hanout', '00000000-0000-0000-0001-000000000062', 0.1, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000026', 'tarte-poireaux', 'Tarte aux poireaux', 'Fondue de poireaux et crème sur pâte brisée.', 4, 20, 35, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'tarte', 'tarte', '{lactose,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Émince les poireaux et fais-les fondre 15 min à la poêle.","minutes":20},{"text":"Bats les œufs avec la crème, ajoute les poireaux et l’emmental.","minutes":5},{"text":"Verse sur la pâte, 35 min au four à 180 °C.","minutes":35}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000026', '1 pâte brisée', '00000000-0000-0000-0001-000000000035', 1, false, 1),
  ('00000000-0000-0000-0002-000000000026', '800 g de poireaux', '00000000-0000-0000-0001-000000000010', 0.8, false, 2),
  ('00000000-0000-0000-0002-000000000026', '3 œufs', '00000000-0000-0000-0001-000000000027', 0.25, false, 3),
  ('00000000-0000-0000-0002-000000000026', '20 cl de crème', '00000000-0000-0000-0000-000000000103', 1, false, 4),
  ('00000000-0000-0000-0002-000000000026', '100 g d’emmental râpé', '00000000-0000-0000-0001-000000000030', 0.5, false, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000027', 'quiche-lorraine', 'Quiche lorraine', 'La vraie, avec des lardons et beaucoup de crème.', 4, 15, 35, '{omnivore}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'tarte', 'tarte', '{lactose,enfants,gourmand}', '{four,plaques}', 'francaise', '[{"text":"Fais dorer les lardons à la poêle.","minutes":5},{"text":"Bats œufs, crème et lait, ajoute les lardons.","minutes":5},{"text":"Verse sur la pâte, 35 min au four à 180 °C. Sers avec la mâche.","minutes":35}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000027', '1 pâte brisée', '00000000-0000-0000-0001-000000000035', 1, false, 1),
  ('00000000-0000-0000-0002-000000000027', '200 g de lardons', '00000000-0000-0000-0001-000000000071', 1, false, 2),
  ('00000000-0000-0000-0002-000000000027', '3 œufs', '00000000-0000-0000-0001-000000000027', 0.25, false, 3),
  ('00000000-0000-0000-0002-000000000027', '20 cl de crème', '00000000-0000-0000-0000-000000000103', 1, false, 4),
  ('00000000-0000-0000-0002-000000000027', '20 cl de lait', '00000000-0000-0000-0001-000000000028', 0.2, false, 5),
  ('00000000-0000-0000-0002-000000000027', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000028', 'tarte-fine-butternut-chevre', 'Tarte fine butternut et chèvre', 'Sucré-salé, croustillante, avec des noix.', 4, 15, 30, '{omnivore,sans_porc,vegetarien,halal}', '{9,10,11,12,1,2,3}', 'tarte', 'tarte', '{lactose,fruits_a_coque,gourmand}', '{four}', 'francaise', '[{"text":"Coupe la courge en très fines tranches.","minutes":10},{"text":"Dispose-les sur la pâte avec le chèvre en rondelles et les noix.","minutes":5},{"text":"30 min au four à 200 °C. Sers avec la mâche.","minutes":30}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000028', '1 pâte feuilletée', '00000000-0000-0000-0001-000000000036', 1, false, 1),
  ('00000000-0000-0000-0002-000000000028', '½ courge butternut', '00000000-0000-0000-0001-000000000012', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000028', '1 bûche de chèvre', '00000000-0000-0000-0001-000000000033', 1, false, 3),
  ('00000000-0000-0000-0002-000000000028', '30 g de cerneaux de noix', '00000000-0000-0000-0001-000000000056', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000028', '1 pincée d’herbes de Provence', '00000000-0000-0000-0001-000000000063', 0.03, true, 5),
  ('00000000-0000-0000-0002-000000000028', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000029', 'salade-lentilles-feta', 'Salade de lentilles et feta', 'Tiède en hiver, froide en été, toujours rassasiante.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'salade', 'salade', '{lactose,monde}', '{plaques}', 'europeenne', '[{"text":"Fais cuire les lentilles 20 min.","minutes":20},{"text":"Râpe les carottes, cisèle le persil et l’oignon.","minutes":8},{"text":"Mélange avec la feta émiettée et la vinaigrette moutarde.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000029', '300 g de lentilles vertes', '00000000-0000-0000-0001-000000000046', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000029', '200 g de feta', '00000000-0000-0000-0000-000000000107', 1, false, 2),
  ('00000000-0000-0000-0002-000000000029', '2 carottes', '00000000-0000-0000-0001-000000000009', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000029', '½ oignon rouge', '00000000-0000-0000-0000-000000000102', 0.05, false, 4),
  ('00000000-0000-0000-0002-000000000029', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 5),
  ('00000000-0000-0000-0002-000000000029', '1 c. à soupe de moutarde', '00000000-0000-0000-0001-000000000065', 0.05, true, 6),
  ('00000000-0000-0000-0002-000000000029', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.02, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000030', 'salade-quinoa-patate-douce', 'Salade tiède de quinoa et patate douce', 'Patate douce rôtie, mâche, feta et noix.', 4, 15, 25, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'salade', 'salade', '{lactose,fruits_a_coque,air_fryer}', '{four,plaques}', 'francaise', '[{"text":"Rôtis la patate douce en cubes 25 min à 200 °C.","minutes":25},{"text":"Fais cuire le quinoa 12 min.","minutes":12},{"text":"Mélange tout avec la mâche, la feta, les noix et la vinaigrette.","minutes":5}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000030', '250 g de quinoa', '00000000-0000-0000-0001-000000000044', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000030', '2 patates douces', '00000000-0000-0000-0001-000000000013', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000030', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 3),
  ('00000000-0000-0000-0002-000000000030', '100 g de feta', '00000000-0000-0000-0000-000000000107', 0.5, false, 4),
  ('00000000-0000-0000-0002-000000000030', '30 g de cerneaux de noix', '00000000-0000-0000-0001-000000000056', 0.3, false, 5),
  ('00000000-0000-0000-0002-000000000030', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.02, true, 6),
  ('00000000-0000-0000-0002-000000000030', '1 c. à café de moutarde', '00000000-0000-0000-0001-000000000065', 0.03, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000031', 'salade-endives-pommes-noix', 'Salade d’endives, pommes et noix', 'Croquante, avec du chèvre et du pain grillé.', 4, 15, 0, '{omnivore,sans_porc,vegetarien,halal}', '{11,12,1,2,3}', 'salade', 'salade', '{lactose,fruits_a_coque}', '{}', 'francaise', '[{"text":"Émince les endives, coupe les pommes en lamelles.","minutes":10},{"text":"Fais griller le pain avec le chèvre dessus.","minutes":5},{"text":"Mélange avec les noix et la vinaigrette moutarde.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000031', '5 endives', '00000000-0000-0000-0001-000000000017', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000031', '2 pommes', '00000000-0000-0000-0001-000000000021', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000031', '50 g de cerneaux de noix', '00000000-0000-0000-0001-000000000056', 0.5, false, 3),
  ('00000000-0000-0000-0002-000000000031', '1 bûche de chèvre', '00000000-0000-0000-0001-000000000033', 1, false, 4),
  ('00000000-0000-0000-0002-000000000031', '1 pain de campagne', '00000000-0000-0000-0000-000000000106', 1, false, 5),
  ('00000000-0000-0000-0002-000000000031', '1 c. à soupe de moutarde', '00000000-0000-0000-0001-000000000065', 0.05, true, 6),
  ('00000000-0000-0000-0002-000000000031', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.02, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000032', 'legumes-rotis-pois-chiches', 'Légumes rôtis et pois chiches', 'Tout cuit sur la même plaque, avec un peu de feta.', 4, 15, 35, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'salade', 'four', '{lactose,batch,monde,air_fryer}', '{four}', 'francaise', '[{"text":"Coupe les légumes en morceaux, égoutte les pois chiches.","minutes":15},{"text":"Mélange avec l’huile et le cumin sur une plaque, 35 min à 200 °C.","minutes":35},{"text":"Parsème de feta émiettée.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000032', '2 patates douces', '00000000-0000-0000-0001-000000000013', 0.5, false, 1),
  ('00000000-0000-0000-0002-000000000032', '4 carottes', '00000000-0000-0000-0001-000000000009', 0.4, false, 2),
  ('00000000-0000-0000-0002-000000000032', '2 oignons rouges', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000032', '2 boîtes de pois chiches', '00000000-0000-0000-0001-000000000047', 2, false, 4),
  ('00000000-0000-0000-0002-000000000032', '100 g de feta', '00000000-0000-0000-0000-000000000107', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000032', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 6),
  ('00000000-0000-0000-0002-000000000032', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000033', 'potimarron-chataignes-rotis', 'Potimarron et châtaignes rôtis', 'Le goût de l’automne, avec de la feta et des herbes.', 4, 15, 35, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{10,11,12}', 'gratin', 'four', '{lactose,enfants,air_fryer}', '{four}', 'francaise', '[{"text":"Coupe le potimarron en quartiers (sans l’éplucher) et les oignons.","minutes":15},{"text":"Rôtis 25 min à 200 °C, ajoute les châtaignes, encore 10 min.","minutes":35},{"text":"Parsème de feta et d’herbes.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000033', '1 potimarron', '00000000-0000-0000-0000-000000000101', 1, false, 1),
  ('00000000-0000-0000-0002-000000000033', '400 g de châtaignes cuites', '00000000-0000-0000-0001-000000000055', 1, false, 2),
  ('00000000-0000-0000-0002-000000000033', '2 oignons rouges', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000033', '100 g de feta', '00000000-0000-0000-0000-000000000107', 0.5, false, 4),
  ('00000000-0000-0000-0002-000000000033', '1 c. à café d’herbes', '00000000-0000-0000-0001-000000000063', 0.05, true, 5),
  ('00000000-0000-0000-0002-000000000033', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000034', 'cuisses-poulet-roties', 'Cuisses de poulet rôties et pommes de terre', 'Tout au four : on enfourne et on s’occupe d’autre chose.', 4, 10, 45, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'gratin', 'four', '{enfants,equilibre,air_fryer}', '{four,plaques}', 'francaise', '[{"text":"Coupe les pommes de terre en quartiers, dispose-les avec le poulet.","minutes":10},{"text":"Arrose d’huile, d’herbes, 45 min au four à 200 °C.","minutes":45},{"text":"Fais cuire les haricots verts 10 min.","minutes":10}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000034', '4 cuisses de poulet', '00000000-0000-0000-0001-000000000068', 1, false, 1),
  ('00000000-0000-0000-0002-000000000034', '1 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.4, false, 2),
  ('00000000-0000-0000-0002-000000000034', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000034', '1 c. à café d’herbes de Provence', '00000000-0000-0000-0001-000000000063', 0.05, true, 4),
  ('00000000-0000-0000-0002-000000000034', '500 g de haricots verts', '00000000-0000-0000-0001-000000000077', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000034', '2 c. à soupe d''huile', '00000000-0000-0000-0000-000000000105', 0.02, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000035', 'poulet-lait-de-coco', 'Poulet au lait de coco', 'Un curry doux, poivrons et riz basmati.', 4, 15, 25, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'curry', '{epice,equilibre,monde,robot}', '{plaques}', 'asiatique', '[{"text":"Coupe le poulet et les poivrons en morceaux.","minutes":10},{"text":"Fais dorer le poulet avec l’oignon et le curry, ajoute les poivrons.","minutes":10},{"text":"Verse le lait de coco, laisse mijoter 15 min. Sers avec le riz.","minutes":15}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000035', '400 g de filets de poulet', '00000000-0000-0000-0001-000000000067', 0.67, false, 1),
  ('00000000-0000-0000-0002-000000000035', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 2),
  ('00000000-0000-0000-0002-000000000035', '2 poivrons', '00000000-0000-0000-0001-000000000018', 0.67, false, 3),
  ('00000000-0000-0000-0002-000000000035', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000035', '2 c. à café de curry', '00000000-0000-0000-0001-000000000059', 0.08, true, 5),
  ('00000000-0000-0000-0002-000000000035', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000036', 'curry-legumes', 'Curry de légumes', 'Chou-fleur, patate douce et petits pois au lait de coco.', 4, 15, 30, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'curry', 'curry', '{epice,batch,equilibre,monde,robot}', '{plaques}', 'indienne', '[{"text":"Coupe les légumes en morceaux.","minutes":15},{"text":"Fais-les revenir avec le curry, ajoute tomates et lait de coco.","minutes":5},{"text":"Laisse mijoter 25 min, ajoute les petits pois. Sers avec le riz.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000036', '1 chou-fleur', '00000000-0000-0000-0001-000000000014', 1, false, 1),
  ('00000000-0000-0000-0002-000000000036', '2 patates douces', '00000000-0000-0000-0001-000000000013', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000036', '300 g de petits pois', '00000000-0000-0000-0001-000000000078', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000036', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 4),
  ('00000000-0000-0000-0002-000000000036', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 5),
  ('00000000-0000-0000-0002-000000000036', '2 c. à café de curry', '00000000-0000-0000-0001-000000000059', 0.08, true, 6),
  ('00000000-0000-0000-0002-000000000036', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000037', 'poulet-basquaise', 'Poulet basquaise', 'Des poivrons fondants et une sauce tomate au paprika.', 4, 15, 40, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'mijote', '{equilibre,robot}', '{plaques}', 'francaise', '[{"text":"Fais dorer les cuisses de poulet dans une cocotte.","minutes":10},{"text":"Ajoute oignons, ail et poivrons émincés, puis les tomates et le paprika.","minutes":10},{"text":"Laisse mijoter 35 min à couvert. Sers avec le riz.","minutes":35}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000037', '4 cuisses de poulet', '00000000-0000-0000-0001-000000000068', 1, false, 1),
  ('00000000-0000-0000-0002-000000000037', '3 poivrons', '00000000-0000-0000-0001-000000000018', 1, false, 2),
  ('00000000-0000-0000-0002-000000000037', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 3),
  ('00000000-0000-0000-0002-000000000037', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 4),
  ('00000000-0000-0000-0002-000000000037', '2 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000037', '1 c. à café de paprika', '00000000-0000-0000-0001-000000000061', 0.05, true, 6),
  ('00000000-0000-0000-0002-000000000037', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000038', 'chili-con-carne', 'Chili con carne', 'Le chili du week-end, qui se congèle très bien.', 4, 15, 40, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'mijote', '{epice,batch,monde,robot}', '{plaques}', 'americaine', '[{"text":"Fais revenir l’oignon et la viande avec le cumin.","minutes":10},{"text":"Ajoute les tomates, laisse mijoter 25 min.","minutes":25},{"text":"Ajoute les haricots égouttés, 10 min de plus. Sers avec le riz.","minutes":10}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000038', '500 g de bœuf haché', '00000000-0000-0000-0001-000000000069', 1, false, 1),
  ('00000000-0000-0000-0002-000000000038', '2 boîtes de haricots rouges', '00000000-0000-0000-0001-000000000048', 2, false, 2),
  ('00000000-0000-0000-0002-000000000038', '2 boîtes de tomates concassées', '00000000-0000-0000-0001-000000000049', 2, false, 3),
  ('00000000-0000-0000-0002-000000000038', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000038', '2 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.1, true, 5),
  ('00000000-0000-0000-0002-000000000038', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000039', 'saucisses-lentilles', 'Saucisses aux lentilles', 'Un plat de bistrot, simple et réconfortant.', 4, 10, 40, '{omnivore,sans_gluten}', '{9,10,11,12,1,2,3}', 'dahl', 'mijote', '{batch,robot}', '{plaques}', 'francaise', '[{"text":"Fais dorer les saucisses dans une cocotte.","minutes":10},{"text":"Ajoute oignon, carottes, lentilles, bouillon et 80 cl d’eau.","minutes":5},{"text":"Laisse mijoter 35 min à couvert.","minutes":35}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000039', '6 saucisses de Toulouse', '00000000-0000-0000-0001-000000000072', 1, false, 1),
  ('00000000-0000-0000-0002-000000000039', '300 g de lentilles vertes', '00000000-0000-0000-0001-000000000046', 0.6, false, 2),
  ('00000000-0000-0000-0002-000000000039', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000039', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000039', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000040', 'boeuf-bourguignon', 'Bœuf bourguignon', 'Le plat du dimanche, qui mijote tout l’après-midi.', 4, 25, 150, '{omnivore,sans_gluten}', '{11,12,1,2,3}', 'curry', 'mijote', '{batch,robot}', '{plaques}', 'francaise', '[{"text":"Fais dorer la viande et les lardons dans une cocotte.","minutes":15},{"text":"Ajoute légumes, bouillon et eau à hauteur, laisse mijoter 2 h 30 à feu doux.","minutes":150},{"text":"Fais cuire les pommes de terre pour l’accompagnement.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000040', '600 g de bœuf à mijoter', '00000000-0000-0000-0001-000000000070', 1, false, 1),
  ('00000000-0000-0000-0002-000000000040', '4 carottes', '00000000-0000-0000-0001-000000000009', 0.4, false, 2),
  ('00000000-0000-0000-0002-000000000040', '250 g de champignons', '00000000-0000-0000-0001-000000000016', 0.5, false, 3),
  ('00000000-0000-0000-0002-000000000040', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000040', '100 g de lardons', '00000000-0000-0000-0001-000000000071', 0.5, false, 5),
  ('00000000-0000-0000-0002-000000000040', '750 g de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.3, false, 6),
  ('00000000-0000-0000-0002-000000000040', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000041', 'fajitas-poulet-poivrons', 'Fajitas de poulet aux poivrons', 'Chacun garnit sa tortilla à table.', 4, 15, 15, '{omnivore,sans_porc}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'riz', 'wrap', '{epice,enfants,equilibre,monde}', '{plaques}', 'americaine', '[{"text":"Émince le poulet, les poivrons et l’oignon.","minutes":10},{"text":"Fais-les sauter avec les épices.","minutes":12},{"text":"Réchauffe les tortillas et garnis-les.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000041', '8 tortillas', '00000000-0000-0000-0001-000000000054', 1, false, 1),
  ('00000000-0000-0000-0002-000000000041', '400 g de filets de poulet', '00000000-0000-0000-0001-000000000067', 0.67, false, 2),
  ('00000000-0000-0000-0002-000000000041', '3 poivrons', '00000000-0000-0000-0001-000000000018', 1, false, 3),
  ('00000000-0000-0000-0002-000000000041', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000041', '2 c. à café de paprika', '00000000-0000-0000-0001-000000000061', 0.1, true, 5),
  ('00000000-0000-0000-0002-000000000041', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000042', 'soupe-lentilles-corail-carottes', 'Soupe de lentilles corail et carottes', 'Épaisse, douce, relevée d’un trait de citron.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'soupe', 'soupe', '{batch,equilibre,monde,robot}', '{plaques}', 'francaise', '[{"text":"Épluche et coupe les carottes et l’oignon.","minutes":10},{"text":"Fais cuire 20 min avec les lentilles rincées, le cumin, le bouillon et 1 L d’eau.","minutes":20},{"text":"Mixe et ajoute le jus de citron.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000042', '200 g de lentilles corail', '00000000-0000-0000-0001-000000000045', 0.4, false, 1),
  ('00000000-0000-0000-0002-000000000042', '5 carottes', '00000000-0000-0000-0001-000000000009', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000042', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000042', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 4),
  ('00000000-0000-0000-0002-000000000042', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 5),
  ('00000000-0000-0000-0002-000000000042', '½ citron', '00000000-0000-0000-0001-000000000020', 0.2, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000043', 'soupe-butternut-coco', 'Soupe de butternut au lait de coco', 'Veloutée sans crème, parfumée au gingembre.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'soupe', 'soupe', '{enfants,batch,equilibre,monde,robot}', '{plaques}', 'francaise', '[{"text":"Épluche la courge et coupe-la en cubes.","minutes":10},{"text":"Fais cuire 20 min avec l’oignon, le gingembre, le bouillon et 60 cl d’eau.","minutes":20},{"text":"Mixe avec le lait de coco.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000043', '1 courge butternut', '00000000-0000-0000-0001-000000000012', 1, false, 1),
  ('00000000-0000-0000-0002-000000000043', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 2),
  ('00000000-0000-0000-0002-000000000043', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000043', '1 petit morceau de gingembre', '00000000-0000-0000-0001-000000000023', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000043', '1 cube de bouillon', '00000000-0000-0000-0000-000000000104', 0.1, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000044', 'poelee-pommes-de-terre-champignons', 'Poêlée de pommes de terre et champignons', 'Dorée à la poêle, avec beaucoup de persil et d’ail.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'gratin', 'poelee', '{enfants,equilibre}', '{plaques}', 'francaise', '[{"text":"Coupe les pommes de terre en petits cubes.","minutes":8},{"text":"Fais-les dorer 15 min, ajoute les champignons émincés et l’ail.","minutes":20},{"text":"Parsème de persil, sers avec la mâche.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000044', '1 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.4, false, 1),
  ('00000000-0000-0000-0002-000000000044', '500 g de champignons', '00000000-0000-0000-0001-000000000016', 1, false, 2),
  ('00000000-0000-0000-0002-000000000044', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 3),
  ('00000000-0000-0000-0002-000000000044', '2 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000044', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 5),
  ('00000000-0000-0000-0002-000000000044', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000045', 'chou-saute-pommes-de-terre', 'Chou sauté aux pommes de terre et cumin', 'Un plat d’hiver simple et parfumé.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{11,12,1,2,3}', 'soupeverte', 'poelee', '{equilibre,monde}', '{plaques}', 'francaise', '[{"text":"Émince le chou, coupe les pommes de terre en dés.","minutes":10},{"text":"Fais dorer les pommes de terre et l’oignon 10 min.","minutes":10},{"text":"Ajoute le chou et le cumin, couvre et laisse cuire 10 min.","minutes":10}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000045', '1 chou vert', '00000000-0000-0000-0001-000000000026', 1, false, 1),
  ('00000000-0000-0000-0002-000000000045', '750 g de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000045', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000045', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 4),
  ('00000000-0000-0000-0002-000000000045', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000046', 'salade-pois-chiches-citron', 'Salade de pois chiches, carottes et citron', 'Fraîche, croquante, prête sans cuisson.', 4, 15, 0, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'salade', 'salade', '{equilibre,monde}', '{}', 'francaise', '[{"text":"Rince et égoutte les pois chiches, râpe les carottes.","minutes":10},{"text":"Cisèle le persil.","minutes":3},{"text":"Mélange avec le jus de citron, l’huile et le cumin.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000046', '2 boîtes de pois chiches', '00000000-0000-0000-0001-000000000047', 2, false, 1),
  ('00000000-0000-0000-0002-000000000046', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000046', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 3),
  ('00000000-0000-0000-0002-000000000046', '1 citron', '00000000-0000-0000-0001-000000000020', 0.3, false, 4),
  ('00000000-0000-0000-0002-000000000046', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 5),
  ('00000000-0000-0000-0002-000000000046', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000047', 'taboule-quinoa-hiver', 'Taboulé d’hiver au quinoa', 'Quinoa, pomme, carotte et persil, citronné.', 4, 15, 12, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'salade', 'salade', '{equilibre}', '{plaques}', 'francaise', '[{"text":"Fais cuire le quinoa 12 min, laisse tiédir.","minutes":12},{"text":"Coupe la pomme et râpe les carottes, cisèle le persil.","minutes":10},{"text":"Mélange avec le citron et l’huile.","minutes":2}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000047', '250 g de quinoa', '00000000-0000-0000-0001-000000000044', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000047', '1 pomme', '00000000-0000-0000-0001-000000000021', 0.2, false, 2),
  ('00000000-0000-0000-0002-000000000047', '2 carottes', '00000000-0000-0000-0001-000000000009', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000047', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 4),
  ('00000000-0000-0000-0002-000000000047', '1 citron', '00000000-0000-0000-0001-000000000020', 0.3, false, 5),
  ('00000000-0000-0000-0002-000000000047', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000048', 'riz-haricots-rouges-mais', 'Riz aux haricots rouges et maïs', 'Un riz complet en un plat, façon Louisiane.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'riz', 'cereales', '{enfants,equilibre,monde}', '{plaques}', 'americaine', '[{"text":"Fais cuire le riz.","minutes":15},{"text":"Fais revenir l’oignon et les poivrons avec le paprika.","minutes":10},{"text":"Ajoute haricots et maïs égouttés, mélange avec le riz.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000048', '350 g de riz', '00000000-0000-0000-0001-000000000041', 0.35, false, 1),
  ('00000000-0000-0000-0002-000000000048', '2 boîtes de haricots rouges', '00000000-0000-0000-0001-000000000048', 2, false, 2),
  ('00000000-0000-0000-0002-000000000048', '1 boîte de maïs', '00000000-0000-0000-0001-000000000051', 1, false, 3),
  ('00000000-0000-0000-0002-000000000048', '2 poivrons', '00000000-0000-0000-0001-000000000018', 0.67, false, 4),
  ('00000000-0000-0000-0002-000000000048', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000048', '1 c. à café de paprika', '00000000-0000-0000-0001-000000000061', 0.05, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000049', 'quinoa-saute-legumes', 'Quinoa sauté aux légumes et pois chiches', 'Comme un riz sauté, sans gluten.', 4, 10, 20, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'riz', 'cereales', '{equilibre,monde}', '{plaques}', 'asiatique', '[{"text":"Fais cuire le quinoa 12 min.","minutes":12},{"text":"Fais sauter carottes et petits pois 8 min avec le cumin.","minutes":8},{"text":"Ajoute pois chiches et quinoa, mélange.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000049', '250 g de quinoa', '00000000-0000-0000-0001-000000000044', 0.6, false, 1),
  ('00000000-0000-0000-0002-000000000049', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000049', '300 g de petits pois', '00000000-0000-0000-0001-000000000078', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000049', '1 boîte de pois chiches', '00000000-0000-0000-0001-000000000047', 1, false, 4),
  ('00000000-0000-0000-0002-000000000049', '1 c. à café de cumin', '00000000-0000-0000-0001-000000000060', 0.05, true, 5),
  ('00000000-0000-0000-0002-000000000049', '2 c. à soupe d''huile', '00000000-0000-0000-0000-000000000105', 0.02, true, 6);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000050', 'omelette-champignons', 'Omelette aux champignons', 'Des champignons dorés et une omelette baveuse.', 4, 10, 10, '{omnivore,sans_porc,vegetarien,halal,sans_gluten}', '{9,10,11,12,1,2,3}', 'omelette', 'oeufs', '{enfants,equilibre}', '{plaques}', 'francaise', '[{"text":"Fais dorer les champignons émincés.","minutes":5},{"text":"Verse les œufs battus avec le persil, cuis à feu moyen.","minutes":6},{"text":"Sers avec la mâche.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000050', '8 œufs', '00000000-0000-0000-0001-000000000027', 0.67, false, 1),
  ('00000000-0000-0000-0002-000000000050', '250 g de champignons', '00000000-0000-0000-0001-000000000016', 0.5, false, 2),
  ('00000000-0000-0000-0002-000000000050', '1 botte de persil', '00000000-0000-0000-0001-000000000024', 1, false, 3),
  ('00000000-0000-0000-0002-000000000050', '1 sachet de mâche', '00000000-0000-0000-0001-000000000022', 1, false, 4),
  ('00000000-0000-0000-0002-000000000050', '2 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.02, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000051', 'spaghetti-epinards-tomate', 'Spaghetti aux épinards et à la tomate', 'Une sauce express, sans fromage.', 4, 5, 15, '{omnivore,sans_porc,vegetarien,vegan,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'pates', 'pates', '{enfants,equilibre,monde}', '{plaques}', 'italienne', '[{"text":"Fais cuire les spaghetti.","minutes":12},{"text":"Fais revenir l’ail, ajoute les épinards puis les tomates, 8 min.","minutes":8},{"text":"Mélange avec les pâtes.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000051', '500 g de spaghetti', '00000000-0000-0000-0001-000000000039', 1, false, 1),
  ('00000000-0000-0000-0002-000000000051', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 2),
  ('00000000-0000-0000-0002-000000000051', '400 g d’épinards surgelés', '00000000-0000-0000-0001-000000000076', 0.4, false, 3),
  ('00000000-0000-0000-0002-000000000051', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.15, false, 4),
  ('00000000-0000-0000-0002-000000000051', '3 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.03, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000052', 'colin-citron-riz', 'Colin au citron, riz et haricots verts', 'Un poisson léger, cuit au four en 15 minutes.', 4, 10, 20, '{omnivore,sans_porc,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'poisson', 'poisson', '{poisson,enfants,equilibre,air_fryer}', '{four,plaques}', 'francaise', '[{"text":"Fais cuire le riz et les haricots verts.","minutes":15},{"text":"Dispose le colin dans un plat avec l’huile et des rondelles de citron, 15 min à 200 °C.","minutes":15},{"text":"Sers aussitôt.","minutes":1}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000052', '400 g de colin', '00000000-0000-0000-0001-000000000075', 1, false, 1),
  ('00000000-0000-0000-0002-000000000052', '1 citron', '00000000-0000-0000-0001-000000000020', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000052', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000052', '500 g de haricots verts', '00000000-0000-0000-0001-000000000077', 0.5, false, 4),
  ('00000000-0000-0000-0002-000000000052', '2 c. à soupe d''huile d''olive', '00000000-0000-0000-0000-000000000105', 0.02, true, 5);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000053', 'rougail-saucisses', 'Rougail saucisses', 'Le plat du dimanche à La Réunion : saucisses mijotées à la tomate, riz blanc.', 4, 15, 35, '{omnivore,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'mijote', '{batch,monde,robot}', '{plaques}', 'reunionnaise', '[{"text":"Pique les saucisses et fais-les bouillir 5 min pour les dessaler, puis coupe-les en rondelles.","minutes":8},{"text":"Fais-les dorer dans une cocotte avec l’huile, ajoute l’oignon émincé, l’ail et le gingembre pilés.","minutes":7},{"text":"Ajoute les tomates et laisse mijoter 25 min à couvert. Sers avec le riz, le piment à part.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000053', '6 saucisses', '00000000-0000-0000-0001-000000000072', 1, false, 1),
  ('00000000-0000-0000-0002-000000000053', '2 boîtes de tomates concassées', '00000000-0000-0000-0001-000000000049', 2, false, 2),
  ('00000000-0000-0000-0002-000000000053', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000053', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000053', '20 g de gingembre', '00000000-0000-0000-0001-000000000023', 0.2, false, 5),
  ('00000000-0000-0000-0002-000000000053', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 6),
  ('00000000-0000-0000-0002-000000000053', '3 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.03, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000054', 'cari-poulet', 'Cari de poulet', 'Le cari réunionnais : poulet mijoté au curcuma, tomate et gingembre.', 4, 15, 40, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'curry', '{enfants,batch,equilibre,monde,robot}', '{plaques}', 'reunionnaise', '[{"text":"Fais dorer les morceaux de poulet dans l’huile, dans une cocotte.","minutes":10},{"text":"Ajoute l’oignon, l’ail et le gingembre pilés, puis le curcuma : remue 2 min.","minutes":5},{"text":"Ajoute les tomates, couvre et laisse mijoter 30 min. Sers avec le riz.","minutes":30}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000054', '1 kg de cuisses de poulet', '00000000-0000-0000-0001-000000000068', 1, false, 1),
  ('00000000-0000-0000-0002-000000000054', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 2),
  ('00000000-0000-0000-0002-000000000054', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000054', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000054', '20 g de gingembre', '00000000-0000-0000-0001-000000000023', 0.2, false, 5),
  ('00000000-0000-0000-0002-000000000054', '1 c. à soupe de curcuma', '00000000-0000-0000-0001-000000000066', 0.1, true, 6),
  ('00000000-0000-0000-0002-000000000054', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 7),
  ('00000000-0000-0000-0002-000000000054', '3 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.03, true, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000055', 'cari-lentilles', 'Cari de lentilles et riz', 'Les grains à la réunionnaise : lentilles mijotées au curcuma, riz blanc.', 4, 10, 35, '{omnivore,sans_porc,vegetarien,vegan,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'dahl', 'legumineuses', '{batch,equilibre,monde,robot}', '{plaques}', 'reunionnaise', '[{"text":"Fais revenir l’oignon, l’ail et le gingembre dans l’huile, ajoute le curcuma.","minutes":5},{"text":"Ajoute les lentilles, les tomates et 1 L d’eau : laisse cuire 30 min à petit feu.","minutes":30},{"text":"Fais cuire le riz et sers ensemble.","minutes":15}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000055', '500 g de lentilles', '00000000-0000-0000-0001-000000000046', 1, false, 1),
  ('00000000-0000-0000-0002-000000000055', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 2),
  ('00000000-0000-0000-0002-000000000055', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 3),
  ('00000000-0000-0000-0002-000000000055', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 4),
  ('00000000-0000-0000-0002-000000000055', '1 c. à soupe de curcuma', '00000000-0000-0000-0001-000000000066', 0.1, true, 5),
  ('00000000-0000-0000-0002-000000000055', '10 g de gingembre', '00000000-0000-0000-0001-000000000023', 0.1, false, 6),
  ('00000000-0000-0000-0002-000000000055', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 7),
  ('00000000-0000-0000-0002-000000000055', '3 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.03, true, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000056', 'colombo-poulet', 'Colombo de poulet', 'Le colombo des Antilles : poulet et pommes de terre aux épices, citron.', 4, 15, 40, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'curry', '{epice,equilibre,monde,robot}', '{plaques}', 'iles', '[{"text":"Coupe le poulet en morceaux et fais-le mariner 10 min avec le jus d’un citron et l’ail.","minutes":10},{"text":"Fais dorer le poulet et l’oignon dans l’huile, ajoute la poudre à colombo.","minutes":8},{"text":"Ajoute les pommes de terre en cubes et 40 cl d’eau, laisse mijoter 30 min. Sers avec le riz.","minutes":30}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000056', '600 g de filets de poulet', '00000000-0000-0000-0001-000000000067', 1, false, 1),
  ('00000000-0000-0000-0002-000000000056', '500 g de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.2, false, 2),
  ('00000000-0000-0000-0002-000000000056', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000056', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000056', '2 c. à soupe de poudre à colombo (ou curry)', '00000000-0000-0000-0001-000000000059', 0.1, true, 5),
  ('00000000-0000-0000-0002-000000000056', '2 citrons', '00000000-0000-0000-0001-000000000020', 0.5, false, 6),
  ('00000000-0000-0000-0002-000000000056', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 7),
  ('00000000-0000-0000-0002-000000000056', '3 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.03, true, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000057', 'colin-coco-citron', 'Colin au lait de coco et citron', 'Un poisson des îles, doux et parfumé, prêt en 30 minutes.', 4, 10, 20, '{omnivore,sans_porc,halal,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'poisson', 'poisson', '{poisson,enfants,equilibre,monde}', '{plaques}', 'iles', '[{"text":"Fais cuire le riz.","minutes":15},{"text":"Fais revenir l’oignon et le gingembre dans l’huile, verse le lait de coco et le jus des citrons.","minutes":5},{"text":"Ajoute le colin en morceaux et laisse frémir 10 min. Sers avec le riz.","minutes":10}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000057', '600 g de filets de colin', '00000000-0000-0000-0001-000000000075', 1.5, false, 1),
  ('00000000-0000-0000-0002-000000000057', '40 cl de lait de coco', '00000000-0000-0000-0000-000000000108', 1, false, 2),
  ('00000000-0000-0000-0002-000000000057', '2 citrons', '00000000-0000-0000-0001-000000000020', 0.5, false, 3),
  ('00000000-0000-0000-0002-000000000057', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000057', '20 g de gingembre', '00000000-0000-0000-0001-000000000023', 0.2, false, 5),
  ('00000000-0000-0000-0002-000000000057', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 6),
  ('00000000-0000-0000-0002-000000000057', '2 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.02, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000058', 'poulet-yassa', 'Poulet yassa', 'Le classique sénégalais : poulet mariné au citron, fondue d’oignons.', 4, 20, 45, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'curry', 'mijote', '{equilibre,monde,robot}', '{plaques}', 'africaine', '[{"text":"Fais mariner le poulet avec le jus des citrons, la moutarde, l’ail et les oignons émincés (1 h si tu as le temps).","minutes":15},{"text":"Fais dorer le poulet dans l’huile, puis les oignons de la marinade jusqu’à ce qu’ils fondent.","minutes":15},{"text":"Remets le poulet, ajoute la marinade et laisse mijoter 30 min. Sers avec le riz.","minutes":30}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000058', '1 kg de cuisses de poulet', '00000000-0000-0000-0001-000000000068', 1, false, 1),
  ('00000000-0000-0000-0002-000000000058', '6 oignons', '00000000-0000-0000-0000-000000000102', 0.6, false, 2),
  ('00000000-0000-0000-0002-000000000058', '4 citrons', '00000000-0000-0000-0001-000000000020', 1, false, 3),
  ('00000000-0000-0000-0002-000000000058', '2 c. à soupe de moutarde', '00000000-0000-0000-0001-000000000065', 0.08, true, 4),
  ('00000000-0000-0000-0002-000000000058', '3 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 5),
  ('00000000-0000-0000-0002-000000000058', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 6),
  ('00000000-0000-0000-0002-000000000058', '4 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.04, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000059', 'mafe-boeuf', 'Mafé de bœuf', 'Le mafé d’Afrique de l’Ouest : bœuf mijoté dans une sauce à l’arachide.', 4, 20, 70, '{omnivore,sans_porc,sans_gluten}', '{9,10,11,12,1,2,3}', 'curry', 'mijote', '{fruits_a_coque,batch,equilibre,monde,robot}', '{plaques}', 'africaine', '[{"text":"Fais dorer le bœuf en cubes et l’oignon dans l’huile, dans une cocotte.","minutes":10},{"text":"Délaye le beurre de cacahuète dans 50 cl d’eau chaude, verse-le avec les tomates.","minutes":5},{"text":"Ajoute carottes et patates douces, couvre et laisse mijoter 1 h. Sers avec le riz.","minutes":60}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000059', '600 g de bœuf à mijoter', '00000000-0000-0000-0001-000000000070', 1, false, 1),
  ('00000000-0000-0000-0002-000000000059', '150 g de beurre de cacahuète', '00000000-0000-0000-0001-000000000058', 0.43, false, 2),
  ('00000000-0000-0000-0002-000000000059', '1 boîte de tomates concassées', '00000000-0000-0000-0001-000000000049', 1, false, 3),
  ('00000000-0000-0000-0002-000000000059', '2 oignons', '00000000-0000-0000-0000-000000000102', 0.2, false, 4),
  ('00000000-0000-0000-0002-000000000059', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 5),
  ('00000000-0000-0000-0002-000000000059', '500 g de patates douces', '00000000-0000-0000-0001-000000000013', 0.5, false, 6),
  ('00000000-0000-0000-0002-000000000059', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 7),
  ('00000000-0000-0000-0002-000000000059', '2 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.02, true, 8);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000060', 'fish-pie', 'Fish pie', 'La tourte de poisson anglaise, sans pâte : colin et petits pois sous une purée gratinée.', 4, 25, 30, '{omnivore,sans_porc,halal}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'gratin', 'gratin', '{lactose,poisson,enfants,gourmand,monde}', '{four,plaques}', 'anglaise', '[{"text":"Fais cuire les pommes de terre et écrase-les avec la moitié du beurre et un peu de lait.","minutes":20},{"text":"Fais une sauce blanche avec le reste du beurre, la farine et le lait, ajoute le colin en morceaux, l’oignon et les petits pois.","minutes":10},{"text":"Verse dans un plat, couvre de purée et fais gratiner 25 min à 200 °C.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000060', '400 g de filets de colin', '00000000-0000-0000-0001-000000000075', 1, false, 1),
  ('00000000-0000-0000-0002-000000000060', '1 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.4, false, 2),
  ('00000000-0000-0000-0002-000000000060', '40 cl de lait', '00000000-0000-0000-0001-000000000028', 0.4, false, 3),
  ('00000000-0000-0000-0002-000000000060', '40 g de beurre', '00000000-0000-0000-0001-000000000029', 0.16, false, 4),
  ('00000000-0000-0000-0002-000000000060', '300 g de petits pois', '00000000-0000-0000-0001-000000000078', 0.3, false, 5),
  ('00000000-0000-0000-0002-000000000060', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 6),
  ('00000000-0000-0000-0002-000000000060', '2 c. à soupe de farine', '00000000-0000-0000-0001-000000000064', 0.03, true, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000061', 'cottage-pie', 'Cottage pie', 'Le hachis anglais : bœuf, carottes et petits pois sous une purée dorée.', 4, 25, 30, '{omnivore,sans_porc,sans_gluten}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'gratin', 'gratin', '{lactose,enfants,batch,gourmand,monde}', '{four,plaques}', 'anglaise', '[{"text":"Fais cuire les pommes de terre et écrase-les avec le beurre et le lait.","minutes":20},{"text":"Fais revenir l’oignon, le bœuf et les carottes en dés 10 min, ajoute les petits pois.","minutes":10},{"text":"Verse dans un plat, couvre de purée et fais dorer 25 min à 200 °C.","minutes":25}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000061', '500 g de bœuf haché', '00000000-0000-0000-0001-000000000069', 1, false, 1),
  ('00000000-0000-0000-0002-000000000061', '3 carottes', '00000000-0000-0000-0001-000000000009', 0.3, false, 2),
  ('00000000-0000-0000-0002-000000000061', '300 g de petits pois', '00000000-0000-0000-0001-000000000078', 0.3, false, 3),
  ('00000000-0000-0000-0002-000000000061', '1 oignon', '00000000-0000-0000-0000-000000000102', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000061', '1 kg de pommes de terre', '00000000-0000-0000-0001-000000000011', 0.4, false, 5),
  ('00000000-0000-0000-0002-000000000061', '40 g de beurre', '00000000-0000-0000-0001-000000000029', 0.16, false, 6),
  ('00000000-0000-0000-0002-000000000061', '20 cl de lait', '00000000-0000-0000-0001-000000000028', 0.2, false, 7);

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, family, tags, equipment, cuisine, steps, published) values ('00000000-0000-0000-0002-000000000062', 'poulet-soja-gingembre', 'Poulet sauté soja et gingembre', 'Un wok express : poulet, brocoli et riz, sauce soja gingembre.', 4, 15, 15, '{omnivore,sans_porc}', '{1,2,3,4,5,6,7,8,9,10,11,12}', 'riz', 'wok', '{enfants,equilibre,monde}', '{plaques}', 'asiatique', '[{"text":"Fais cuire le riz et le brocoli en petits bouquets.","minutes":12},{"text":"Fais sauter le poulet en lamelles dans l’huile bien chaude, avec l’ail et le gingembre râpés.","minutes":6},{"text":"Ajoute le brocoli et la sauce soja, mélange 2 min et sers sur le riz.","minutes":3}]', true);
insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0002-000000000062', '600 g de filets de poulet', '00000000-0000-0000-0001-000000000067', 1, false, 1),
  ('00000000-0000-0000-0002-000000000062', '6 c. à soupe de sauce soja', '00000000-0000-0000-0001-000000000057', 0.24, true, 2),
  ('00000000-0000-0000-0002-000000000062', '20 g de gingembre', '00000000-0000-0000-0001-000000000023', 0.2, false, 3),
  ('00000000-0000-0000-0002-000000000062', '2 gousses d’ail', '00000000-0000-0000-0001-000000000019', 0.1, false, 4),
  ('00000000-0000-0000-0002-000000000062', '500 g de brocoli', '00000000-0000-0000-0001-000000000015', 1, false, 5),
  ('00000000-0000-0000-0002-000000000062', '300 g de riz', '00000000-0000-0000-0001-000000000041', 0.3, false, 6),
  ('00000000-0000-0000-0002-000000000062', '3 c. à soupe d’huile', '00000000-0000-0000-0000-000000000105', 0.03, true, 7);

