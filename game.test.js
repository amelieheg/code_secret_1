'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { PALETTE, score, createGame } = require('./game');
let passed = 0;
let failed = 0;
const lines = ['# Rapport des tests — Code secret', '', `Exécution réelle : ${new Date().toISOString()}`, `Environnement : Node.js ${process.version}, ${process.platform}.`, 'Commande : node game.test.js --rapport', '', 'Ces tests portent sur les règles JavaScript. Ils ne valident pas le rendu visuel du navigateur.', ''];
function test(name, run) {
  try {
    run(); passed++;
    console.log(`OK — ${name}`);
    lines.push(`- OK — ${name}`);
  } catch (error) {
    failed++;
    console.error(`ÉCHEC — ${name}\n${error.stack}`);
    lines.push(`- ÉCHEC — ${name}`, '', '```text', error.stack, '```', '');
  }
}
const red = ['rouge', 'rouge', 'rouge', 'rouge'];
const blue = ['bleu', 'bleu', 'bleu', 'bleu'];
const redGame = () => createGame(() => 0);
test('R1 — Les six identifiants et leur ordre sont exacts', () => {
  assert.deepEqual(PALETTE, ['rouge', 'bleu', 'vert', 'jaune', 'orange', 'violet']);
  assert.equal(Object.isFrozen(PALETTE), true);
});
test('R1 — Quatre tirages indépendants permettent les répétitions', () => {
  let calls = 0;
  const game = createGame(() => { calls++; return 0; });
  assert.equal(calls, 4);
  assert.equal(game.submit(red).state.status, 'won');
});
test('R1 — Chacune des six couleurs peut être tirée', () => {
  PALETTE.forEach((color, index) => {
    const game = createGame(() => (index + 0.5) / PALETTE.length);
    assert.equal(game.submit([color, color, color, color]).state.status, 'won');
  });
});
test('R1 — Le secret reste fixe et caché après une proposition', () => {
  let calls = 0;
  const game = createGame(() => { calls++; return 0; });
  assert.equal(game.getState().secret, null);
  game.submit(blue);
  assert.equal(calls, 4);
  assert.equal(game.getState().secret, null);
  assert.equal(game.submit(red).state.status, 'won');
});
test('R2 — Une nouvelle partie a dix essais et aucun historique', () => {
  assert.deepEqual(redGame().getState(), { status: 'playing', attempts: 0, remaining: 10, history: [], secret: null });
});
test('R2/R5 — L’ordre gauche-droite change les indices', () => {
  const secret = ['rouge', 'bleu', 'vert', 'jaune'];
  assert.deepEqual(score(secret, secret), { exact: 4, misplaced: 0 });
  assert.deepEqual(score(secret, ['bleu', 'rouge', 'jaune', 'vert']), { exact: 0, misplaced: 4 });
});
test('R3 — Les propositions incomplètes sont refusées sans mutation', () => {
  const game = redGame();
  game.submit(blue);
  const before = game.getState();
  [null, [], ['rouge'], ['rouge', null, 'rouge', 'rouge'], ['rouge', '', 'rouge', 'rouge'], new Array(4), [...red, 'rouge']].forEach(guess => {
    const result = game.submit(guess);
    assert.equal(result.ok, false);
    assert.ok(result.error.length > 0);
    assert.deepEqual(game.getState(), before);
  });
});
test('R3 — Les couleurs interdites et les majuscules sont refusées sans mutation', () => {
  const game = redGame();
  game.submit(blue);
  const before = game.getState();
  ['rose', 'Rouge', 'red', 1, {}].forEach(color => {
    const result = game.submit([color, 'rouge', 'rouge', 'rouge']);
    assert.equal(result.ok, false);
    const isColor = typeof color === 'string';
    assert.match(result.error, isColor ? /non autorisée/ : /nom de couleur/);
    assert.equal(game.getApiState().lastError.code, isColor ? 'invalid-color' : 'invalid-type');
    assert.deepEqual(game.getState(), before);
  });
});
test('R4 — Une proposition valide consomme exactement un essai', () => {
  const game = redGame();
  for (let i = 1; i <= 3; i++) {
    const result = game.submit(blue);
    assert.equal(result.ok, true);
    assert.equal(result.state.attempts, i);
    assert.equal(result.state.remaining, 10 - i);
  }
});
test('R4 — Les propositions et indices restent dans l’historique', () => {
  const game = redGame();
  game.submit(blue);
  game.submit(['rouge', 'bleu', 'bleu', 'bleu']);
  assert.deepEqual(game.getState().history, [{ guess: blue, exact: 0, misplaced: 0 }, { guess: ['rouge', 'bleu', 'bleu', 'bleu'], exact: 1, misplaced: 0 }]);
});
test('R4 — Modifier une proposition ou une copie de l’état préserve l’historique', () => {
  const game = redGame();
  const guess = blue.slice();
  game.submit(guess);
  guess[0] = 'vert';
  const state = game.getState();
  state.history[0].guess[0] = 'jaune';
  state.history[0].exact = 4;
  assert.deepEqual(game.getState().history[0], { guess: blue, exact: 0, misplaced: 0 });
});
test('R5 — Priorité aux bien placées avec doublons : 1 / 2', () => {
  assert.deepEqual(score(['rouge', 'rouge', 'bleu', 'vert'], ['rouge', 'bleu', 'rouge', 'rouge']), { exact: 1, misplaced: 2 });
});
test('R5 — Une occurrence rouge ne compte pas quatre fois : 1 / 0', () => {
  assert.deepEqual(score(['rouge', 'bleu', 'vert', 'jaune'], red), { exact: 1, misplaced: 0 });
});
test('R5 — Quatre couleurs présentes toutes mal placées : 0 / 4', () => {
  assert.deepEqual(score(['rouge', 'rouge', 'bleu', 'bleu'], ['bleu', 'bleu', 'rouge', 'rouge']), { exact: 0, misplaced: 4 });
});
test('R5 — Aucune couleur commune : 0 / 0', () => {
  assert.deepEqual(score(red, blue), { exact: 0, misplaced: 0 });
});
test('R5 — Vérification exhaustive des 1 679 616 paires de codes', () => {
  // Oracle indépendant : intersection des histogrammes complets, puis retrait
  // des bien placées. L’implémentation retire les positions identiques d’abord.
  const codes = [];
  for (const a of PALETTE) for (const b of PALETTE) for (const c of PALETTE) for (const d of PALETTE) {
    const colors = [a, b, c, d];
    codes.push({ colors, counts: PALETTE.map(color => colors.filter(value => value === color).length) });
  }
  for (const secret of codes) for (const guess of codes) {
    let exact = 0;
    for (let i = 0; i < 4; i++) if (secret.colors[i] === guess.colors[i]) exact++;
    let common = 0;
    for (let i = 0; i < 6; i++) common += Math.min(secret.counts[i], guess.counts[i]);
    const actual = score(secret.colors, guess.colors);
    if (actual.exact !== exact || actual.misplaced !== common - exact) assert.fail(`Secret ${secret.colors}, proposition ${guess.colors} : ${JSON.stringify(actual)}`);
  }
});
test('R6 — La victoire au premier essai révèle le secret', () => {
  const result = redGame().submit(red);
  assert.equal(result.state.status, 'won');
  assert.equal(result.state.attempts, 1);
  assert.deepEqual(result.state.secret, red);
});
test('R6 — La victoire au dixième essai prime sur la défaite', () => {
  const game = redGame();
  for (let i = 0; i < 9; i++) assert.equal(game.submit(blue).state.status, 'playing');
  const result = game.submit(red);
  assert.equal(result.state.status, 'won');
  assert.equal(result.state.attempts, 10);
  assert.equal(result.state.remaining, 0);
});
test('R6 — Dix propositions sans victoire donnent une défaite', () => {
  const game = redGame();
  for (let i = 0; i < 10; i++) game.submit(blue);
  assert.equal(game.getState().status, 'lost');
  assert.equal(game.getState().attempts, 10);
  assert.deepEqual(game.getState().secret, red);
});
test('R7 — Une proposition après victoire ne change plus la partie', () => {
  const game = redGame();
  game.submit(red);
  const before = game.getState();
  assert.equal(game.submit(blue).ok, false);
  assert.deepEqual(game.getState(), before);
});
test('R7 — Une proposition après défaite ne change plus la partie', () => {
  const game = redGame();
  for (let i = 0; i < 10; i++) game.submit(blue);
  const before = game.getState();
  assert.equal(game.submit(red).ok, false);
  assert.deepEqual(game.getState(), before);
});
test('R7 — Nouvelle partie remet tout à zéro et tire quatre nouvelles couleurs', () => {
  let calls = 0;
  const game = createGame(() => calls++ < 4 ? 0 : 0.2);
  game.submit(red);
  game.newGame();
  assert.equal(calls, 8);
  assert.deepEqual(game.getState(), { status: 'playing', attempts: 0, remaining: 10, history: [], secret: null });
  assert.equal(game.submit(blue).state.status, 'won');
});
const summary = `${passed} tests réussis ; ${failed} échec(s).`;
console.log(`\n${summary}`);
lines.push('', `**Bilan : ${summary}**`, '');
if (process.argv.includes('--rapport')) {
  const target = path.join(__dirname, 'docs', 'preuves', 'tests-regles.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, lines.join('\n'), 'utf8');
}
process.exitCode = failed ? 1 : 0;
