import { STORE_COUNT, STORE_IDS, STORES_INFO } from '@repas/core';
import { absoluteUrl, ROUTES, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';

// Résumé du site pour les moteurs génératifs (docs/06).
export function GET() {
  const u = absoluteUrl;
  const body = `# ${SITE_NAME}

> Planificateur de repas de la semaine qui compare le coût de la liste de courses dans ${STORE_COUNT} enseignes françaises (${STORE_IDS.map((id) => STORES_INFO[id].name).join(', ')}). Prix issus d'Open Prices et de tickets de caisse, mis à jour chaque jour.

## Données de prix
- [Comparatif de la semaine](${u(ROUTES.comparatif)}): coût d'un panier de 14 repas pour 4 personnes dans les ${STORE_COUNT} enseignes, daté.
- [Méthodologie](${u(ROUTES.methodologie)}): sources, médiane sur 7 jours, indice de fiabilité, traitement des prix aberrants.

- [Enseignes](${u('/enseignes/lidl')}): position de chaque enseigne face à la moyenne, rayon par rayon (une page par enseigne).

## Recettes et menus
- [Toutes les recettes](${u(ROUTES.recettes)}): coût par portion dans chaque enseigne, prix datés.
- [Menu de la semaine pour 4](${u(ROUTES.menus)}): 14 repas, liste de courses par rayon et prix dans ${STORE_COUNT} enseignes.
- [Menu végétarien de la semaine](${u('/menus/menu-vegetarien-semaine-4-personnes')})

## Guides
- [Batch cooking : 5 repas en 2 heures](${u('/guide/batch-cooking')})

## Produit
- [Comment ça marche](${u(ROUTES.commentCaMarche)})
- [Tarifs](${u(ROUTES.tarifs)}): gratuit, Premium 4,99 €/mois ou 39,99 €/an, essai 14 jours sans carte.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
