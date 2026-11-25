# API commune 0.2

## Existant et écarts avant modification

Examen de la base dc50a1d, version remise à J1 :

| Élément | Avant | Après intégration |
| --- | --- | --- |
| Palette, répétitions, calcul des indices | Présents | Même calcul conservé |
| Dix essais, historique, victoire et défaite | Présents et testés | Même moteur complété |
| Objet window.codeSecretTest | Absent | Exposé seulement avec test=1 |
| État initial not-started | Absent | Utilisé en mode test |
| Configuration et état au format commun | Absents | getConfig et getState |
| Code imposé et promesses | Absents de l’API publique | startGame et submitGuess |
| Refus normalisés et ordre des contrôles | Messages internes | Codes du contrat et lastError |
| API et interface sur la même partie | Non disponibles | Actions communes et instance unique |

Voir les [constats avant modification](preuves/api02-avant-25-novembre.md) et la [référence du contrat](sources/api-0.2.md).

Plan suivi : compléter le moteur existant, connecter l’API aux actions du plateau, puis vérifier règles, validations et synchronisation avec l’écran.

## Une seule partie

app.js crée une seule instance avec createGame. Les clics et l’API appellent tous deux startSharedGame et submitSharedGuess. Ces actions modifient le moteur, mettent à jour les messages et redessinent le plateau.

game.js conserve les règles et le secret. getApiState présente cette même partie au format du contrat ; il ne crée pas un second jeu. La vue interne getState reste utilisée par le plateau et les tests historiques. Elle n’est jamais retournée comme état public de l’API.

api.js fournit les quatre opérations. Les mutations attendent la fin des actions de l’écran avant de résoudre leur promesse. Le déploiement inclut api.js.

## Utiliser l’API

Ouvrir [le mode test](https://amelieheg.github.io/code_secret_1/?test=1) ; ?lang=fr&test=1 fonctionne aussi. Lire getConfig et getState est synchrone. Attendre startGame et submitGuess avec await.

Au chargement, le mode test attend un démarrage. En mode normal, une partie aléatoire commence comme auparavant. Un rechargement ne conserve aucun code imposé.

Les refus de submitGuess suivent l’ordre : partie non démarrée, partie terminée, type des éléments, longueur, couleurs. Ils conservent les données de jeu et remplacent seulement lastError. Un démarrage invalide rejette une Error avec code et message, avant toute modification de la partie ou de l’écran ; même lastError est conservé.

Le secret fourni et les propositions sont copiés. Modifier une configuration ou un état retourné ne change pas la partie. Le getState public n’inclut jamais de champ secret ou solution, même après défaite.

Un test historique regroupait couleurs inconnues et éléments non textuels. Il vérifie désormais invalid-color pour une chaîne interdite et invalid-type pour un nombre ou un objet. Les vérifications du compteur et de l’historique sont conservées.

## Vérifications disponibles

- Règles historiques : node game.test.js.
- Trois scénarios S5 : node tests/atelier5.test.cjs.
- Contrat : node --test tests/api02.test.cjs, soit 31 tests dont T01 à T09.
- Tous les contrôles précédents : npm test ; syntaxe : npm run check.
- Intégration avec le vrai plateau : npm run test:browser, si Playwright est disponible.

Le test navigateur utilise Playwright déjà fourni par l’environnement de développement et Microsoft Edge. Il n’est pas installé comme dépendance du jeu. PLAYWRIGHT_MODULE peut indiquer son chemin. Sans CODE_SECRET_BASE_URL, le script sert uniquement les fichiers du jeu en local sous /code_secret_1/. Avec cette variable, la même suite teste le site indiqué. Aucun serveur applicatif n’est ajouté à l’application publiée.

Résultats : [bilan du 25 novembre](preuves/api02-bilan-25-novembre.md), [rapport navigateur local](preuves/api02-navigateur-local-25-novembre.json), [capture ordinateur](preuves/api02-navigateur-local-25-novembre.png) et [capture à 390 pixels](preuves/api02-navigateur-local-25-novembre-mobile.png).

Les tests couvrent API vers écran, clics vers API, victoire/défaite au dixième essai, refus sans changement, getters sans effets, copies et rechargement. Leurs attendus sont écrits avant l’exécution.

Les 17 contrôles de navigateur ont également réussi sur le site publié du commit 52d856e : [rapport en ligne](preuves/api02-navigateur-publie-25-novembre.json). Les cinq fichiers servis ont été comparés aux sources sans différence de contenu.

## Limites

Le contrôle de l’enseignant n’a pas été exécuté. Smartphone réel, parcours clavier complet, lecteur d’écran, essai humain avec un binôme et autres navigateurs restent à vérifier. La largeur de 390 pixels est une simulation.

Le tag jalon-1 reste au commit dc50a1d avec sa version du moteur. L’API est un développement ultérieur de la branche principale ; aucun tag final n’est créé.
