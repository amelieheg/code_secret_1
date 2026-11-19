# Changements après lecture du support du 18 novembre

## Ce qui a été vérifié

La référence utilisée est la version Google Slides avec ses notes, édition 1.17 du 18 novembre, ainsi que les critères d’évaluation liés. Voir les [références de l’atelier](sources/atelier5-notes.md).

Les fichiers du jeu fonctionnent déjà pour les trois scénarios choisis. Il n’a donc pas été nécessaire de modifier index.html, style.css, game.js ou app.js.

## Les ajouts et leur raison

| Ajout ou modification | Pourquoi | Où le lire |
| --- | --- | --- |
| Trois scénarios avec secret connu, action et attendu écrits avant l’essai | Le support demande des vérifications reproductibles, avec un cas normal, un cas limite et un cas négatif | README, rubrique « Vérifications préparées pour l’atelier du 18 novembre » |
| Programme de test et fichier des attendus | Pour rejouer les mêmes cas sans modifier le jeu ni dépendre du secret aléatoire du site | tests/atelier5.test.cjs et tests/scenarios-atelier5.json |
| Résultats observés et version du code | Pour prouver que les scénarios ont réellement été exécutés | [Rapport des trois scénarios](preuves/atelier5-18-novembre.md) |
| Nouvel essai du site publié | Pour ouvrir le lien, jouer un coup et vérifier le redémarrage, comme demandé dans les notes | [Rapport du site](preuves/site-18-novembre.md) |
| Fichier Word de remise | Le support précise le format à déposer officiellement sur Cyberlearn | Fichier local livraison/jalon1_sordet.docx, fourni dans le chat |
| Correction des explications de remise du guide débutant | Les liens seuls dans un message ne remplacent pas le fichier Word demandé | [Guide débutant](COMPRENDRE-JALON-1.md), dernière rubrique |
| Mention explicite du test croisé non réalisé | Personne n’a testé le jeu en binôme ; il faut le dire sans inventer de résultat | README, rubrique de l’atelier |
| Consigne durable sur les attendus | Garder la méthode du cours lors des prochains tests | AGENTS.md |

## Résultats

Les 22 tests historiques et les 3 nouveaux scénarios réussissent. Le cas du cours est confirmé : secret rouge, rouge, bleu, vert ; proposition rouge, rouge, rouge, rouge ; résultat 2 bien placées, 0 mal placée, un essai et une proposition dans l’historique.

Les commandes utiles sont npm run check et npm test depuis la racine du projet, avec Node.js 18 ou plus récent. La commande npm run test:atelier5 rejoue seulement les trois scénarios. Aucune installation n’est nécessaire pour jouer.

## Le tag et le site

Le 18 novembre, le tag jalon-1 désignait 29c1ad3c574af110d656b061fc46fd3fa3f36273. Les nouveaux tests et explications avaient alors été ajoutés après ce tag, sans modifier le jeu.

Actualisation du 19 novembre : l’étudiante demande que le tag contienne aussi le README révisé. Le tag jalon-1 est donc mis à jour sur la nouvelle version de remise ; l’ancien repère est sauvegardé sous archive-jalon-1-avant-readme-19-novembre. Les fichiers du jeu ne changent pas et le Word est mis en cohérence avec le nouveau commit.

## Ce qui reste à faire par l’étudiante

1. Ouvrir le fichier Word et vérifier le nom et les liens.
2. Le déposer dans la bonne activité Cyberlearn avant le 20 novembre au soir. Vérifier l’heure et les indications de cette activité.
3. Prévoir ensuite un test humain avec un binôme et un essai sur smartphone réel pour les travaux suivants. Ils ne sont pas annoncés comme réalisés.

Ni la vidéo, ni l’API commune du rendu final, ni le bonus d’erreur volontaire ne sont ajoutés pour J1. Aucune conversation privée ni démarche de participation à l’étude ne fait partie de ces fichiers.
