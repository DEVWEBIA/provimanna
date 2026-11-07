# Maquettes : sources

Ces fichiers sont les sources des maquettes réalisées dans Claude Design, au format `.dc.html`. Ils ont besoin du moteur de rendu de Claude Design (`support.js`), donc **ils ne s'ouvrent pas tels quels dans un navigateur**. Ils servent de référence précise pour reconstruire les écrans en code : structure, textes, couleurs, tailles, espacements et logique d'interaction (le bloc `<script>` de chaque fichier).

- `mobile/` : les 12 écrans de l'appli (`S2Onboarding`, `S2Vide`, `S2Accueil`, `S2Plan`, `S2Recette`, `S2Comparateur`, `S2Detail`, `S2Liste`, `S2Scan`, `S2Paywall`, `S2Profil`, `S2Erreur`), le prototype qui les relie (`S2Prototype`), et deux composants : `S2Plat` (les illustrations de plats en SVG) et `S2TabBar`.
- `web/` : `W1LandingS` (le site), `W2DashboardS` et `W3PlanS` (la web app), `B1DashboardS` et `B2ModerationS` (le back-office).
- `canvas.json` : l'index du canevas (position des écrans, pages, notes).

Pour les voir rendus, ouvre le canevas dans ton compte actuel : https://claude.ai/artifact/AizeR5pYHr4ufFNYTSkajd (Partager → Exporter pour obtenir des images ou un PDF).

Pour les faire coder par Claude, donne-lui un fichier écran et `05_Design_system/tokens.css`, et demande par exemple : « Reproduis cet écran en composant Next.js + Tailwind avec ces tokens ».
