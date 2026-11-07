# Appli repas

Le design system de l'appli de planification de repas qui compare le coût du plan entre les enseignes (Lidl, Aldi, E.Leclerc, Intermarché, Auchan, Carrefour…). « Appli repas » est un nom de travail, à remplacer quand le nom définitif sera choisi.

L'identité est chaleureuse, gourmande et digne de confiance : l'**aubergine** porte la marque et les actions, l'**orange** est réservé aux économies, sur un fond **sable**. Palette retenue : « Aubergine & orange ». Le ton n'est jamais « discount » ni culpabilisant.

## Principes

- **Le prix est un repère, pas une injonction.** On montre toujours le coût du plan dans les autres enseignes, mais l'utilisateur reste libre de garder la sienne, même plus chère. Pas de rouge, pas de « tu perds de l'argent ».
- **L'économie se voit en orange.** Toute somme économisée ou économisable utilise `saving-soft` en fond et `saving-ink` pour le texte. Aucune autre information n'emprunte cet orange.
- **L'aubergine agit.** `brand` sert aux boutons principaux, à la sélection, à l'onglet actif. Un seul bouton plein par écran.
- **Mobile d'abord.** Écrans de 375 à 430 px, zones tactiles d'au moins 44 px, marge latérale `space-4` minimum (`space-5` sur les écrans de contenu).

## Contenu et ton

- Tutoiement partout : « Où fais-tu tes courses ? », « Tu économiserais 11,80 € ».
- Prix au format français : virgule décimale, espace insécable avant €, deux décimales (`74,20 €`). Les écarts portent un signe : `−11,80 €` (vrai signe moins), `+1,60 €`.
- Toujours afficher la fraîcheur des prix (« Prix relevés il y a 3 jours ») et un indice de fiabilité quand un total est comparé.
- Les boutons disent ce qui se passe : « Faire mes courses chez Lidl · 62,40 € », « Garder Auchan », « Commencer mes 14 jours gratuits ».
- Paywall honnête : « Sans carte bancaire », « Résiliable à tout moment », jamais de compte à rebours ni de fausse urgence.

## Couleurs

| Token | Rôle |
|---|---|
| `surface-50` | fond d'écran |
| `surface-0` | cartes, lignes, barre d'onglets |
| `line` | bordures et séparateurs |
| `ink` / `ink-muted` | texte principal / secondaire |
| `brand` + `on-brand` | actions, sélection, marque |
| `brand-soft` + `brand-soft-ink` | encarts d'information, badge « Ton choix actuel » |
| `saving` | aplats orange (récompenses, pastille économie) |
| `saving-soft` + `saving-ink` | messages d'économie |
| `danger` | erreurs uniquement |

Les deux thèmes (clair et sombre) sont définis pour chaque token. En sombre, `brand` s'éclaircit et `on-brand` devient foncé pour garder le contraste des boutons.

Valeurs principales en clair : aubergine `#4A2545`, orange `#EE7A30`, sable `#F6F3EC`, texte `#2A1A28`. La carte **Palette** montre les couleurs, leurs rôles et les paires de contraste à respecter. Le back-office utilise `ink` en fond de barre latérale avec l'élément actif en `brand`.

Règle d'or : du texte foncé (`ink`) sur l'orange, jamais du blanc.

## Typographie

Une seule famille, **Nunito** (Google Fonts), pour ses formes rondes et très lisibles. Graisses 400, 600, 700 et 800. Les titres et les prix sont en 800 avec un léger interlettrage négatif ; les libellés `overline` sont en capitales espacées de 0,6 px. Utiliser des chiffres tabulaires (`font-variant-numeric: tabular-nums`) dans les colonnes de prix.

## Formes et espacement

- Rayons : `radius-sm` (12 px) puces et encarts, `radius-md` (18 px) cartes et lignes, `radius-lg` (24 px) grande carte, `radius-pill` boutons et pastilles.
- Bordure d'1 px `line` plutôt qu'une ombre ; seule la barre de comparaison flottante prend `shadow-float`.
- Sélection : bordure de 2 px `brand`, jamais un simple changement de fond.

## Iconographie

Icônes au trait, 24 px, épaisseur 2, extrémités arrondies, couleur héritée du texte (`currentColor` dans le code de l'appli). Pas d'emoji, pas d'icônes pleines.

## Enseignes

Les enseignes n'apparaissent jamais avec leurs logos ni leurs couleurs officielles : chaque enseigne a une **pastille neutre** (cercle 36 à 40 px, deux lettres de son nom, fond pastel et texte foncé du même ton) et son nom écrit en clair. Les badges « Le moins cher » (orange) et « Ton choix » (aubergine) se placent sous le nom.

## Composants

- **Bouton** : principal (plein `brand`, 56 px), secondaire (`surface-0` + `line`), lien (texte `brand` souligné). Pilule.
- **Ligne d'enseigne** : pastille, nom, badge éventuel, total et écart à droite ; sélectionnable (rôle radio).
- **Badge d'économie** : encart `saving-soft` avec montant `saving-ink`.
