# Bilan de l’intégration API 0.2 — 25 novembre 2026

Date réelle du contrôle : 2026-11-25T10:36:24.573Z. Environnement : Node.js v24.22.3, Windows ; Microsoft Edge 158.0.4370.33.
Base Git avant enregistrement des changements : dc50a1d089415d84650c066b40e44982fb1905c9. Les fichiers de travail testés sont identifiés par leurs empreintes dans les rapports JSON ; cette base seule n’inclut pas les nouveaux fichiers.

## Résultats observés

| Contrôle | Attendu | Observé | Statut |
| --- | --- | --- | --- |
| Syntaxe des fichiers déclarés par npm run check | Aucun défaut de syntaxe | Tous les processus terminent avec le code 0 | Réussi |
| Tests historiques | 22 réussites | 22 réussites, 0 échec | Réussi |
| Scénarios S5 | 3 réussites | 3 réussites | Réussi |
| Contrat API dont T01 à T09 | 31 réussites | 31 réussites, 0 échec | Réussi |
| Intégration locale API et véritable plateau | 17 contrôles réussis | 17 réussites, aucune erreur pageerror | Réussi |

Les attendus sont définis dans les tests avant leur exécution. Le même calcul des indices est utilisé par le jeu et l’API. Le test historique exhaustif compare toujours les 1 679 616 paires de codes possibles à un calcul indépendant.

## Commandes et preuves

Les commandes déclarées dans package.json pour npm run check et npm test sont exécutées avec le Node.js fourni par l’environnement. npm n’étant pas disponible dans cet environnement local, le programme Node a lancé les mêmes scripts directement, sans installer de dépendance. Le test API utilise le rapporteur TAP.

- [Commandes, sorties complètes et empreintes des sources](api02-tests-25-novembre.json).
- [Résultats des 17 contrôles du navigateur local](api02-navigateur-local-25-novembre.json).
- [Capture ordinateur](api02-navigateur-local-25-novembre.png) et [capture à 390 pixels](api02-navigateur-local-25-novembre-mobile.png), inspectées visuellement.
- [État du projet avant intégration](api02-avant-25-novembre.md).

## Ce que le navigateur a réellement vérifié

API absente en mode normal et avec test=0 ; refus d’une proposition de trois couleurs par les boutons sans essai consommé ; état not-started avec test=1 ; démarrage imposé ; proposition API affichée puis clics ajoutés au même historique ; messages de refus ; démarrage invalide sans modifier l’écran ; getters et copies sans effets ; victoire au dixième avec refus à neuf essais ; défaite et refus après fin ; bouton Nouvelle partie ; rechargement sans secret conservé ; historique cohérent à 390 pixels.

## Publication et points non vérifiés

La nouvelle version publiée de l’API reste à contrôler après l’envoi de ces changements. Les contrôles ci-dessus portent sur le serveur HTTP local isolé, servi sous le même préfixe /code_secret_1/ que GitHub Pages.
Smartphone réel, autres navigateurs, parcours clavier complet, lecteur d’écran et binôme humain : non vérifiés. L’outil de vérification de l’enseignant n’a pas été exécuté.
Le tag jalon-1 reste conservé au commit dc50a1d ; il ne désigne pas cette implémentation ultérieure de l’API.
