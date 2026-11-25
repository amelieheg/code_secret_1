'use strict';
// Les attendus sont enregistrés dans le JSON avant les essais.
// Aucun changement du jeu : on utilise sa fonction de tirage contrôlable déjà existante.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { createGame, PALETTE } = require('../game');
const scenarios = require('./scenarios-atelier5.json');
const root = path.resolve(__dirname, '..');
const started = new Date().toISOString();
function git(...args) {
  try { return cp.execFileSync('git', args, {cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim(); }
  catch { return null; }
}
const version = git('rev-parse','HEAD');
const tag = git('rev-parse','jalon-1^{}');
let identical = null;
try {
  const archived = cp.execFileSync('git',['show','jalon-1:game.js'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});
  identical = archived.replace(/\r\n/g,'\n') === fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\r\n/g,'\n');
} catch {}
const results = [];
for (const scenario of scenarios) {
  let draw = 0;
  // Chaque couleur du secret est obtenue dans l’ordre, sans toucher au secret du site public.
  const game = createGame(() => (PALETTE.indexOf(scenario.secret[draw++ % 4]) + 0.5) / PALETTE.length);
  const before = game.getState();
  const result = game.submit(scenario.guess);
  const state = game.getState();
  const actual = {ok:result.ok,attempts:state.attempts,historyLength:state.history.length};
  if (result.ok) { actual.exact = result.exact; actual.misplaced = result.misplaced; }
  else actual.explanation = result.error;
  let status = 'réussi';
  let failure = '';
  try {
    for (const [field,value] of Object.entries(scenario.expected)) assert.deepEqual(actual[field],value,scenario.id+': '+field);
    assert.equal(state.remaining,10 - scenario.expected.attempts);
    if (!result.ok) {
      assert.ok(typeof result.error === 'string' && result.error.length > 0);
      assert.deepEqual(state,before,'Le refus doit conserver tout l’état.');
    } else {
      assert.deepEqual(state.history[0],{guess:scenario.guess,exact:scenario.expected.exact,misplaced:scenario.expected.misplaced});
    }
  } catch(error) { status='échoué'; failure=error.message; process.exitCode=1; }
  results.push({...scenario,actual,status,failure});
  console.log(JSON.stringify({scenario:scenario.id,expected:scenario.expected,observed:actual,status}));
}
const count=results.filter(row=>row.status==='réussi').length;
console.log(count+' / '+scenarios.length+' scénarios S5 réussis. Version '+version+'. Moteur identique au tag jalon-1 : '+identical+'.');
if(process.argv.includes('--rapport')){
  const report=[
    '# Scénarios exécutés après lecture du support S5','',
    'Date et heure UTC : '+started,
    'Environnement : Node.js '+process.version+', '+process.platform+'.',
    'Commande : node tests/atelier5.test.cjs --rapport',
    'Commit du dossier au lancement : '+version+'.',
    'Version figée de remise : jalon-1, commit '+tag+'.',
    'Comparaison réelle de game.js avec le tag : '+(identical===true?'contenu identique après normalisation des retours de ligne':String(identical))+'.',
    'Ce rapport décrit le moteur local au moment de l’exécution. La comparaison au tag J1 est indiquée ci-dessus ; si elle diffère, ce rapport ne prétend pas tester le même code que J1.',
    'Empreinte Git du fichier des attendus : '+git('hash-object','tests/scenarios-atelier5.json')+'.','',
    'Les attendus ont été écrits dans le README et dans tests/scenarios-atelier5.json avant cette exécution. Ils proviennent du raisonnement sur les règles, pas du résultat du jeu.',
    'Le tirage est contrôlé seulement dans les instances locales de test. Ce n’est pas une implémentation de l’API commune 0.2.',''
  ];
  for(const row of results){
    report.push('## '+row.type,'',
      '- Départ : nouvelle partie, secret '+row.secret.join(', ')+', zéro essai, historique vide.',
      '- Action : proposer '+row.guess.join(', ')+'.',
      '- Attendu : '+JSON.stringify(row.expected)+'.',
      '- Obtenu : '+JSON.stringify(row.actual)+'.',
      '- Statut : '+row.status+'.');
    if(row.failure) report.push('- Échec détaillé : '+row.failure);
    report.push('');
  }
  report.push('## Bilan','',count+' / '+scenarios.length+' scénarios réussis.','',
    'Ces contrôles automatisés vérifient les règles et les modifications de l’état. Ils ne prouvent pas à eux seuls le fonctionnement des boutons, le parcours clavier ou un essai humain avec un binôme.',
    'Le test croisé avec un binôme n’a pas été réalisé, selon la réponse de l’étudiante du 18 novembre 2026.','');
  fs.writeFileSync(path.join(root,'docs/preuves/atelier5-18-novembre.md'),report.join('\n'));
}
