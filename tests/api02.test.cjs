'use strict';
const test = require('node:test');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const { createGame, PALETTE } = require('../game');
const { createTestApi, isTestMode } = require('../api');
const R = 'rouge', B = 'bleu', V = 'vert', J = 'jaune', O = 'orange', VI = 'violet';
const red = [R,R,R,R], blue = [B,B,B,B], duplicated = [R,R,B,V];
const blank = (status='not-started') => ({status,attempts:0,history:[],lastGuess:null,lastResult:null,lastError:null});
function fixture(random = () => 0) {
  const game = createGame(random, {autoStart:false});
  return {game, api:createTestApi(game)};
}
function withoutError(state) { const copy={...state}; delete copy.lastError; return copy; }
function noSecret(value) {
  if (!value || typeof value !== 'object') return;
  assert.equal(Object.hasOwn(value,'secret'),false);
  assert.equal(Object.hasOwn(value,'solution'),false);
  Object.values(value).forEach(noSecret);
}

test('Activation : test=1 seul, aussi avec les autres paramètres', () => {
  for(const search of ['?test=1','?lang=fr&test=1','?test=1&lang=fr']) assert.equal(isTestMode(search),true);
  for(const search of ['', '?test=0','?test=true','?other=test=1','?test=01']) assert.equal(isTestMode(search),false);
});
test('Configuration exacte, synchrone et indépendante', () => {
  const {api}=fixture();
  assert.equal(api.version,'0.2');
  const expected={apiVersion:'0.2',rulesVersion:'code-couleurs-1.0',secretLength:4,maxAttempts:10,allowDuplicates:true,colors:[R,B,V,J,O,VI]};
  assert.deepEqual(api.getConfig(),expected);
  const copy=api.getConfig(); copy.colors[0]='rose'; copy.maxAttempts=1;
  assert.deepEqual(api.getConfig(),expected);
  assert.equal(api.getConfig() instanceof Promise,false);
});
test('Chargement not-started : aucun tirage avant startGame', () => {
  let draws=0;const {api}=fixture(()=>{draws++;return 0;});
  assert.deepEqual(api.getState(),blank());assert.equal(draws,0);
  assert.equal(api.getState() instanceof Promise,false);noSecret(api.getState());
});
test('Avant démarrage, game-not-started prime sur le type invalide', async () => {
  const {api}=fixture();const state=await api.submitGuess(null);
  assert.deepEqual(withoutError(state),withoutError(blank()));
  assert.equal(state.lastError.code,'game-not-started');assert.ok(state.lastError.message);
});
test('startGame et submitGuess retournent des promesses et attendent les actions', async () => {
  const {game}=fixture();let renders=0;
  const api=createTestApi(game,{startGame:async o=>{game.startGame(o);await Promise.resolve();renders++;},submitGuess:async g=>{game.submit(g);await Promise.resolve();renders++;}});
  const start=api.startGame({secret:red});assert.ok(start instanceof Promise);
  await start;assert.equal(renders,1);
  const submit=api.submitGuess(blue);assert.ok(submit instanceof Promise);
  assert.equal((await submit).attempts,1);assert.equal(renders,2);
});
test('Démarrages omis, undefined et {} : nouveau tirage de quatre couleurs', async () => {
  for(const kind of ['omitted','undefined','empty']){
    let draws=0;const {api}=fixture(()=>{draws++;return 0.999;});
    const state=kind==='omitted'?await api.startGame():await api.startGame(kind==='empty'?{}:undefined);
    assert.deepEqual(state,blank('playing'));assert.equal(draws,4);
    assert.equal((await api.submitGuess([VI,VI,VI,VI])).status,'won');
  }
});
test('Les six couleurs et quatre répétitions peuvent être tirées', async () => {
  for(let index=0;index<PALETTE.length;index++){
    const {api}=fixture(()=>(index+0.5)/PALETTE.length);await api.startGame();
    assert.equal((await api.submitGuess(Array(4).fill(PALETTE[index]))).status,'won');
  }
});
test('options : formes et clés inconnues refusées avant le secret, sans mutation', async () => {
  const {api}=fixture();await api.startGame({secret:red});await api.submitGuess([R]);
  const before=api.getState();
  const exotic=Object.create({secret:red});
  for(const options of [null,[],false,1,'secret',()=>{},new Date(),new (class Options {})(),exotic,{other:1},{secret:null,other:true},{[Symbol('key')]:1}]){
    await assert.rejects(api.startGame(options),e=>e instanceof Error&&e.code==='invalid-options'&&e.message.length>0);
    assert.deepEqual(api.getState(),before);
  }
});
test('Secret présent : undefined et null ne signifient pas tirage aléatoire', async () => {
  const {api}=fixture();
  for(const secret of [undefined,null]) {
    await assert.rejects(api.startGame({secret}),{code:'invalid-type'});
    assert.deepEqual(api.getState(),blank());
  }
});
test('Secret invalide : priorité type, longueur, couleur ; état et lastError intacts', async () => {
  const {api}=fixture();await api.startGame({secret:red});await api.submitGuess([R]);
  const before=api.getState();
  const cases=[[null,'invalid-type'],[[R,null],'invalid-type'],[new Array(4),'invalid-type'],[[],'invalid-length'],[[R],'invalid-length'],[['rose'],'invalid-length'],[[R,R,R,'Violet'],'invalid-color'],[[R,R,R,'violet '],'invalid-color']];
  for(const [secret,code] of cases){
    await assert.rejects(api.startGame({secret}),{code});
    assert.deepEqual(api.getState(),before);
  }
});
const examples=[
  ['T01',[R,B,V,J],[R,V,B,O],1,2],
  ['T02',[R,B,V,J],[O,VI,R,B],0,2],
  ['T03',[R,B,V,J],[B,R,J,V],0,4],
  ['T04',[R,B,V,J],[R,B,J,V],2,2],
  ['T05',[R,B,V,J],[R,B,V,J],4,0],
  ['T06',duplicated,[R,R,R,R],2,0],
  ['T07',duplicated,[R,B,R,V],2,2],
  ['T08',duplicated,[R,R,B,V],4,0],
  ['T09',duplicated,[R,B,R,R],1,2]
];
for(const [id,secret,guess,wellPlaced,misplaced] of examples){
  test(id+' du contrat : indices et état exacts',async()=>{
    const {api}=fixture();await api.startGame({secret});
    const result={wellPlaced,misplaced};
    const state=await api.submitGuess(guess);
    assert.deepEqual(state,{status:wellPlaced===4?'won':'playing',attempts:1,history:[{guess,result}],lastGuess:guess,lastResult:result,lastError:null});
    noSecret(state);assert.doesNotThrow(()=>JSON.stringify(state));
  });
}
test('Proposition invalide : types et trous avant la longueur, puis les couleurs', async () => {
  const {api}=fixture();await api.startGame({secret:red});await api.submitGuess(blue);
  const before=withoutError(api.getState());
  const sparse=[R,R,R,R];delete sparse[2];
  const inherited=Array(4);Object.setPrototypeOf(inherited,Object.assign(Object.create(Array.prototype),{0:R,1:R,2:R,3:R}));
  for(const [guess,code] of [
    [null,'invalid-type'],['rouge','invalid-type'],[new Uint8Array(4),'invalid-type'],[[R,null],'invalid-type'],[[R,1],'invalid-type'],[sparse,'invalid-type'],[inherited,'invalid-type'],
    [[],'invalid-length'],[[R],'invalid-length'],[[R,R,R],'invalid-length'],[[R,R,R,R,R],'invalid-length'],[['rose'],'invalid-length'],
    [[R,R,R,'Violet'],'invalid-color'],[[R,R,R,'violet '],'invalid-color'],[[R,R,R,'purple'],'invalid-color'],[[R,R,R,''],'invalid-color']
  ]){
    const state=await api.submitGuess(guess);
    assert.equal(state.lastError.code,code);assert.ok(state.lastError.message.length>0);
    assert.deepEqual(withoutError(state),before);
  }
});
test('Un refus est remplacé par le dernier refus, puis effacé par une proposition valide',async()=>{
  const {api}=fixture();await api.startGame({secret:red});
  assert.equal((await api.submitGuess([R])).lastError.code,'invalid-length');
  assert.equal((await api.submitGuess(null)).lastError.code,'invalid-type');
  const state=await api.submitGuess(blue);assert.equal(state.lastError,null);assert.equal(state.attempts,1);
});
test('Une victoire au dixième essai est prioritaire sur la défaite',async()=>{
  const {api}=fixture();await api.startGame({secret:red});
  for(let i=0;i<9;i++)assert.equal((await api.submitGuess(blue)).status,'playing');
  const state=await api.submitGuess(red);
  assert.equal(state.status,'won');assert.equal(state.attempts,10);assert.equal(state.history.length,10);noSecret(state);
});
test('Refus à neuf essais, puis victoire au dixième',async()=>{
  const {api}=fixture();await api.startGame({secret:red});
  for(let i=0;i<9;i++)await api.submitGuess(blue);
  const refusal=await api.submitGuess([R]);
  assert.equal(refusal.lastError.code,'invalid-length');assert.equal(refusal.attempts,9);
  assert.equal((await api.submitGuess(red)).status,'won');
});
test('Dix propositions fausses : lost, puis game-finished avant le type',async()=>{
  const {api}=fixture();await api.startGame({secret:red});
  for(let i=0;i<10;i++)await api.submitGuess(blue);
  const before=api.getState();assert.equal(before.status,'lost');
  assert.deepEqual(before.lastResult,{wellPlaced:0,misplaced:0});
  const after=await api.submitGuess(null);
  assert.equal(after.lastError.code,'game-finished');assert.deepEqual(withoutError(after),withoutError(before));noSecret(after);
});
test('Après victoire, seul lastError peut changer',async()=>{
  const {api}=fixture();await api.startGame({secret:red});await api.submitGuess(red);
  const before=api.getState();const after=await api.submitGuess(null);
  assert.equal(after.lastError.code,'game-finished');assert.deepEqual(withoutError(after),withoutError(before));
});
test('Redémarrer depuis playing, won ou lost remet tous les champs à zéro',async()=>{
  const {api}=fixture();
  for(const end of ['playing','won','lost']){
    await api.startGame({secret:red});
    if(end==='won')await api.submitGuess(red);
    else for(let i=0;i<(end==='lost'?10:1);i++)await api.submitGuess(blue);
    await api.submitGuess(null);
    assert.deepEqual(await api.startGame({secret:blue}),blank('playing'));
  }
});
test('Les tableaux fournis sont copiés dès leur soumission',async()=>{
  const {api}=fixture();const secret=red.slice();const pendingStart=api.startGame({secret});secret[0]=B;await pendingStart;
  const guess=red.slice();const pendingGuess=api.submitGuess(guess);guess[0]=B;
  const state=await pendingGuess;
  assert.equal(state.status,'won');assert.deepEqual(state.lastGuess,red);
});
test('Toutes les copies retournées sont indépendantes de l’état interne',async()=>{
  const {api}=fixture();await api.startGame({secret:red});
  const response=await api.submitGuess(blue);const before=api.getState();
  response.history[0].guess[0]=R;response.history[0].result.wellPlaced=4;
  response.lastGuess[0]=R;response.lastResult.misplaced=4;response.history.push({});
  assert.deepEqual(api.getState(),before);
  const rejected=await api.submitGuess(null);rejected.lastError.code='changed';rejected.lastError.message='changed';
  assert.equal(api.getState().lastError.code,'invalid-type');
});
test('Les getters ne changent ni la partie, ni lastError, ni les actions de rendu',async()=>{
  const {game}=fixture();let renders=0;
  const api=createTestApi(game,{startGame:o=>{game.startGame(o);renders++;},submitGuess:g=>{game.submit(g);renders++;}});
  await api.startGame({secret:red});await api.submitGuess(null);
  const before=api.getState();const count=renders;
  for(let i=0;i<4;i++){api.getState();api.getConfig();}
  assert.deepEqual(api.getState(),before);assert.equal(renders,count);
});
test('Le moteur de l’interface et l’API lisent et modifient la même partie',async()=>{
  const {game,api}=fixture();
  await api.startGame({secret:duplicated});await api.submitGuess([R,B,R,V]);
  assert.equal(game.getState().attempts,1);assert.equal(game.getState().history[0].exact,2);
  game.submit([R,R,R,R]);
  assert.equal(api.getState().attempts,2);assert.deepEqual(api.getState().history[1].result,{wellPlaced:2,misplaced:0});
  game.newGame();assert.deepEqual(api.getState(),blank('playing'));
});

test('Options ordinaires d’un autre contexte et sans prototype acceptées',async()=>{
  const {api}=fixture();
  const foreign=vm.runInNewContext('({secret:["rouge","rouge","bleu","vert"]})');
  await api.startGame(foreign);
  assert.equal((await api.submitGuess([R,R,B,V])).status,'won');
  const dictionary=Object.create(null);dictionary.secret=red;
  await api.startGame(dictionary);assert.equal((await api.submitGuess(red)).status,'won');
});
