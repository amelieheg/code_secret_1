# Contrôle de la nouvelle remise du 19 novembre 2026

Date UTC : 2026-11-19T10:09:43.068Z.
Environnement : Node.js v24.22.3, win32.
Base du dossier au lancement : b4b67caf81a0939acfd627a6e91a58bacd780206.
Les changements de cette nouvelle version portent uniquement sur la documentation. Les quatre fichiers du jeu sont comparés au commit 29c1ad3 et au site publié : contenu identique, avec normalisation des retours de ligne.

## Résultats des vérifications

- Syntaxe : game.js, app.js, game.test.js et tests/atelier5.test.cjs sans erreur.
- Tests : 22 tests historiques et 3 scénarios S5 réussis, sans échec.
- Les attendus des scénarios sont ceux consignés avant les essais du 18 novembre ; aucun test ni attendu n’est modifié pour cette nouvelle remise.

## Correspondance du jeu et du site

| Fichier | HTTP | Comparaison | SHA-256 normalisé |
| --- | --- | --- | --- |
| index.html | 200 | Identique au site et au commit 29c1ad3 | 2e36b030a38caf626dd0620e83cfd8ae1fdefdc2ecc42cc7654b42c6c48e54cd |
| style.css | 200 | Identique au site et au commit 29c1ad3 | 75d62eb4e1ee1136d7d423c9c8b941d13e517f9b878d430d6dd9ef79d81acb48 |
| game.js | 200 | Identique au site et au commit 29c1ad3 | f941ee028266744cc9ecf27055df4007984d0488f6c26f913e481d3b17339b49 |
| app.js | 200 | Identique au site et au commit 29c1ad3 | 23b651ec6d09adf45079b98ac06b25f2c034a4c2325106252e147316008afd66 |

## Sorties réelles des tests

Commande : node game.test.js

```text
OK — R1 — Les six identifiants et leur ordre sont exacts
OK — R1 — Quatre tirages indépendants permettent les répétitions
OK — R1 — Chacune des six couleurs peut être tirée
OK — R1 — Le secret reste fixe et caché après une proposition
OK — R2 — Une nouvelle partie a dix essais et aucun historique
OK — R2/R5 — L’ordre gauche-droite change les indices
OK — R3 — Les propositions incomplètes sont refusées sans mutation
OK — R3 — Les couleurs interdites et les majuscules sont refusées sans mutation
OK — R4 — Une proposition valide consomme exactement un essai
OK — R4 — Les propositions et indices restent dans l’historique
OK — R4 — Modifier une proposition ou une copie de l’état préserve l’historique
OK — R5 — Priorité aux bien placées avec doublons : 1 / 2
OK — R5 — Une occurrence rouge ne compte pas quatre fois : 1 / 0
OK — R5 — Quatre couleurs présentes toutes mal placées : 0 / 4
OK — R5 — Aucune couleur commune : 0 / 0
OK — R5 — Vérification exhaustive des 1 679 616 paires de codes
OK — R6 — La victoire au premier essai révèle le secret
OK — R6 — La victoire au dixième essai prime sur la défaite
OK — R6 — Dix propositions sans victoire donnent une défaite
OK — R7 — Une proposition après victoire ne change plus la partie
OK — R7 — Une proposition après défaite ne change plus la partie
OK — R7 — Nouvelle partie remet tout à zéro et tire quatre nouvelles couleurs

22 tests réussis ; 0 échec(s).
```

Commande : node tests/atelier5.test.cjs

```text
{"scenario":"normal","expected":{"ok":true,"exact":2,"misplaced":0,"attempts":1,"historyLength":1},"observed":{"ok":true,"attempts":1,"historyLength":1,"exact":2,"misplaced":0},"status":"réussi"}
{"scenario":"quatre-rouges","expected":{"ok":true,"exact":2,"misplaced":0,"attempts":1,"historyLength":1},"observed":{"ok":true,"attempts":1,"historyLength":1,"exact":2,"misplaced":0},"status":"réussi"}
{"scenario":"incomplete","expected":{"ok":false,"attempts":0,"historyLength":0},"observed":{"ok":false,"attempts":0,"historyLength":0,"explanation":"Votre proposition est incomplète : choisissez une couleur pour chacun des quatre emplacements."},"status":"réussi"}
3 / 3 scénarios S5 réussis. Version b4b67caf81a0939acfd627a6e91a58bacd780206. Moteur identique au tag jalon-1 : true.
```

## Version à remettre

Le nouveau tag jalon-1 est placé sur le commit qui inclut le README révisé et ce rapport. Les anciens rapports restent datés et décrivent leurs versions historiques.
L’ancienne remise 29c1ad3 est conservée sous le tag archive-jalon-1-avant-readme-19-novembre. Le déplacement du tag de remise est demandé par l’étudiante le 19 novembre.
Le Word local de livraison est actualisé après création de ce commit afin d’en indiquer l’identifiant exact.

Limites inchangées : smartphone réel, parcours clavier complet et lecteur d’écran non vérifiés ; aucun test humain en binôme. Les contrôles automatiques ne remplacent pas ces essais.
