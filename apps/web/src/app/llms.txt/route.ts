import { absoluteUrl, ROUTES, SITE_NAME } from '@/lib/site';

export const dynamic = 'force-static';

// Résumé du site pour les moteurs génératifs (docs/06). llms-full.txt arrive avec les pages piliers (lot 8).
export function GET() {
  const u = absoluteUrl;
  const body = `# ${SITE_NAME}

> Planificateur de repas de la semaine qui compare le coût de la liste de courses dans 6 enseignes françaises (Lidl, Aldi, E.Leclerc, Intermarché, Carrefour, Auchan). Prix issus d'Open Prices et de tickets de caisse, mis à jour chaque jour.

## Données de prix
- [Comparatif de la semaine](${u(ROUTES.comparatif)}): coût d'un panier de 14 repas pour 4 personnes dans les 6 enseignes, daté.
- [Méthodologie](${u(ROUTES.methodologie)}): sources, médiane sur 7 jours, indice de fiabilité, traitement des prix aberrants.

## Recettes
- [Toutes les recettes](${u(ROUTES.recettes)}): coût par portion par enseigne.

## Guides
- [Faire ses courses pour moins cher](${u('/guide/courses-pas-cheres')})

## Produit
- [Comment ça marche](${u(ROUTES.commentCaMarche)})
- [Tarifs](${u(ROUTES.tarifs)}): gratuit, Premium 4,99 €/mois ou 39,99 €/an, essai 14 jours sans carte.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
