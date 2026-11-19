# Scénarios exécutés après lecture du support S5

Note du 19 novembre 2026 : ce rapport conserve les observations et le tag tels qu’ils étaient à la date du contrôle. L’ancien commit 29c1ad3 reste accessible sous le tag d’archive archive-jalon-1-avant-readme-19-novembre. Le tag jalon-1 est actualisé, à la demande de l’étudiante, pour inclure le README révisé ; les fichiers du jeu restent identiques.


Date et heure UTC : 2026-11-18T10:42:37.424Z
Environnement : Node.js v24.22.3, win32.
Commande : node tests/atelier5.test.cjs --rapport
Commit du dossier au lancement : 9a44362639ad375e798c8cacc67f65c07d71c273.
Version figée de remise : jalon-1, commit 29c1ad3c574af110d656b061fc46fd3fa3f36273.
Comparaison réelle de game.js avec le tag : contenu identique après normalisation des retours de ligne.
Les quatre fichiers publiés du jeu restent inchangés ; seuls les tests et la documentation sont complétés.
Empreinte Git du fichier des attendus : 6f94d371e0a0aa6ec53c186e8cad0541c43b2081.

Les attendus ont été écrits dans le README et dans tests/scenarios-atelier5.json avant cette exécution. Ils proviennent du raisonnement sur les règles, pas du résultat du jeu.
Le tirage est contrôlé seulement dans les instances locales de test. Ce n’est pas une implémentation de l’API commune 0.2.

## Cas normal

- Départ : nouvelle partie, secret rouge, bleu, vert, jaune, zéro essai, historique vide.
- Action : proposer rouge, bleu, orange, violet.
- Attendu : {"ok":true,"exact":2,"misplaced":0,"attempts":1,"historyLength":1}.
- Obtenu : {"ok":true,"attempts":1,"historyLength":1,"exact":2,"misplaced":0}.
- Statut : réussi.

## Cas limite avec répétitions

- Départ : nouvelle partie, secret rouge, rouge, bleu, vert, zéro essai, historique vide.
- Action : proposer rouge, rouge, rouge, rouge.
- Attendu : {"ok":true,"exact":2,"misplaced":0,"attempts":1,"historyLength":1}.
- Obtenu : {"ok":true,"attempts":1,"historyLength":1,"exact":2,"misplaced":0}.
- Statut : réussi.

## Cas négatif

- Départ : nouvelle partie, secret rouge, rouge, bleu, vert, zéro essai, historique vide.
- Action : proposer rouge, bleu, vert.
- Attendu : {"ok":false,"attempts":0,"historyLength":0}.
- Obtenu : {"ok":false,"attempts":0,"historyLength":0,"explanation":"Votre proposition est incomplète : choisissez une couleur pour chacun des quatre emplacements."}.
- Statut : réussi.

## Bilan

3 / 3 scénarios réussis.

Ces contrôles automatisés vérifient les règles et les modifications de l’état. Ils ne prouvent pas à eux seuls le fonctionnement des boutons, le parcours clavier ou un essai humain avec un binôme.
Le test croisé avec un binôme n’a pas été réalisé, selon la réponse de l’étudiante du 18 novembre 2026.
