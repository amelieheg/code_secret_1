# Petit écran et téléphone réel — 27 novembre 2026

## Attendus consignés avant l’essai

Ouvrir le jeu publié, composer rouge, bleu, vert, jaune puis valider. Attendu : quatre couleurs dans l’ordre, un essai consommé, deux nombres d’indices lisibles et une proposition conservée dans l’historique. Après plusieurs coups, le défilement vertical doit permettre de lire les anciens essais sans déplacement horizontal.

Les dimensions choisies dans l’aperçu sont 390 × 844 puis 360 × 800. Ce sont des formats d’affichage, pas des modèles de téléphones. Le scénario a été écrit dans le README avant les clics.

## Essai dans l’aperçu de Codex

Navigateur : navigateur intégré de Codex sous Windows, version non relevée. Les dimensions sont appliquées par le réglage viewport de l’aperçu. La barre de défilement verticale occupe 15 pixels de largeur utile.

Version de référence : commit 829ba6d, API du commit 52d856e. Comparaison des fichiers publiés aux sources : [preuve avant correction](mobile-27-version-publiee.json). Aucun secret n’a été fixé ni lu dans l’aperçu : les nombres ci-dessous sont des observations sur une partie aléatoire.

| Format | Attendu | Observé avant correction |
| --- | --- | --- |
| 390 × 844 | Sélection et validation utilisables ; historique de plusieurs coups accessible | Trois coups joués ; compteur passé à ESSAI 04 / 10 ; contenu de 375 px et largeur totale 375 px ; défilement vertical jusqu’à l’historique |
| 360 × 800, même partie | Historique conservé et mêmes indices pour une même proposition | Les trois essais restent présents. Un quatrième coup identique au premier donne encore 1 bien placée et 2 mal placées ; compteur ESSAI 05 / 10 |
| Largeur de 360 px | Aucun débordement horizontal | Défaut observé : surface utile 345 px, largeur totale 369 px ; bord droit du plateau et bouton Nouvelle partie partiellement coupés |

Les coups réellement observés dans l’aperçu sont :

| Coup | Proposition | Bien placées | Mal placées |
| --- | --- | --- | --- |
| 1 | rouge, bleu, vert, jaune | 1 | 2 |
| 2 | orange, violet, rouge, bleu | 0 | 2 |
| 3 | bleu, vert, jaune, orange | 1 | 2 |
| 4 | rouge, bleu, vert, jaune | 1 | 2 |

Le quatrième coup est joué après le changement de format, dans la même partie. Les indices du premier et du quatrième coup sont donc identiques. Le secret étant inconnu, cet essai vérifie surtout l’affichage et la conservation de l’historique.

## Correction publiée

La colonne du jeu conservait une largeur minimale trop grande et l’en-tête du plateau ne pouvait pas revenir à la ligne. La correction CSS permet à la colonne de tenir dans l’écran, autorise le retour à la ligne du bouton Nouvelle partie et réduit légèrement l’espacement des pions sur les écrans les plus étroits.

Les fichiers de règles et l’API ne sont pas modifiés. Le [CSS avant correction](style-avant-mobile-27-novembre.css.txt) est conservé.

Contrôle local complémentaire dans Microsoft Edge, avec barres de défilement visibles et polices de remplacement : [résultats avant/après](mobile-27-comparaison-css.json), [avant à 360 px](mobile-27-avant-360.png), [après à 360 px](mobile-27-apres-360.png), [après à 390 px](mobile-27-apres-390.png).

La comparaison reproduit le débordement avant correction : 368 px pour une surface utile de 345 px. Après correction, les deux valeurs sont égales à 345 px. À 390 px, elles sont égales à 375 px avant et après. Les quatre coups et les indices restent présents et le défilement fonctionne. Les mesures avant correction diffèrent d’un pixel entre les deux navigateurs ; elles montrent toutes deux un débordement.

Dans cette comparaison automatisée, le secret est fixé à rouge, rouge, bleu, vert uniquement pour rendre les indices reproductibles. Ce n’est pas la partie aléatoire de l’aperçu ni celle du téléphone. Le programme de reproduction est tests/mobile.browser.cjs, lancé depuis la racine avec Playwright disponible : npm run test:mobile.

La correction est publiée au commit 06d8237. Les [cinq fichiers servis par le site](mobile-27-version-corrigee.json) sont identiques à cette version après normalisation des retours de ligne. Les tests GitHub et le déploiement ont réussi.

## Nouveau contrôle dans l’aperçu après publication

Le site est rechargé après publication, avec une nouvelle partie aléatoire. Même parcours que précédemment : sélectionner les couleurs au moyen des boutons, valider, changer le format après trois coups, puis répéter la première proposition.

| Coup | Proposition | Bien placées | Mal placées |
| --- | --- | --- | --- |
| 1 | rouge, bleu, vert, jaune | 0 | 2 |
| 2 | orange, violet, rouge, bleu | 2 | 0 |
| 3 | bleu, vert, jaune, orange | 0 | 2 |
| 4 | rouge, bleu, vert, jaune | 0 | 2 |

À 390 × 844, largeur utile et largeur totale : 375 / 375 px. À 360 × 800 : 345 / 345 px. Les quatre coups restent présents ; le compteur indique ESSAI 05 / 10. Le défilement vertical atteint l’historique (position relevée : environ 1027 px). La capture observée dans l’aperçu montre les quatre propositions et les deux indices de chacune dans le plateau, sans coupure à droite. Le bouton Nouvelle partie revient à la ligne. Le format temporaire de l’aperçu est ensuite réinitialisé.

La répétition du premier coup conserve bien les indices 0 / 2 dans cette même partie. Les indices diffèrent de l’essai avant correction parce qu’une nouvelle partie aléatoire a commencé.

## Essai sur un smartphone réel

Source de l’observation : retour de l’étudiante dans le chat le 27 novembre. L’assistant n’a pas manipulé le téléphone.

- Appareil déclaré : Sony XQ-AS52 sous Android ; version d’Android non communiquée.
- Navigateur déclaré : Google Chrome ; version non communiquée.
- Lien demandé : https://amelieheg.github.io/code_secret_1/
- Scénario demandé : rouge, bleu, vert, jaune puis validation.
- Attendu : sélection et validation tactiles possibles, proposition et indices lisibles dans l’historique.
- Obtenu déclaré : les commandes répondent bien au toucher et les autres éléments demandés fonctionnent. Aucun indice numérique précis n’a été communiqué.
- Version de référence du site : 829ba6d, contrôlée depuis l’ordinateur. La révision exacte chargée dans le cache du téléphone n’a pas été contrôlée séparément.
- Premier retour : site avant correction CSS. Après publication de 06d8237, l’étudiante a rechargé le site et rejoué le même scénario ; elle confirme que la sélection au toucher, la validation, les indices et l’historique restent utilisables et lisibles. La version publiée est vérifiée depuis l’ordinateur ; le cache du téléphone n’est pas inspecté.

Deux parties indépendantes peuvent avoir des indices différents pour la même proposition, car leurs secrets sont aléatoires. Cela ne suffit pas à démontrer un défaut.

## Limites

La simulation ne remplace pas un test sur matériel réel. Le retour du téléphone est déclaré par l’étudiante, avec les précisions ci-dessus ; aucune capture du téléphone n’a été fournie. Le parcours clavier complet, le lecteur d’écran et d’autres modèles ou navigateurs ne sont pas validés par cet essai.

## Non-régression

Les contrôles de syntaxe et les 56 tests existants ont été exécutés après la préparation de cette correction : aucun échec. Les [commandes et leurs sorties](mobile-27-non-regression.json) sont conservées. Aucun fichier de règles ni de l’API n’est modifié.
