'use strict';
// L’installation reste indépendante du moteur et de la partie affichée.
(() => {
  const button = document.getElementById('install-app');
  const status = document.getElementById('install-status');
  let invitation = null;
  function installed() {
    invitation = null;
    button.hidden = true;
    status.textContent = 'Code secret est installé. Ouvrez-le depuis son icône.';
  }
  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone) installed();
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    invitation = event;
    button.hidden = false;
    status.textContent = 'Ce navigateur propose l’installation de Code secret.';
  });
  button.addEventListener('click', async () => {
    if (!invitation) return;
    const current = invitation;
    invitation = null;
    button.hidden = true;
    try {
      await current.prompt();
      const answer = await current.userChoice;
      status.textContent = answer.outcome === 'accepted'
        ? 'Installation demandée. Vérifiez le nom et l’icône, puis ouvrez le jeu depuis votre écran d’accueil.'
        : 'Installation annulée. Vous pouvez continuer à jouer ou utiliser le menu du navigateur.';
    } catch {
      status.textContent = 'Utilisez le menu du navigateur et suivez les étapes ci-dessous.';
    }
  });
  window.addEventListener('appinstalled', installed);
  // file:// reste utilisable pour jouer ; le service worker nécessite HTTPS ou localhost.
  if ('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
        .catch(() => {
          status.textContent = 'La préparation hors connexion n’a pas abouti. Rechargez avec une connexion ; le jeu reste utilisable en ligne.';
        });
    });
  }
})();
