# Code secret

Jeu solo de déduction destiné aux personnes qui veulent résoudre un code de quatre couleurs en dix essais. Inspiré du Mastermind, il est réalisé avec Codex pour le cours. Cette première version prépare uniquement le **jalon 1 du 20 novembre 2026 au soir**.

- Dépôt : [amelieheg/code_secret_1](https://github.com/amelieheg/code_secret_1).
- Application : [jouer à Code secret](https://amelieheg.github.io/code_secret_1/).
- Version de remise : [tag jalon-1](https://github.com/amelieheg/code_secret_1/tree/jalon-1), qui repère la version préparée pour ce dépôt distinct.

## Comprendre les modifications quand on débute

Le [guide pour comprendre le projet et le rendu](docs/COMPRENDRE-JALON-1.md) explique le rôle de chaque fichier, les changements, les commits et les trois liens à transmettre. Il contient aussi un tableau qui associe chaque exigence du 20 novembre à sa preuve.

Les changements principaux sont :

- Création du jeu : choix des couleurs, dix essais, historique, indices et fin de partie.
- Séparation des règles et de l’écran : les calculs sont dans game.js ; les clics et l’affichage dans app.js.
- Correction mobile : la légende des indices reste visible sur petit écran.
- Ajout des tests : ils vérifient notamment les répétitions et la victoire au dixième essai.
- Documentation et publication : README pour les lecteurs, AGENTS.md pour Codex, dépôt GitHub et site jouable séparés de l’ancien test.

Ce résumé et le guide ont été ajoutés après la version étiquetée jalon-1. Ils complètent les explications sans modifier le jeu ni déplacer le tag. Les éléments requis pour le rendu sont déjà présents dans cette version étiquetée.

## État actuel

- Disponible : partie complète, choix et modification des quatre couleurs, dix essais, historique, indices avec doublons, victoire, défaite et nouvelle partie.
- Vérifié : 22 tests historiques du moteur et 3 scénarios supplémentaires exécutés le 18 novembre ; essais de l’interface et correction mobile détaillés dans les preuves. Le code du jeu reste identique dans ce nouveau dépôt.
- Publication : jeu accessible dans le dépôt distinct code_secret_1 ; fichiers publiés comparés aux sources locales, sans différence de contenu.
- Limites principales : pas de sauvegarde au rechargement ; smartphone réel et parcours clavier complet non vérifiés.

## Remise officielle sur Cyberlearn

Le support du 18 novembre et ses notes précisent de déposer **jalon1_sordet.docx** sur Cyberlearn avant le 20 novembre au soir. Le document contient le lien du dépôt, celui du jeu et le tag jalon-1. Il est préparé dans le dossier local livraison, gardé hors du dépôt Git, et fourni dans le chat. Vérifier l’activité et l’heure limite sur [Cyberlearn](https://cyberlearn.hes-so.ch/course/view.php?id=28968). Aucun ZIP ni vidéo ne sont demandés pour J1.

Les [changements du 18 novembre expliqués simplement](docs/CHANGEMENTS-18-NOVEMBRE.md) distinguent les nouveaux tests, les compléments de documentation et les contrôles non réalisés.

## Règles et source

Référence : [énoncé officiel, édition 2.2, annexe code-couleurs-1.0](https://docs.google.com/document/d/17RUqUnEvIilitiNSY1kbK0QT7vBVcUeAT3L6ONJN8XU/edit). Le programme cache quatre couleurs parmi rouge, bleu, vert, jaune, orange et violet, avec répétitions possibles. La personne dispose de dix essais. Une proposition invalide ne consomme aucun essai. Les indices comptent d’abord les couleurs bien placées, puis les couleurs mal placées parmi les occurrences restantes, sans compter deux fois une occurrence. Quatre bien placées donnent la victoire, même au dixième essai ; sinon le dixième essai termine la partie. Une nouvelle partie efface l’historique et tire un code.

Les [sept règles complètes](docs/sources/regles.md) et le [périmètre du jalon 1](docs/sources/consigne-j1.md) sont conservés dans le projet.

## Commencer

Ouvrez [le jeu publié](https://amelieheg.github.io/code_secret_1/) dans un navigateur récent. Pour jouer localement, ouvrez `index.html`. Aucune installation ni aucun serveur ne sont nécessaires. La page doit afficher le plateau de dix essais, quatre emplacements vides et les six couleurs de la palette. Les polices en ligne sont facultatives : des polices locales prennent le relais sans connexion.

## Jouer

1. Sélectionnez l’un des quatre emplacements, puis une couleur dans la palette. Le prochain emplacement vide est sélectionné automatiquement.
2. Pour corriger une couleur avant validation, sélectionnez à nouveau son emplacement.
3. Cliquez sur « Valider la proposition ». Une proposition incomplète est refusée sans consommer d’essai.
4. Consultez les deux nombres à droite de chaque proposition : pastille pleine pour les couleurs bien placées, cercle vide pour les couleurs mal placées.
5. Trouvez le code en dix essais. Le bouton « Nouvelle partie » remet le jeu à zéro avec un nouveau tirage aléatoire, qui peut par hasard être identique au précédent.

## Décision prise avec Codex

Le choix retenu avec Codex est de séparer le calcul des règles (`game.js`) de l’interface (`app.js`). Cela permet de vérifier les doublons et la fin de partie avec des codes connus sans dépendre d’un tirage aléatoire à l’écran. La contrepartie est de devoir aussi tester l’interface : un moteur correct ne prouve pas que les boutons et l’affichage fonctionnent.

## Interface JavaScript interne

Cette interface sert actuellement au jeu et aux tests locaux. Sa conformité au contrat commun 0.2 n’est pas établie ; ce travail appartient au jalon 2.

`game.js` expose `CodeSecret` dans le navigateur et `module.exports` avec Node.js.

- `PALETTE` : `['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet']`.
- `createGame()` : crée une partie avec quatre couleurs tirées indépendamment, répétitions possibles.
- `game.submit(['rouge', 'bleu', 'vert', 'jaune'])` : retourne `{ ok, exact, misplaced, state }` si la proposition est valide, sinon `{ ok: false, error }` sans modifier la partie.
- `game.getState()` : fournit une copie de l’historique, le nombre d’essais, les essais restants et le statut (`playing`, `won`, `lost`). Le code secret est `null` pendant la partie et révélé à la fin.
- `game.newGame()` : effectue un nouveau tirage et remet l’état à zéro.
- `score(secret, guess)` : calcule les indices de deux tableaux de quatre couleurs valides, en comptant d’abord les couleurs bien placées puis les occurrences restantes.

La partie reste en mémoire jusqu’à une nouvelle partie ou au rechargement de la page.

## Vérifier les règles

Depuis la racine du projet, avec **Node.js 18 ou plus récent** : `node game.test.js`. Le Node.js 6 fourni par certains anciens logiciels est insuffisant. Avec npm disponible : `npm run check` puis `npm test`. Aucune dépendance à installer.

Les tests couvrent les répétitions, les propositions invalides, la victoire au dixième essai, la défaite après dix propositions, le blocage des parties terminées et la réinitialisation.

| Cas | Résultat attendu | Résultat obtenu le 12 novembre 2026 |
| --- | --- | --- |
| Proposition incomplète | Refus, compteur et historique inchangés | Réussi dans les tests du moteur |
| Secret rouge–rouge–bleu–vert, proposition rouge–bleu–rouge–rouge | 1 bien placée, 2 mal placées | Réussi dans les tests du moteur |
| Code exact au dixième essai | Victoire, zéro essai restant | Réussi dans les tests du moteur |
| Dix propositions fausses, puis une proposition supplémentaire | Défaite puis refus sans mutation | Réussi dans les tests du moteur |
| Nouvelle partie après une fin | Historique vide, dix essais, code caché | Réussi dans les tests du moteur |

Les résultats détaillés et l’environnement figurent dans la [preuve d’exécution](docs/preuves/tests-regles.md), régénérable par `node game.test.js --rapport`. Le code du moteur testé est celui du commit `3e2f7e0`, inchangé depuis ; les tests enrichis sont inclus dans la version de remise.

Résultat de l’exécution locale : **22 tests réussis, aucun échec**, avec Node.js 24.22.1 ; les trois fichiers JavaScript passent également le contrôle `node --check`. Le test du calcul des indices compare les 1 679 616 paires possibles de codes à un calcul de référence indépendant.

Dans Edge 157, les essais automatisés de l’interface confirment le refus d’une proposition de trois couleurs sans essai consommé, une victoire avec quatre couleurs exactes et le redémarrage. La légende est visible à 390 px et à 1280 px. Voir les [résultats du navigateur et les captures](docs/preuves/tests-navigateur.md). Le petit écran est simulé, pas un smartphone réel.

Publication du nouveau dépôt vérifiée le 12 novembre 2026 : [tests GitHub réussis](https://github.com/amelieheg/code_secret_1/actions/runs/43192639902) et [déploiement Pages réussi](https://github.com/amelieheg/code_secret_1/actions/runs/43192637128). Les quatre fichiers du jeu répondent en HTTP 200 et sont identiques aux sources locales après normalisation des retours de ligne : [preuve de publication](docs/preuves/publication.md).

## Vérifications préparées pour l’atelier du 18 novembre

Le [support S5 et ses notes](https://docs.google.com/presentation/d/1sO-jTstfaDlU-4PSp3cSrMlqkXfi76oaD-TIbbVDz78/edit) demandent d’écrire l’état de départ, l’action et l’attendu avant l’essai, puis de relever l’obtenu et la version. Les trois attendus ci-dessous sont consignés avant leur première exécution du 18 novembre.

Chaque cas part d’une nouvelle partie avec zéro essai et un historique vide. Le secret connu est imposé uniquement dans le programme de test, grâce à la fonction de tirage contrôlable du moteur existant. Aucun mode de triche n’est ajouté au jeu publié.

| Type | Secret de départ | Action | Attendu avant essai | Obtenu |
| --- | --- | --- | --- | --- |
| Normal | rouge, bleu, vert, jaune | proposer rouge, bleu, orange, violet | 2 bien placées, 0 mal placée ; 1 essai et 1 entrée d’historique | Conforme : 2 / 0, 1 essai, 1 entrée |
| Limite du cours | rouge, rouge, bleu, vert | proposer quatre rouges | 2 bien placées, 0 mal placée ; 1 essai et 1 entrée d’historique | Conforme : 2 / 0, 1 essai, 1 entrée |
| Négatif | rouge, rouge, bleu, vert | proposer rouge, bleu, vert | refus expliqué ; zéro essai, état et historique inchangés | Conforme : refus expliqué, zéro essai, état inchangé |

Commande exécutée : `node tests/atelier5.test.cjs --rapport`. Résultat du 18 novembre : **3 scénarios réussis sur 3**, avec Node.js 24.22.3 sous Windows. Voir la [sortie détaillée avec attendu et obtenu](docs/preuves/atelier5-18-novembre.md). Le commit du dossier au lancement était 9a44362 ; la comparaison réelle confirme que le moteur est identique à celui du tag jalon-1, commit 29c1ad3.

Le site publié a aussi été ouvert et utilisé le 18 novembre : proposition incomplète refusée sans essai, proposition complète enregistrée et redémarrage vérifié. Voir le [résultat des clics dans le navigateur](docs/preuves/site-18-novembre.md). Ce contrôle ne connaît pas le secret tiré par le site.

Test croisé avec un binôme : **non réalisé**, confirmé le 18 novembre. Il ne faut pas le confondre avec les essais automatiques. Les [critères d’évaluation](https://docs.google.com/document/d/12frV3vQ_56p4iZkzQG4BskaaSHbMgCwzQUwbAcS2S5A/edit) prévoient le retour après essai du jeu d’un camarade pour J2.

## Correction expliquée

À une largeur de 760 px ou moins, la règle CSS `.guide,.little-note{display:none}` masquait aussi la légende des indices. L’attendu est de conserver les explications « Bien placée » et « Mal placée » sur petit écran. Le commit `a4438ce` retire `.guide` de cette règle. Voir la [preuve de code avant/après](docs/preuves/correction-mobile.txt), la [copie du CSS avant correction](docs/preuves/style-avant.css.txt) et les [captures de reproduction avant/après](docs/preuves/tests-navigateur.md). Le même essai à 390 px reproduit la légende masquée avec l’ancien CSS, puis visible avec le CSS corrigé, sans débordement horizontal. L’image « avant » est une reconstitution avec le CSS sauvegardé ; aucun essai sur téléphone réel n’est annoncé.

## Limites et questions ouvertes

- Le site publié correspond au même code que les essais de l’interface conservés dans les preuves. Le nouveau contrôle de publication vérifie les fichiers et leur disponibilité ; il ne constitue pas un nouvel essai complet du parcours dans le navigateur.
- Les tests automatisés du moteur ne prouvent pas l’ergonomie, le parcours clavier complet ni le comportement tactile sur smartphone réel. Ces contrôles restent à faire.
- Le code secret est caché dans l’interface pendant la partie ; ce jeu exécuté dans le navigateur ne cherche pas à empêcher l’inspection par les outils de développement.
- L’historique est perdu au rechargement. Pas de sauvegarde ni de PWA.
- Questions ouvertes : la présentation des couleurs est-elle assez lisible sans distinguer leurs teintes ? Le parcours clavier permet-il de jouer confortablement ?
- API commune 0.2, essai du jeu d’un camarade et vidéo : réservés au jalon 2, hors du travail actuel.

## Aide et reprise

Projet maintenu par Amélie Sordet dans le cadre du cours. Pour signaler un problème, ouvrir une [issue du dépôt](https://github.com/amelieheg/code_secret_1/issues) en précisant les actions effectuées, le résultat attendu, le résultat observé et le navigateur utilisé. Les commandes de vérification et leurs résultats figurent ci-dessus ; les consignes de travail avec Codex sont dans [AGENTS.md](AGENTS.md).

## Fichiers

- `index.html` : interface française.
- `style.css` : présentation et adaptation aux petits écrans.
- `game.js` : règles et API du jeu.
- `app.js` : interactions et affichage.
- `game.test.js` : tests des règles.
- `AGENTS.md` : consignes durables pour travailler avec Codex.
- `.github/workflows/` : tests et publication Pages vérifiés sur le nouveau dépôt.

Documentation préparée à partir du [support S4 du 11 novembre](https://docs.google.com/presentation/d/1Yi_XaAN5B_8kT8FrJXQ6rpPXLBk-8riz5rpyb55_Weo/edit), du [guide README](https://docs.google.com/document/d/10FoB8lHkMB_Ys30Zcll1dFR_1TZ5nlNyhXRihrIIFjw/edit) et du [guide AGENTS](https://docs.google.com/document/d/1_epbOr-PrHMvFYcZaeLMDIjAmcKWd40ORtTX8Ia6_Sw/edit).
