(function (root) {
  'use strict';
  const PALETTE = Object.freeze(['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet']);
  const MAX_ATTEMPTS = 10;
  const SECRET_LENGTH = 4;
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

  function score(secret, guess) {
    let exact = 0;
    const remainingSecret = {};
    const remainingGuess = {};
    for (let i = 0; i < SECRET_LENGTH; i++) {
      if (secret[i] === guess[i]) exact++;
      else {
        remainingSecret[secret[i]] = (remainingSecret[secret[i]] || 0) + 1;
        remainingGuess[guess[i]] = (remainingGuess[guess[i]] || 0) + 1;
      }
    }
    const misplaced = PALETTE.reduce((sum, color) => sum + Math.min(remainingSecret[color] || 0, remainingGuess[color] || 0), 0);
    return { exact, misplaced };
  }

  // L’ordre de ces contrôles est imposé par le contrat 0.2.
  function validateColors(value) {
    if (!Array.isArray(value)) return 'invalid-type';
    for (let i = 0; i < value.length; i++) {
      if (!own(value, i) || typeof value[i] !== 'string') return 'invalid-type';
    }
    if (value.length !== SECRET_LENGTH) return 'invalid-length';
    if (value.some(color => !PALETTE.includes(color))) return 'invalid-color';
    return null;
  }

  function contractError(code, secret = false) {
    const messages = {
      'game-not-started': 'Aucune partie n’est démarrée. Lancez une nouvelle partie.',
      'game-finished': 'La partie est terminée. Lancez une nouvelle partie pour rejouer.',
      'invalid-options': 'Les options doivent être un objet contenant uniquement la clé facultative secret.',
      'invalid-type': secret
        ? 'Le secret doit être un tableau complet de noms de couleurs.'
        : 'Votre proposition est incomplète ou contient un élément qui n’est pas un nom de couleur.',
      'invalid-length': secret
        ? 'Le secret doit contenir exactement quatre couleurs.'
        : 'Votre proposition doit contenir exactement quatre couleurs.',
      'invalid-color': 'Couleur non autorisée. Utilisez uniquement : rouge, bleu, vert, jaune, orange, violet.'
    };
    const error = new Error(messages[code]);
    error.code = code;
    return error;
  }

  function createGame(random = Math.random, { autoStart = true } = {}) {
    let secret = null;
    let history = [];
    let status = 'not-started';
    let lastError = null;

    function startGame(options = {}) {
      if (!options || typeof options !== 'object' || Array.isArray(options)) throw contractError('invalid-options');
      const prototype = Object.getPrototypeOf(options);
      // Accepter aussi un objet ordinaire provenant d’un autre contexte JavaScript.
      const ordinary = prototype === null || (Object.getPrototypeOf(prototype) === null &&
        own(prototype, 'constructor') && typeof prototype.constructor === 'function' &&
        Function.prototype.toString.call(prototype.constructor) === Function.prototype.toString.call(Object));
      if (!ordinary || Reflect.ownKeys(options).some(key => key !== 'secret')) throw contractError('invalid-options');
      // Tout valider avant de remplacer la partie : même lastError doit rester intact en cas d’échec.
      const hasSecret = own(options, 'secret');
      if (hasSecret) {
        const invalid = validateColors(options.secret);
        if (invalid) throw contractError(invalid, true);
      }
      const nextSecret = hasSecret
        ? options.secret.slice()
        : Array.from({ length: SECRET_LENGTH }, () => PALETTE[Math.floor(random() * PALETTE.length)]);
      secret = nextSecret;
      history = [];
      status = 'playing';
      lastError = null;
      return getState();
    }

    function newGame() { return startGame(); }

    // Vue interne déjà utilisée par le plateau et les anciens tests.
    // La solution peut y être révélée à la fin ; cette vue n’est jamais retournée par l’API commune.
    function getState() {
      return {
        status,
        attempts: history.length,
        remaining: MAX_ATTEMPTS - history.length,
        history: history.map(entry => ({ guess: entry.guess.slice(), exact: entry.exact, misplaced: entry.misplaced })),
        secret: status === 'won' || status === 'lost' ? secret.slice() : null
      };
    }

    // Autre présentation de la MÊME partie, sans secret, avec des copies indépendantes.
    function getApiState() {
      const entries = history.map(entry => ({
        guess: entry.guess.slice(),
        result: { wellPlaced: entry.exact, misplaced: entry.misplaced }
      }));
      const last = history[history.length - 1];
      return {
        status,
        attempts: history.length,
        history: entries,
        lastGuess: last ? last.guess.slice() : null,
        lastResult: last ? { wellPlaced: last.exact, misplaced: last.misplaced } : null,
        lastError: lastError ? { ...lastError } : null
      };
    }

    function submit(guess) {
      const invalid = status === 'not-started' ? 'game-not-started'
        : status !== 'playing' ? 'game-finished' : validateColors(guess);
      if (invalid) {
        const error = contractError(invalid);
        lastError = { code: error.code, message: error.message };
        return { ok: false, error: error.message };
      }
      const result = score(secret, guess);
      history.push({ guess: guess.slice(), exact: result.exact, misplaced: result.misplaced });
      lastError = null;
      if (result.exact === SECRET_LENGTH) status = 'won';
      else if (history.length === MAX_ATTEMPTS) status = 'lost';
      return { ok: true, exact: result.exact, misplaced: result.misplaced, state: getState() };
    }

    if (autoStart) newGame();
    return Object.freeze({ newGame, startGame, submit, getState, getApiState });
  }
  const api = Object.freeze({ PALETTE, MAX_ATTEMPTS, SECRET_LENGTH, score, createGame });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CodeSecret = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
