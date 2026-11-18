# Vérification du site publié le 18 novembre 2026

Adresse : https://amelieheg.github.io/code_secret_1/

Contrôle effectué dans le navigateur intégré de l’application, par clics sur les boutons visibles. Le secret est celui tiré aléatoirement par le site ; il n’a pas été fixé ni lu. Ce contrôle ne constitue pas un test humain en binôme.

| Départ et action | Attendu avant le contrôle | Obtenu | Statut |
| --- | --- | --- | --- |
| Page ouverte, quatre emplacements vides | Plateau accessible, essai 1/10, secret caché | Page « Code secret — À vous de décoder. », quatre points d’interrogation, essai 01/10 | Réussi |
| Choisir trois rouges puis valider | Refus expliqué, toujours au premier essai, aucune proposition validée | Message « Votre proposition est incomplète », essai 01/10, pas d’indice de proposition validée | Réussi |
| Ajouter le quatrième rouge puis valider | Proposition et deux indices visibles, un essai consommé | Quatre rouges conservés sur la première ligne ; indice affiché 1 bien placée et 0 mal placée ; essai 02/10 et 9 essais restants | Réussi pour l’affichage et le compteur |
| Cliquer sur Nouvelle partie | Effacer les essais, revenir à 1/10 et cacher le secret | Historique vide, essai 01/10, code affiché avec quatre points d’interrogation | Réussi |

La valeur 1 / 0 observée pour la proposition complète est une observation sur un secret inconnu. Elle ne prouve pas le calcul des indices. Le [test du cas des quatre rouges avec secret connu](atelier5-18-novembre.md) vérifie séparément ce calcul et attend 2 / 0 pour le secret rouge, rouge, bleu, vert.

Version de référence : tag jalon-1, commit 29c1ad3c574af110d656b061fc46fd3fa3f36273. Les quatre fichiers du jeu ne sont pas modifiés pendant cette mise à jour. La comparaison du site distant aux sources est consignée dans le contrôle de remise du 18 novembre.

Limites : navigateur intégré, pas de smartphone réel ; parcours complet au clavier et lecteur d’écran non vérifiés ; aucun essai humain en binôme.

## Correspondance contrôlée des fichiers

Le 18 novembre, une requête HTTP réelle a renvoyé 200 pour chacun des quatre fichiers index.html, style.css, game.js et app.js. Leur contenu a été comparé aux fichiers locaux puis aux mêmes fichiers du tag jalon-1 : aucune différence après normalisation des retours de ligne. Le tag distant a aussi été contrôlé avec git ls-remote : il désigne toujours 29c1ad3c574af110d656b061fc46fd3fa3f36273.
