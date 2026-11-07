# Brief design : UX/UI

## Identité

- **Palette Aubergine & orange**. Tokens complets dans `05_Design_system/tokens.json` et `tokens.css`.
  - Aubergine `#4A2545` : marque, boutons principaux, sélection, onglet actif, grande carte de la semaine.
  - Orange `#EE7A30` : économies, badges « Le moins cher », récompenses. Toujours avec du texte foncé.
  - Sable `#F6F3EC` : fond. Les cartes sont en blanc.
  - Encre `#2A1A28` : texte, barre latérale du back-office, cartes sombres.
  - Pêche `#FCE3D3` avec le texte `#9A420E` : encarts « Moins cher chez… ».
  - Aubergine clair `#EFE3EC` : badges « Ton choix », filtres, pastille de l'onglet actif.
- **Typographie** : Nunito, graisses 400 à 900. Titres et prix en 800-900 avec un léger interlettrage négatif. Chiffres tabulaires dans les colonnes de prix.
- **Formes** : cartes à 18-26 px de rayon, boutons en pilule, bordure d'1 px plutôt qu'une ombre. La sélection se marque par une bordure de 2 px aubergine.
- **Illustrations** : plats vus de dessus (curry, salade, velouté, pâtes…) en SVG. Pas d'emoji, icônes au trait de 2 px.
- **Enseignes** : jamais de logo ni de couleur officielle. Une pastille neutre avec deux lettres sur fond pastel, et le nom écrit en clair.
- **Ton** : tutoiement, positif, jamais culpabilisant. « Le prix est un repère : c'est toi qui choisis. »

## Écrans mobiles (maquettes `06_Maquettes/mobile`)

1. Onboarding : foyer (adultes et enfants) et enseigne habituelle.
2. Semaine vide : état vide avec « Générer mon plan ».
3. Accueil : carte de la semaine (total, prix possible, jauge), économies par semaine, menu du jour illustré.
4. Plan : sélecteur de jours, repas illustrés, remplacement, barre flottante du comparateur.
5. Recette : grande illustration, prix chez toi et le moins cher, onglets Ingrédients / Étapes.
6. Comparateur : six enseignes sélectionnables, barre de prix relative, indice de fiabilité, bouton « Faire mes courses chez… » et lien « Garder Auchan ».
7. Détail Premium : comparaison produit par produit entre deux enseignes.
8. Liste de courses : anneau de progression, rayons, cases à cocher, envoi vers le drive.
9. Scan de ticket : caméra, puis feuille de résultat (« 23 prix mis à jour », « +3 jours Premium »).
10. Paywall : 14 jours offerts, avantages, choix annuel ou mensuel.
11. Profil : suivi de l'essai Premium, économies totales, réglages.
12. Erreur : prix indisponibles pour certaines enseignes, invitation à scanner un ticket.

Un prototype cliquable relie tous ces écrans, avec des transitions animées.

## Web app et back-office (maquettes `06_Maquettes/web`)

1. **Site, page d'accueil** : hero avec plats et mini-comparateur, « Comment ça marche » en 3 étapes, comparatif des 6 enseignes, rendez-vous hebdomadaire (jeudi, économies, série, défi), tarifs, appel final.
2. **Web app, tableau de bord** : navigation latérale, carte de la semaine, série avec joker, courbe des économies, défi du mois avec badge, menu du jour, promo, produits de saison.
3. **Web app, plan de la semaine** : grille de 7 jours × midi et soir, filtres, comparateur interactif à droite.
4. **Back-office, vue d'ensemble** : KPI, actifs hebdomadaires, entonnoir de l'essai, couverture des prix par enseigne, liste « à traiter ».
5. **Back-office, modération des tickets** : file d'attente, photo du ticket, lignes lues avec indice de confiance, Valider ou Rejeter, alerte de prix aberrant.

## Règles d'interface

- Zones tactiles d'au moins 44 px, contraste AA partout. Le texte blanc ne va jamais sur l'orange.
- Un seul bouton plein par écran.
- Toujours afficher la fraîcheur des prix et un indice de fiabilité.
- Paywall honnête : pas de compte à rebours, « sans carte bancaire », « résiliable à tout moment ».
- Les pages web s'adaptent au mobile : la barre latérale passe au-dessus, les cartes passent sur une colonne.

## À produire ensuite

Web app : liste de courses, fiche recette, profil et paiement. Back-office : prix, produits, recettes, utilisateurs, engagement. Mode sombre (les tokens sont prêts). Logo et nom.
