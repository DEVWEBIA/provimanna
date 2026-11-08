-- seed.sql — données d'exemple cohérentes avec les maquettes (supabase db reset).
-- Velouté potimarron : 4,06 € chez Lidl, 4,96 € chez Auchan (vérifié par packages/core/src/seed-consistency.test.ts).
-- Panier semaine (4 pers., 14 repas) : Lidl 60,10 · Aldi 61,40 · E.Leclerc 64,20 · Intermarché 68,90 · Carrefour 70,30 · Auchan 71,60.

insert into stores (id, name, initials, drive_url) values
  ('lidl',        'Lidl',        'LI', null),
  ('aldi',        'Aldi',        'AL', null),
  ('leclerc',     'E.Leclerc',   'EL', 'https://www.leclercdrive.fr'),
  ('intermarche', 'Intermarché', 'IN', 'https://www.intermarche.com'),
  ('carrefour',   'Carrefour',   'CA', 'https://www.carrefour.fr'),
  ('auchan',      'Auchan',      'AU', 'https://www.auchan.fr'),
  ('netto',       'Netto',       'NE', 'https://www.netto.fr'),
  ('super-u',     'Super U',     'SU', 'https://www.coursesu.com'),
  ('grand-frais', 'Grand Frais', 'GF', null),
  ('picard',      'Picard',      'PI', 'https://www.picard.fr'),
  ('franprix',    'Franprix',    'FR', 'https://www.franprix.fr'),
  ('monoprix',    'Monoprix',    'MO', 'https://courses.monoprix.fr'),
  ('match',       'Match',       'MA', null);

insert into store_locations (store_id, label, postal_code, city, lat, lng) values
  ('auchan', 'Auchan Lyon Part-Dieu',   '69003', 'Lyon', 45.7609, 4.8590),
  ('lidl',   'Lidl Lyon Paul Bert',     '69003', 'Lyon', 45.7570, 4.8600),
  ('aldi',   'Aldi Lyon Villette',      '69003', 'Lyon', 45.7540, 4.8630),
  ('carrefour', 'Carrefour City Lafayette', '69003', 'Lyon', 45.7630, 4.8520);

insert into aisles (id, label, position) values
  ('fruits_legumes', 'Fruits et légumes', 1),
  ('boulangerie',    'Boulangerie',       2),
  ('cremerie',       'Crèmerie',          3),
  ('epicerie',       'Épicerie',          4),
  ('viandes_poissons','Viandes et poissons', 5),
  ('surgeles',       'Surgelés',          6),
  ('placard',        'Placard',           7);

insert into products (id, ean, name, quantity_label, aisle_id) values
  ('00000000-0000-0000-0000-000000000101', null,            'Potimarron',              'pièce ≈ 1,2 kg', 'fruits_legumes'),
  ('00000000-0000-0000-0000-000000000102', null,            'Oignons jaunes',          'filet 1 kg',     'fruits_legumes'),
  ('00000000-0000-0000-0000-000000000103', '3250390000001', 'Crème liquide 15 %',      '20 cl',          'cremerie'),
  ('00000000-0000-0000-0000-000000000104', '3250390000002', 'Bouillon de légumes',     'boîte de 10',    'epicerie'),
  ('00000000-0000-0000-0000-000000000105', '3250390000003', 'Huile d''olive',          '1 L',            'placard'),
  ('00000000-0000-0000-0000-000000000106', null,            'Pain de campagne',        '400 g',          'boulangerie'),
  ('00000000-0000-0000-0000-000000000107', '3250390000004', 'Feta AOP',                '200 g',          'cremerie'),
  ('00000000-0000-0000-0000-000000000108', '3250390000005', 'Lait de coco',            '40 cl',          'epicerie');

-- Prix relevés (centimes). observed_at relatif à now() pour rester « frais » en local.
insert into prices (product_id, store_id, cents, observed_at, source) values
  ('00000000-0000-0000-0000-000000000101', 'lidl',   199, now() - interval '1 day',  'open_prices'),
  ('00000000-0000-0000-0000-000000000101', 'auchan', 249, now() - interval '2 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000102', 'lidl',   120, now() - interval '1 day',  'open_prices'),
  ('00000000-0000-0000-0000-000000000102', 'auchan', 159, now() - interval '3 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000103', 'lidl',    89, now() - interval '1 day',  'open_prices'),
  ('00000000-0000-0000-0000-000000000103', 'auchan', 109, now() - interval '2 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000104', 'lidl',    99, now() - interval '4 days', 'open_prices'),
  ('00000000-0000-0000-0000-000000000104', 'auchan', 129, now() - interval '2 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000105', 'lidl',   399, now() - interval '5 days', 'open_prices'),
  ('00000000-0000-0000-0000-000000000105', 'auchan', 499, now() - interval '2 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000106', 'lidl',    70, now() - interval '1 day',  'open_prices'),
  ('00000000-0000-0000-0000-000000000106', 'auchan',  75, now() - interval '2 days', 'ticket'),
  ('00000000-0000-0000-0000-000000000107', 'lidl',   225, now() - interval '1 day',  'ticket'),
  ('00000000-0000-0000-0000-000000000107', 'lidl',   329, now() - interval '1 day',  'ticket'),   -- aberrant (+46 %) : à modérer (BOPrix)
  ('00000000-0000-0000-0000-000000000108', 'carrefour', 139, now() - interval '1 day', 'open_prices');

update prices set flagged_aberrant = true where cents = 329 and product_id = '00000000-0000-0000-0000-000000000107';

insert into recipes (id, slug, title, description, servings, prep_minutes, cook_minutes, diets, season_months, illustration, steps, published, seo_title, seo_description) values
  ('00000000-0000-0000-0000-000000000201', 'veloute-potimarron', 'Velouté de potimarron',
   'Doux, épais, prêt en 35 minutes. Le potimarron se mixe avec la peau.', 4, 10, 25,
   '{omnivore,sans_porc,vegetarien}', '{9,10,11,12,1}', 'soupe',
   '[{"text":"Coupe le potimarron en cubes (sans l''éplucher) et émince les oignons.","minutes":10},{"text":"Fais revenir les oignons 3 min dans un filet d''huile, ajoute le potimarron, couvre d''eau avec le bouillon.","minutes":5},{"text":"Laisse cuire 20 min, mixe avec la crème. Sers avec le pain grillé.","minutes":20}]',
   true, 'Velouté de potimarron : 4,06 € pour 4 (prix relevés cette semaine)',
   'Recette de velouté de potimarron pour 4 personnes, de 4,06 € chez Lidl à 4,96 € chez Auchan. Prix datés, 6 enseignes comparées.');

insert into recipe_ingredients (recipe_id, label, product_id, units, pantry, position) values
  ('00000000-0000-0000-0000-000000000201', '1 potimarron (≈ 1,2 kg)',  '00000000-0000-0000-0000-000000000101', 1,    false, 1),
  ('00000000-0000-0000-0000-000000000201', '2 oignons',                '00000000-0000-0000-0000-000000000102', 0.25, false, 2),
  ('00000000-0000-0000-0000-000000000201', '20 cl de crème liquide',   '00000000-0000-0000-0000-000000000103', 1,    false, 3),
  ('00000000-0000-0000-0000-000000000201', '1 cube de bouillon',       '00000000-0000-0000-0000-000000000104', 0.1,  false, 4),
  ('00000000-0000-0000-0000-000000000201', '1 filet d''huile d''olive','00000000-0000-0000-0000-000000000105', 0.02, true,  5),
  ('00000000-0000-0000-0000-000000000201', '1 pain de campagne',       '00000000-0000-0000-0000-000000000106', 1,    false, 6);

insert into challenges (id, title, description, target, window_weeks) values
  ('sous_70_3_sur_4', 'Défi : 3 semaines sur 4', 'Garde ton panier sous 70 € trois semaines sur quatre.', 3, 4),
  ('serie_8',         'Série de 8 semaines',     'Valide ton plan 8 semaines d''affilée.', 8, 8),
  ('premier_ticket',  'Premier ticket',          'Envoie ton premier ticket de caisse.', 1, 52);

-- ─── Utilisatrice de démo : Marion D. (lien magique local : marion@example.com) ───
-- Les colonnes de jetons doivent valoir '' (et non NULL) : sinon GoTrue refuse la connexion (« Database error finding user »).
insert into auth.users (instance_id, id, aud, role, email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, created_at, updated_at,
                        confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current,
                        reauthentication_token, phone_change, phone_change_token)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000301', 'authenticated', 'authenticated',
        'marion@example.com', now(), '{"name":"Marion D."}', '{"provider":"email","providers":["email"]}', now(), now(),
        '', '', '', '', '', '', '', '');
insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (gen_random_uuid(), '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000301', 'email',
        '{"sub":"00000000-0000-0000-0000-000000000301","email":"marion@example.com","email_verified":true}', now(), now(), now());
-- Le trigger handle_new_user a créé son foyer, son essai et sa série.

update households set name = 'Foyer de Marion', adults = 2, children = 2, diet = 'sans_porc',
  postal_code = '69003', preferred_store_id = 'auchan'
where id = (select household_id from profiles where id = '00000000-0000-0000-0000-000000000301');

update streaks set current_weeks = 6, best_weeks = 6, last_validated_week = date_trunc('week', now())::date - 7
where household_id = (select household_id from profiles where id = '00000000-0000-0000-0000-000000000301');

-- Historique des économies (58,30 € depuis septembre : sept. 9,60 · oct. 38,40 · nov. 10,30)
insert into meal_plans (household_id, week_start, store_id, total_cents, reference_cents, cheapest_store_id, cheapest_cents, validated_at)
select p.household_id, w.week_start, 'lidl', w.ref - w.saving, w.ref, 'lidl', w.ref - w.saving, w.week_start + 3
from profiles p,
  (values ('2026-09-21'::date, 7020, 960),
          ('2026-10-05'::date, 7160, 1150), ('2026-10-12'::date, 6980, 1080),
          ('2026-10-19'::date, 7090, 940),  ('2026-10-26'::date, 6890, 670),
          ('2026-11-02'::date, 7160, 1030)) as w(week_start, ref, saving)
where p.id = '00000000-0000-0000-0000-000000000301';
-- Économie d'une semaine = reference_cents − total_cents (≥ 0), uniquement pour les plans validés.
-- Total : 9,60 + 38,40 + 10,30 = 58,30 €.

-- ─── Staff de démo (local uniquement) : admin@example.com, rôle admin. Connexion par code via Mailpit. ───
insert into auth.users (instance_id, id, aud, role, email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, created_at, updated_at,
                        confirmation_token, recovery_token, email_change_token_new, email_change, email_change_token_current,
                        reauthentication_token, phone_change, phone_change_token)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000401', 'authenticated', 'authenticated',
        'admin@example.com', now(), '{"name":"Admin"}', '{"provider":"email","providers":["email"]}', now(), now(),
        '', '', '', '', '', '', '', '');
insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (gen_random_uuid(), '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000401', 'email',
        '{"sub":"00000000-0000-0000-0000-000000000401","email":"admin@example.com","email_verified":true}', now(), now(), now());
insert into roles (user_id, role) values ('00000000-0000-0000-0000-000000000401', 'admin');
