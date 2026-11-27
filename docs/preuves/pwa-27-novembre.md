# Installation PWA — 27 novembre 2026

## État de départ et attendus avant vérification

Version de départ : 0f017ee. Le jeu fonctionne en ligne mais n’a ni manifeste, ni icônes d’installation, ni service worker, ni QR code.

Attendus :
- Le manifeste annonce Code secret, des icônes PNG 192 et 512 px, un affichage autonome et un démarrage dans /code_secret_1/, sans test=1.
- Le QR contient exactement https://amelieheg.github.io/code_secret_1/.
- Le navigateur charge et active le service worker limité au dossier du jeu. Après un premier chargement en ligne, le jeu se recharge hors connexion.
- Les boutons du jeu fonctionnent en mode normal sans API exposée ; ?test=1 expose toujours la version 0.2, sur la même partie que l’interface, en ligne et hors connexion.
- Le guide est lisible à 360 px, le QR et les icônes se chargent, aucune nouvelle erreur JavaScript n’apparaît.
- Les contrôles de syntaxe, les 56 tests existants et les contrôles navigateur de l’API réussissent.
- Sur un vrai téléphone : scanner le QR, vérifier le bon jeu, suivre l’installation du navigateur, ouvrir depuis l’icône puis vérifier le nom, l’icône et un coup.

## Résultats

Vérifications locales réalisées sous Windows avec Node.js 24.22.3 et Microsoft Edge 158.0.4370.33 :

| Contrôle | Résultat observé | Preuve |
| --- | --- | --- |
| Syntaxe et règles/API | Toutes les commandes de check et les 56 tests réussissent, aucun échec | [sorties](pwa-27-non-regression.json) |
| Intégration API/interface | 17 contrôles réussis avec les nouveaux fichiers PWA servis | [rapport](pwa-27-api-local.json) |
| PWA | 9 contrôles réussis : manifeste, icônes, service worker, installabilité, jeu normal, guide mobile, hors connexion, API hors connexion, retour en ligne et absence d’erreur JavaScript (plusieurs éléments regroupés dans les neuf scénarios) | [rapport](pwa-27-local.json) |
| QR code | Décodage indépendant avec zxing-cpp : exactement https://amelieheg.github.io/code_secret_1/ | [lecture et empreinte](pwa-27-qr.json) |
| Guide à 360 × 800 | QR chargé, lien normal, aucun débordement horizontal | [capture locale](pwa-27-local-mobile.png) |

Les rapports locaux identifient le commit de départ 0f017ee et les empreintes SHA-256 des fichiers modifiés réellement testés. Le code des règles, de l’interface de jeu et de l’API (game.js, app.js, api.js) est inchangé.

Le premier contrôle d’installabilité a signalé « in-incognito » dans le profil privé du test. Le test utilise donc un nouveau profil temporaire normal, isolé du profil personnel, et n’installe aucune application. Dans ce profil, Edge ne signale aucune erreur d’installabilité du manifeste. Le profil temporaire est supprimé après le contrôle.

Commandes : npm run check, npm test, npm run test:browser et npm run test:pwa. npm étant absent de l’environnement local, les commandes Node.js définies dans package.json ont été exécutées directement. Playwright, Pillow, ReportLab et le lecteur QR sont des outils de développement ; aucune dépendance n’est ajoutée au jeu publié.

Le test mobile précédent vérifie le jeu ; il ne prouve pas l’installation de la PWA. La version PWA est publiée au commit 03dc97a. Les contrôles en ligne ont réussi ; l’installation réelle sur le Sony XQ-AS52 et sur ordinateur n’est pas encore confirmée.

## Contrôles après publication

- Version testée : 03dc97a70a7e17fc254b80add903145fb0cb9ba0.
- [Tests GitHub réussis](https://github.com/amelieheg/code_secret_1/actions/runs/46027786086) et [déploiement réussi](https://github.com/amelieheg/code_secret_1/actions/runs/46027785898).
- Les 13 fichiers publiés (dont manifeste, service worker, icônes et QR) répondent en HTTP 200 et correspondent à ce commit : [comparaison](pwa-27-publication.json).
- Les neuf contrôles PWA ont été rejoués sur HTTPS : [9/9 réussis](pwa-27-publie.json), dont le rechargement hors connexion et l’API sur la partie visible.
- Les contrôles existants de l’API sur le site publié : [17/17 réussis](pwa-27-api-publie.json), sans erreur JavaScript.
- Aperçu intégré de Codex : le guide a été déplié sur le site publié, puis examiné à 360 × 800. QR et lien chargés ; largeur utile et largeur totale égales à 345 px. Les étapes et le QR restent lisibles ; le format temporaire est ensuite réinitialisé.
- L’installabilité est contrôlée automatiquement dans Edge ; aucune installation sur l’appareil personnel de l’étudiante n’a été réalisée par l’assistant. Le test réel demandé consiste à scanner le QR, installer dans Chrome, ouvrir depuis l’icône puis vérifier le nom, l’icône et un coup.
- Le tag de remise jalon-1 est inchangé : dc50a1d. Cette PWA est un ajout ultérieur.

## Choix et fichiers

- manifest.webmanifest : nom, icônes, adresse normale de démarrage et périmètre.
- pwa.js : préparation du service worker et bouton d’installation quand le navigateur le propose. Aucune modification du moteur.
- sw.js : mise en cache des fichiers, sans données de partie. Réseau prioritaire puis copie locale si la connexion manque ; les polices en ligne restent facultatives.
- assets/ : icônes et QR générés localement ; tools/generate-pwa-assets.py permet de les recréer avec Pillow et ReportLab.
- index.html et style.css : liens du manifeste et aide d’installation intégrée.
- Le déploiement Pages emporte ces fichiers supplémentaires.

Une installation ne sauvegarde pas la partie : recharger ou rouvrir le jeu commence une nouvelle partie, comme avant. Un premier accès en ligne réussi est nécessaire pour le mode hors connexion.

Sources techniques consultées : [installation PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers), [installation selon le navigateur](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing).
