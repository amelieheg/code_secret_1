# Publication du dépôt distinct — 12 novembre 2026

Note du 19 novembre 2026 : ce rapport conserve les observations et le tag tels qu’ils étaient à la date du contrôle. L’ancien commit 29c1ad3 reste accessible sous le tag d’archive archive-jalon-1-avant-readme-19-novembre. Le tag jalon-1 est actualisé, à la demande de l’étudiante, pour inclure le README révisé ; les fichiers du jeu restent identiques.


## Destination de remise

- [Dépôt amelieheg/code_secret_1](https://github.com/amelieheg/code_secret_1).
- [Application Code secret](https://amelieheg.github.io/code_secret_1/).
- [Version de remise jalon-1](https://github.com/amelieheg/code_secret_1/tree/jalon-1).

Le dossier local est « Code secret - Jalon 1 ». Les sept premiers commits sont repris de la première copie. Les commits suivants adaptent uniquement la documentation au nouveau dépôt et aux guides fournis. Les fichiers du jeu restent identiques à ceux des tests locaux et des essais d’interface antérieurs.

## Exécutions propres au nouveau dépôt

- [Tests des règles](https://github.com/amelieheg/code_secret_1/actions/runs/43192639902) : terminés avec succès pour le commit 310e3f9.
- [Publication Pages](https://github.com/amelieheg/code_secret_1/actions/runs/43192637128) : terminée avec succès pour le même commit.
- Le premier déploiement avait échoué avant activation de Pages ; la relance a réussi après activation de la source GitHub Actions.

## Vérification HTTP réelle

Contrôle exécuté avec Node.js 24.22.1 sous Windows le 12 novembre 2026. Chaque fichier distant est comparé à son fichier local, en normalisant uniquement les retours de ligne Windows/Unix.

| Fichier | Réponse HTTP | Comparaison |
| --- | --- | --- |
| index.html | 200 | Identique |
| style.css | 200 | Identique |
| game.js | 200 | Identique |
| app.js | 200 | Identique |

Empreintes SHA-256 des contenus normalisés :

- index.html : 2e36b030a38caf626dd0620e83cfd8ae1fdefdc2ecc42cc7654b42c6c48e54cd
- style.css : 75d62eb4e1ee1136d7d423c9c8b941d13e517f9b878d430d6dd9ef79d81acb48
- game.js : f941ee028266744cc9ecf27055df4007984d0488f6c26f913e481d3b17339b49
- app.js : 23b651ec6d09adf45079b98ac06b25f2c034a4c2325106252e147316008afd66

Ce contrôle établit la disponibilité et l’identité des fichiers du nouveau site. Il ne constitue pas un nouvel essai de toutes les interactions du navigateur ; les [essais d’interface antérieurs](tests-navigateur.md) portent sur le même code. Smartphone réel, lecteur d’écran et parcours clavier complet restent non vérifiés.

Le tag de remise du nouveau dépôt désigne le commit contenant cette documentation finalisée. Le tag repris de la première copie est conservé localement sous le nom archive-source-jalon-1 ; aucun tag de l’ancien dépôt distant n’est modifié.
