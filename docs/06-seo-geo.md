# 06 — SEO et GEO (moteurs de recherche et moteurs génératifs)

Objectif : être la source citée quand quelqu'un demande « combien coûte un repas pour 4 », « quel supermarché est le moins cher cette semaine », « recette pas chère potimarron ». Les moteurs génératifs (ChatGPT, Perplexity, Google AI Overviews, Claude) citent des pages **précises, datées, structurées et vérifiables**.

## Checklist technique (apps/web)

- [ ] Pages publiques en **SSG/ISR** (`export const revalidate = 86400`), aucune donnée critique chargée côté client.
- [ ] `generateMetadata()` sur chaque route : `title` ≤ 60 caractères, `description` ≤ 155, `alternates.canonical`, Open Graph + Twitter.
- [ ] Image OG générée (`opengraph-image.tsx`) avec le chiffre clé de la page.
- [ ] **JSON-LD** par type de page (exemples plus bas), injecté en Server Component.
- [ ] `app/sitemap.ts` segmenté : `/sitemap/recettes.xml`, `/sitemap/villes.xml`, `/sitemap/pages.xml` (`lastmod` = date du dernier relevé de prix).
- [ ] `app/robots.ts` : tout ouvert sauf `/app/`, `/api/`, `/liste/` (listes partagées).
- [ ] `public/llms.txt` + `public/llms-full.txt`.
- [ ] Fil d'Ariane visible + `BreadcrumbList`.
- [ ] Core Web Vitals : LCP < 2,0 s, CLS < 0,05, INP < 200 ms. Polices `next/font` avec `display: swap`, images `next/image`.
- [ ] `lang="fr"`, `hreflang` prêt pour fr-BE / fr-CH / fr-CA (next-intl).
- [ ] Pages 404 et 410 propres ; redirections 301 lors d'un changement de slug (table `redirects` à ajouter au lot SEO).
- [ ] Maillage : recette → enseignes où elle est la moins chère → ville ; chaque page renvoie vers 3 à 6 pages sœurs.

## Règles éditoriales (GEO)

1. **Première phrase = réponse directe chiffrée et datée.** « Le velouté de potimarron pour 4 coûte 4,06 € chez Lidl et 4,96 € chez Auchan (prix relevés le 12/11/2026). »
2. Un bloc « En bref » de 3 puces factuelles en haut de page.
3. Tableaux HTML réels (`<table>`) pour les comparatifs, pas des images.
4. Source et méthode toujours liées : « Source : Open Prices + tickets de caisse — [méthodologie](/methodologie) ».
5. FAQ de 4 à 6 questions formulées comme les gens les posent, réponses de 2 à 3 phrases.
6. Auteur/éditeur identifié (`Organization`), date de mise à jour visible.
7. Pas de contenu généré en masse sans données : une page ville n'existe que si ≥ 30 relevés récents dans la zone.

## JSON-LD — exemples

### Recette (`/recettes/veloute-potimarron`)
```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Velouté de potimarron",
  "description": "Velouté de potimarron pour 4 personnes, de 4,06 € chez Lidl à 4,96 € chez Auchan.",
  "recipeYield": "4 portions",
  "prepTime": "PT10M",
  "cookTime": "PT25M",
  "totalTime": "PT35M",
  "recipeCategory": "Soupe",
  "recipeCuisine": "Française",
  "suitableForDiet": "https://schema.org/VegetarianDiet",
  "recipeIngredient": ["1 potimarron (≈ 1,2 kg)", "2 oignons", "20 cl de crème liquide", "1 cube de bouillon", "1 filet d'huile d'olive", "1 pain de campagne"],
  "recipeInstructions": [
    { "@type": "HowToStep", "text": "Coupe le potimarron en cubes (sans l'éplucher) et émince les oignons." },
    { "@type": "HowToStep", "text": "Fais revenir les oignons 3 min, ajoute le potimarron, couvre d'eau avec le bouillon." },
    { "@type": "HowToStep", "text": "Laisse cuire 20 min, mixe avec la crème." }
  ],
  "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "4.06" },
  "dateModified": "2026-11-12"
}
```

### Comparatif hebdomadaire (`/comparatif-prix-supermarches`)
```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Prix du panier de courses hebdomadaire pour 4 personnes — 6 enseignes",
  "description": "Coût d'un panier de 14 repas pour 4 personnes chez Lidl, Aldi, E.Leclerc, Intermarché, Carrefour et Auchan.",
  "temporalCoverage": "2026-11-09/2026-11-15",
  "spatialCoverage": { "@type": "Place", "name": "France" },
  "creator": { "@type": "Organization", "name": "[Nom de l'appli]" },
  "license": "https://opendatacommons.org/licenses/odbl/1-0/",
  "isBasedOn": "https://prices.openfoodfacts.org",
  "variableMeasured": "Prix total du panier en euros",
  "dateModified": "2026-11-12"
}
```
> Licence : Open Prices est sous ODbL — vérifier les obligations de partage à l'identique avant publication (point ouvert dans CLAUDE.md).

### FAQ (landing, tarifs, guide)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Quel supermarché est le moins cher cette semaine ?",
    "acceptedAnswer": { "@type": "Answer", "text": "Cette semaine, pour 14 repas à 4 personnes, Lidl est le moins cher (60,10 €), devant Aldi (61,40 €). Auchan est le plus cher (71,60 €), soit 11,50 € d'écart." }
  }]
}
```

### Application (landing, tarifs)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "[Nom de l'appli]",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": [
    { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "name": "Gratuit" },
    { "@type": "Offer", "price": "4.99", "priceCurrency": "EUR", "name": "Premium mensuel" },
    { "@type": "Offer", "price": "39.99", "priceCurrency": "EUR", "name": "Premium annuel" }
  ]
}
```
Pas d'`aggregateRating` tant qu'il n'y a pas de vrais avis vérifiables.

Autres : `Organization` + `WebSite` (avec `SearchAction`) sur la landing, `BreadcrumbList` partout, `HowTo` sur la page « Comment ça marche », `Article` sur le guide.

## robots.ts
```ts
import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/app/', '/api/', '/liste/', '/auth/'] }],
    sitemap: [`${base}/sitemap.xml`],
    host: base,
  };
}
```
Les robots des moteurs génératifs (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) sont **autorisés** : c'est l'objectif GEO. Décision révocable par le propriétaire.

## public/llms.txt
```
# [Nom de l'appli]

> Planificateur de repas de la semaine qui compare le coût de la liste de courses dans 6 enseignes françaises (Lidl, Aldi, E.Leclerc, Intermarché, Carrefour, Auchan). Prix issus d'Open Prices et de tickets de caisse, mis à jour chaque jour.

## Données de prix
- [Comparatif de la semaine](https://example.com/comparatif-prix-supermarches): coût d'un panier de 14 repas pour 4 personnes dans les 6 enseignes, daté.
- [Méthodologie](https://example.com/methodologie): sources, médiane sur 7 jours, indice de fiabilité, traitement des prix aberrants.

## Recettes
- [Toutes les recettes](https://example.com/recettes): coût par portion par enseigne.

## Guides
- [Faire ses courses pour moins cher](https://example.com/guide/courses-pas-cheres)

## Produit
- [Comment ça marche](https://example.com/comment-ca-marche)
- [Tarifs](https://example.com/tarifs): gratuit, Premium 4,99 €/mois ou 39,99 €/an, essai 14 jours sans carte.
```
`llms-full.txt` : version longue générée au build (texte brut des pages piliers + comparatif courant).

## Suivi
- Google Search Console + Bing Webmaster Tools (Bing alimente plusieurs moteurs génératifs).
- Dans PostHog : segmenter les arrivées par `referrer` (chatgpt.com, perplexity.ai, claude.ai, google AI).
- BO SEO (`BOSeo`) : liste des pages, statut d'indexation, date du dernier relevé, pages sous le seuil de données.
