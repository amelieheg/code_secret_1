# Contrat API commune 0.2

Référence : [API commune de test — contrat 0.2](https://docs.google.com/document/d/1hxqc3QfG0PTknulNIisBvg-0h0W7CjRe6eHC1q_jBYU/edit), édition Google 1.5, mise à jour du 28 octobre 2026, relue le 25 novembre. Le document lié fait foi.

Le contrat impose un objet codeSecretTest avec test=1, quatre opérations, une configuration commune, un état initial not-started et la même partie que l’interface. Les lectures sont synchrones ; les mutations retournent des promesses. L’état public ne contient aucune solution et les données retournées sont des copies.

Les validations vérifient l’état de la partie, le type, la longueur puis les couleurs. Un démarrage invalide rejette une Error sans modifier la partie. Les cas T01 à T09 et les scénarios de fin de partie servent de références aux tests.

Les champs et codes sont conservés exactement dans api.js et les tests ; les messages sont rédigés en français.
