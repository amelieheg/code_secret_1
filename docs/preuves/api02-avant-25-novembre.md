# État avant intégration de l’API 0.2

Date : 25 novembre 2026. Commit : dc50a1d089415d84650c066b40e44982fb1905c9.

Constats issus de la lecture du code et du moteur avant modification :
- game.js expose un moteur et le comptage des répétitions est déjà testé.
- createGame().getState().status vaut playing ; le mode not-started n’est pas implémenté.
- La méthode getApiState du moteur vaut undefined.
- Le fichier api.js existe : false.
- Aucun objet window.codeSecretTest n’est installé par app.js ; les noms publics, promesses, champs et codes du contrat ne sont pas implémentés.

Attendus avant l’essai de la nouvelle API : objet public uniquement avec test=1, état not-started initial, contrat 0.2 et une seule partie commune aux clics et aux appels. Les cas T01 à T09, les priorités de refus et les fins de partie seront vérifiés.
