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
| Même suite sur GitHub Pages | 17 contrôles réussis | 17 réussites, aucune erreur pageerror | Réussi |
| Cinq fichiers du site publié | HTTP 200 et contenu identique aux sources | Conforme après normalisation des retours de ligne | Réussi |

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

La version publiée du commit 52d856e a été contrôlée le 25 novembre sur https://amelieheg.github.io/code_secret_1/. Les mêmes 17 contrôles de navigateur réussissent aussi sur ce site, sans erreur pageerror. Les cinq fichiers servis sont identiques aux sources après normalisation des retours de ligne.

- [Rapport du navigateur sur le site publié](api02-navigateur-publie-25-novembre.json).
- [Comparaison des cinq fichiers publiés](api02-fichiers-publies-25-novembre.json).
- [Capture de l’API et du plateau publiés](api02-navigateur-publie-25-novembre.png).
- [Tests GitHub réussis sur 52d856e](https://github.com/amelieheg/code_secret_1/actions/runs/45598716558).
- [Publication standard Pages réussie sur 52d856e](https://github.com/amelieheg/code_secret_1/actions/runs/45598715683).

Le workflow personnalisé a d’abord échoué en recherchant zéro puis deux paquets nommés github-pages après relance. Le paquet était présent et le site standard fonctionnait. La configuration est corrigée : préparation et déploiement dans deux jobs dépendants, avec nom de paquet propre à l’exécution et transmis au job de déploiement. La sélection du paquet ne dépend ainsi plus d’un nom partagé entre les tentatives. Le résultat courant est consultable dans les [exécutions de publication](https://github.com/amelieheg/code_secret_1/actions/workflows/pages.yml).
Smartphone réel, autres navigateurs, parcours clavier complet, lecteur d’écran et binôme humain : non vérifiés. L’outil de vérification de l’enseignant n’a pas été exécuté.
Le tag jalon-1 reste conservé au commit dc50a1d ; il ne désigne pas cette implémentation ultérieure de l’API.
