# Comprendre le projet et le rendu du jalon 1

Ce guide est destiné à une personne qui débute en programmation. Il explique ce qui existe dans le projet « Code secret », pourquoi les fichiers ont été ajoutés et ce qu’il faut transmettre pour le 20 novembre 2026 au soir.

## 1. Est-ce que le rendu répond à la consigne ?

Oui : les éléments demandés dans la [consigne du jalon 1](sources/consigne-j1.md) sont présents. Le jalon demande une première version vérifiée, qui peut encore comporter des limites. Il ne demande pas une application parfaite.

| Demande du cours | Où la trouver | État |
| --- | --- | --- |
| Lien du dépôt | Début du README | Présent : code_secret_1 |
| Lien de l’application | Début du README | Site publié et vérifié |
| Version repérée par le tag jalon-1 | Lien « Version de remise » dans le README | Version actualisée le 19 novembre avec le README révisé |
| Règles et leur source | README : « Règles et source » ; document sources/regles.md | Présentes |
| Choix de réalisation | README : « Décision prise avec Codex » | Choix expliqué et contrepartie indiquée |
| Premiers résultats attendus | Tableau de la rubrique « Vérifier les règles » | Attendu et résultat observé distingués |
| Questions ouvertes | README : « État actuel » | Présentes |
| Correction expliquée | README : « Correction expliquée » | Problème, attendu, changement et résultat décrits |
| Preuves avant/après | Dossier preuves : CSS sauvegardé, extrait de correction et captures | Présentes ; l’image avant est une reconstitution annoncée |
| Premiers tests | Rapport preuves/tests-regles.md et rapport du navigateur | 22 tests du moteur réussis ; essais d’interface documentés |
| Court bilan des limites | README : « État actuel » | Présent |
| Fichier Word sur Cyberlearn | Fichier local livraison/jalon1_sordet.docx, fourni dans le chat | Préparé ; dépôt à effectuer par l’étudiante |
| Aucun extrait de conversation demandé | README : décision reformulée | Aucun historique de chat à transmettre |
| Aucune vidéo à ce stade | Périmètre du rendu | Aucune vidéo nécessaire |

Mise à jour du 18 novembre : le support S5 et les critères d’évaluation précisent le dépôt sur Cyberlearn du fichier jalon1_sordet.docx. Ce document a été préparé avec les deux liens et le tag. L’heure limite précise et l’activité sont à vérifier sur Cyberlearn.

## 2. À quoi sert chaque fichier ?

| Fichier | Explication simple |
| --- | --- |
| index.html | La structure de la page : titres, plateau, boutons et emplacement des messages. |
| style.css | L’apparence : couleurs, tailles et disposition sur ordinateur ou petit écran. |
| game.js | Les règles : tirer le secret, contrôler les propositions, calculer les indices, compter les essais et décider victoire ou défaite. |
| app.js | Le lien entre les boutons et les règles. Il réagit aux clics et actualise ce qui apparaît sur la page. |
| game.test.js | Une série de vérifications automatiques. Le programme essaie des situations connues et vérifie le résultat. |
| README.md | Le document à lire pour comprendre, lancer et vérifier le projet. GitHub l’affiche sur la page du dépôt. |
| AGENTS.md | Les consignes durables destinées à Codex lorsqu’il travaille sur ce projet : fichiers à lire, règles à conserver, vérifications à effectuer. |
| package.json | Les raccourcis pour lancer les contrôles avec Node.js. Il n’impose aucune installation pour jouer. |
| .github/workflows/tests.yml | Demande à GitHub de vérifier la syntaxe et les règles après un envoi de code. |
| .github/workflows/pages.yml | Demande à GitHub de publier les quatre fichiers du jeu sur GitHub Pages. |
| docs/sources/ | Les règles et le périmètre du rendu, avec leurs sources. |
| docs/preuves/ | Les résultats et les images qui permettent de vérifier les affirmations du README. |

Pour jouer, tu as besoin du lien du site ou du fichier index.html et des trois fichiers du jeu qui l’accompagnent. Les autres fichiers servent à comprendre, vérifier et transmettre le travail.

## 3. Ce qui a été fait, et pourquoi

### Le jeu a été construit

Le programme choisit quatre couleurs, permet de proposer une combinaison et donne deux nombres comme indices. Il conserve les essais, reconnaît une victoire même au dixième essai et bloque les propositions quand la partie est terminée.

La modification d’une couleur avant validation se fait en sélectionnant son emplacement puis une autre couleur.

### Les règles ont été séparées de l’écran

C’est la décision expliquée dans le README : game.js contient les règles et app.js gère les interactions.

Cela permet de vérifier le calcul avec un secret connu, sans devoir deviner le secret d’une partie aléatoire. Cela oblige aussi à vérifier l’écran séparément : un bon calcul ne garantit pas que les boutons sont utilisables.

Dans le README, « API JavaScript interne » signifie simplement les fonctions grâce auxquelles ces fichiers communiquent. Ce n’est pas un service payant ni une connexion à une intelligence artificielle. Aucun appel à une IA n’est nécessaire pendant le jeu.

### Un problème d’affichage sur petit écran a été corrigé

Avant, une instruction du fichier style.css masquait à la fois la légende et une petite phrase décorative lorsque la largeur était de 760 pixels ou moins.

Après la correction, seule la phrase décorative est masquée. Les explications « Bien placée » et « Mal placée » restent visibles.

Les preuves sont [l’extrait du code avant/après](preuves/correction-mobile.txt) et les [résultats avec captures](preuves/tests-navigateur.md). L’image avant a été reconstituée avec le CSS réellement sauvegardé avant correction. Ce détail est annoncé pour ne pas faire passer cette image pour une capture historique.

### Des vérifications ont été ajoutées

Les tests vérifient notamment qu’une proposition incomplète est refusée sans perdre d’essai, qu’une couleur n’est pas comptée plusieurs fois et qu’une victoire au dixième essai est acceptée.

Exemple avec des répétitions :

- Secret : rouge, rouge, bleu, vert.
- Proposition : rouge, bleu, rouge, rouge.
- Attendu : 1 bien placée et 2 mal placées.

Le premier rouge est déjà bien placé. Il reste un rouge et un bleu à retrouver dans les autres positions. Le rouge supplémentaire de la proposition ne rapporte aucun indice, car il n’y a plus d’occurrence rouge disponible dans le secret.

Les 22 tests historiques réussissent. Trois scénarios supplémentaires du support du 18 novembre ont été exécutés et réussissent aussi ; voir le README et le rapport associé. Un de ces tests compare les indices de toutes les 1 679 616 paires de codes possibles à un autre calcul de référence. Ce nombre ne signifie pas qu’un humain a joué autant de parties : c’est une vérification automatique du calcul.

### Le projet a été documenté et publié séparément

Le README présente le projet aux lecteurs. AGENTS.md donne les consignes de travail à Codex, conformément aux deux guides de cours fournis.

Le dossier « Code secret - Jalon 1 » et le dépôt code_secret_1 permettent de séparer ce rendu de l’ancien test. GitHub conserve le code ; GitHub Pages sert à ouvrir et jouer au jeu sur Internet. Ce sont deux liens différents.

## 4. Les commits et le tag, en mots simples

Un commit est un enregistrement de fichiers dans Git avec un message. Il permet de voir les changements et de retrouver une version antérieure. Les sept premiers commits ont été repris de la première copie ; ils ne correspondent pas à sept nouvelles modifications du nouveau dépôt.

| Commit | Ce qu’il enregistre |
| --- | --- |
| 3e2f7e0 | Les règles et les premiers tests. |
| 1c9d6cc | La page et les interactions en français. |
| a4438ce | Le style avec la correction mobile, et la copie du CSS avant correction. |
| ec8b4b9 | La documentation et les consignes de travail. |
| 27a4d8d | Les tests enrichis et les preuves de l’interface. |
| f4f545c | Les fichiers de tests et de publication sur GitHub. |
| e925f6e | La confirmation de publication de la première copie. |
| 421d149 | L’adaptation des documents au nouveau dépôt code_secret_1. |
| 310e3f9 | Les ajustements selon les guides README et AGENTS. |
| 29c1ad3 | Les liens et preuves finalisés pour le nouveau dépôt. |

Un tag est une étiquette qui permet de retrouver un commit précis. Le tag [jalon-1](https://github.com/amelieheg/code_secret_1/tree/jalon-1) désigne la version de remise actualisée le 19 novembre, qui contient le README révisé. Le lien du tag permet de voir le commit exact.

À la demande de l’étudiante, le tag jalon-1 est déplacé le 19 novembre sur la version qui inclut le README allégé, ce guide et les compléments de test. Le jeu reste identique. L’ancienne version 29c1ad3 est conservée sous le tag archive-jalon-1-avant-readme-19-novembre. Le fichier Word de remise indique le nouveau commit.

## 5. Ce qui reste limité

Le jeu ne sauvegarde pas la partie si la page est rechargée. L’essai sur petit écran simule une largeur de téléphone ; ce n’est pas une vérification sur un téléphone réel. Le parcours complet au clavier et l’usage avec un lecteur d’écran ne sont pas encore vérifiés.

Ces limites sont déclarées dans le README. La consigne autorise une première version encore incomplète. La vidéo et le travail d’API commune mentionnés pour le jalon suivant ne font pas partie de ce rendu.

## 6. Ce que tu peux vérifier toi-même

Sans installer d’outil :

1. Ouvre [le jeu](https://amelieheg.github.io/code_secret_1/).
2. Remplis seulement trois emplacements et valide. Un message doit expliquer le refus ; le compteur doit rester au premier essai et aucune proposition ne doit être ajoutée à l’historique.
3. Complète le quatrième emplacement et valide. La proposition doit apparaître dans l’historique, avec les deux nombres d’indices.
4. Clique sur « Nouvelle partie ». Les anciennes propositions doivent disparaître et le compteur doit revenir au premier essai.

C’est un petit parcours pour prendre le jeu en main. Il ne remplace pas tous les tests automatiques et ne permet pas de forcer une victoire avec un code inconnu.

## 7. Ce qu’il faut transmettre

Le support du 18 novembre précise de déposer **jalon1_sordet.docx sur Cyberlearn**. Ce fichier est préparé dans le sous-dossier local livraison et fourni dans le chat. Il contient les trois références suivantes :

- Dépôt : https://github.com/amelieheg/code_secret_1
- Application : https://amelieheg.github.io/code_secret_1/
- Version de remise : https://github.com/amelieheg/code_secret_1/tree/jalon-1

Le code, le README et les preuves restent sur GitHub. Le fichier Word sert à transmettre officiellement les liens et le tag sur Cyberlearn ; les liens seuls dans un message ne remplacent pas ce document. Ouvre le Word, contrôle ton nom et ses liens, puis dépose-le toi-même dans l’activité du cours avant le 20 novembre au soir. Aucune vidéo ni archive ZIP n’est demandée pour J1. Le présent guide, les compléments du 18 novembre et le README révisé font partie de la version actualisée du tag jalon-1.

Avant l’envoi, lis surtout la décision avec Codex, la correction et les limites : tu dois pouvoir les expliquer avec tes mots. Tu n’as pas besoin de comprendre chaque ligne de JavaScript pour comprendre ces trois éléments.
