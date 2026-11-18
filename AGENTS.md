# Consignes de travail

- Lire [README.md](README.md), puis les [règles de référence](docs/sources/regles.md) et les fichiers utiles à la demande. L’énoncé cité dans ces documents fait foi ; signaler une ambiguïté plutôt qu’inventer une règle.
- Conserver le travail existant et limiter les changements à la demande. Expliquer en français chaque étape importante et sa raison.
- Garder une application statique en HTML, CSS et JavaScript, sans compte, serveur applicatif, données personnelles ni clé API. Ne pas ajouter de dépendance sans besoin concret.
- Séparer les règles (`game.js`) de leur affichage (`app.js`). Ne pas modifier la palette ou le décompte des occurrences sans vérifier les règles communes.
- Depuis la racine, avec Node.js 18 ou plus récent, lancer `npm run check` et `npm test` après un changement de JavaScript. Sans npm, utiliser `node --check game.js`, `node --check app.js`, `node --check game.test.js` et `node game.test.js`.
- Pour un nouveau scénario, écrire avant son exécution le départ, l’action et l’attendu ; ajouter ensuite l’obtenu, la commande ou le parcours utilisé et la version testée. Ne pas présenter un essai automatique comme un test humain.
- Pour une correction, préciser l’attendu avant l’essai, conserver une preuve avant/après et rejouer le même cas ainsi qu’un cas valide. Pour l’interface, vérifier aussi dans un navigateur ; les tests du moteur ne prouvent pas le rendu visuel.
- Distinguer résultat observé, hypothèse et contrôle non réalisé. Actualiser le README quand l’usage ou une limite change ; renvoyer aux preuves plutôt que recopier un rapport.
- Faire un commit à chaque changement important vérifié, avec un message explicite. Ne pas écraser l’historique ni déplacer un tag existant sans demande.
- Avant un envoi Git, vérifier le dossier courant et `git remote -v` : le dépôt de cette copie est `amelieheg/code_secret_1`. Ne pas modifier le dépôt utilisé pour un autre test.
- Ne publier qu’avec l’autorisation de l’utilisateur. Exclure conversations, secrets et fichiers privés des commits. Signaler les accès manquants et les étapes non terminées.
