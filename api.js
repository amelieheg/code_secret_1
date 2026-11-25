(function (root) {
  'use strict';
  const engine = typeof module !== 'undefined' && module.exports ? require('./game') : root.CodeSecret;

  function isTestMode(search) {
    return new URLSearchParams(search).get('test') === '1';
  }

  function createTestApi(game, actions = {}) {
    const start = actions.startGame || (options => game.startGame(options));
    const submit = actions.submitGuess || (guess => game.submit(guess));
    return Object.freeze({
      version: '0.2',
      getConfig() {
        return {
          apiVersion: '0.2',
          rulesVersion: 'code-couleurs-1.0',
          secretLength: engine.SECRET_LENGTH,
          maxAttempts: engine.MAX_ATTEMPTS,
          allowDuplicates: true,
          colors: engine.PALETTE.slice()
        };
      },
      getState() { return game.getApiState(); },
      // Les actions de l’interface sont terminées avant la résolution des promesses.
      async startGame(options) {
        await start(options);
        return game.getApiState();
      },
      async submitGuess(guess) {
        await submit(guess);
        return game.getApiState();
      }
    });
  }

  const api = Object.freeze({ isTestMode, createTestApi });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CodeSecretApi = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
