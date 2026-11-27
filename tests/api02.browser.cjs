'use strict';
// Vérification de l’application réelle dans un navigateur isolé.
// Playwright est optionnel : utiliser son module fourni par l’environnement de développement.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname,'..');
const reportPath = path.resolve(root,process.env.API_BROWSER_REPORT || 'docs/preuves/api02-navigateur-local-25-novembre.json');
const results=[], pageErrors=[];
let browser, context, server, base;
function revision(){
  try{return cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();}
  catch{return null;}
}
function fingerprints(){
  return Object.fromEntries(['game.js','api.js','app.js','index.html'].map(name=>[name,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,name))).digest('hex')]));
}
async function check(name,expected,action){
  try{const observed=await action();results.push({name,expected,observed,status:'réussi'});console.log('OK — '+name);}
  catch(error){results.push({name,expected,observed:error.message,status:'échoué'});throw error;}
}
async function makeServer(){
  const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webmanifest':'application/manifest+json'};
  const files=new Set(['index.html','game.js','api.js','app.js','style.css','pwa.js','sw.js','manifest.webmanifest','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable-512.png','assets/apple-touch-icon.png','assets/qr-code-secret.png']);
  server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    if(!url.pathname.startsWith('/code_secret_1/')){res.writeHead(404).end();return;}
    const name=url.pathname.slice('/code_secret_1/'.length)||'index.html';
    if(!files.has(name)){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(name)],'Cache-Control':'no-store'});
    res.end(fs.readFileSync(path.join(root,name)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return 'http://127.0.0.1:'+server.address().port+'/code_secret_1/';
}
function noError(state){const copy={...state};delete copy.lastError;return copy;}
async function view(page){
  return page.evaluate(()=>({
    state:window.codeSecretTest.getState(),
    counter:document.getElementById('attempt-counter').textContent,
    message:document.getElementById('message').textContent,
    submitDisabled:document.getElementById('submit').disabled,
    paletteDisabled:[...document.querySelectorAll('#palette button')].every(b=>b.disabled),
    secretText:[...document.querySelectorAll('#secret span')].map(e=>e.textContent),
    history:[...document.querySelectorAll('#rows .game-row')].filter(row=>row.querySelector('.feedback')).map(row=>({
      guess:[...row.querySelectorAll('.peg')].map(e=>e.getAttribute('aria-label')),
      result:{wellPlaced:Number(row.querySelectorAll('.feedback-item')[0].textContent.trim()),misplaced:Number(row.querySelectorAll('.feedback-item')[1].textContent.trim())}
    }))
  }));
}
function consistent(observed){
  assert.deepEqual(observed.history,observed.state.history);
  assert.equal(observed.state.attempts,observed.history.length);
  assert.equal(Object.hasOwn(observed.state,'secret'),false);
  assert.equal(Object.hasOwn(observed.state,'solution'),false);
  const canPlay=observed.state.status==='playing';
  assert.equal(observed.submitDisabled,!canPlay);
  assert.equal(observed.paletteDisabled,!canPlay);
  if(canPlay)assert.equal(observed.counter,'ESSAI '+String(observed.state.attempts+1).padStart(2,'0')+' / 10');
  if(canPlay||observed.state.status==='not-started')assert.deepEqual(observed.secretText,['?','?','?','?']);
}
(async()=>{
  base=process.env.CODE_SECRET_BASE_URL || await makeServer();
  if(!base.endsWith('/'))base+='/';
  browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true});
  context=await browser.newContext({viewport:{width:1280,height:1000}});
  await context.route('https://fonts.googleapis.com/**',route=>route.abort());
  const page=await context.newPage();
  page.on('pageerror',error=>pageErrors.push(error.message));

  await check('Sans test=1, API absente et partie jouable','Pas de codeSecretTest ; trois rouges refusés sans essai, puis quatre rouges acceptés.',async()=>{
    await page.goto(base,{waitUntil:'load'});
    assert.equal(await page.evaluate(()=>typeof window.codeSecretTest),'undefined');
    assert.equal(await page.locator('#submit').isEnabled(),true);
    for(let i=0;i<3;i++)await page.getByRole('button',{name:'Choisir rouge',exact:true}).click();
    await page.locator('#submit').click();
    assert.equal(await page.locator('#rows .feedback').count(),0);
    assert.equal(await page.locator('#attempt-counter').textContent(),'ESSAI 01 / 10');
    assert.match(await page.locator('#message').textContent(),/incomplète/);
    await page.getByRole('button',{name:'Choisir rouge',exact:true}).click();
    await page.locator('#submit').click();
    assert.equal(await page.locator('#rows .feedback').count(),1);
    return {api:'undefined',propositions:await page.locator('#rows .feedback').count()};
  });
  await check('Paramètre test=1 conservant les autres paramètres','État initial not-started, palette et validation désactivées.',async()=>{
    await page.goto(base+'?lang=fr&test=1',{waitUntil:'load'});
    await page.waitForFunction(()=>Boolean(window.codeSecretTest));
    const observed=await view(page);consistent(observed);
    assert.deepEqual(observed.state,{status:'not-started',attempts:0,history:[],lastGuess:null,lastResult:null,lastError:null});
    assert.equal(await page.evaluate(()=>window.codeSecretTest.version),'0.2');
    return observed;
  });
  await check('Refus avant démarrage','game-not-started, aucun essai ni historique.',async()=>{
    const state=await page.evaluate(async()=>await window.codeSecretTest.submitGuess(null));
    assert.equal(state.lastError.code,'game-not-started');assert.equal(state.attempts,0);
    const observed=await view(page);consistent(observed);return observed;
  });
  await check('Démarrage API sur la partie visible','playing, zéro essai, ancien refus effacé et secret caché.',async()=>{
    const observed=await page.evaluate(async()=>{
      const state=await window.codeSecretTest.startGame({secret:['rouge','rouge','bleu','vert']});
      return {state,counter:document.getElementById('attempt-counter').textContent,enabled:!document.getElementById('submit').disabled};
    });
    assert.equal(observed.state.status,'playing');assert.equal(observed.state.lastError,null);assert.equal(observed.counter,'ESSAI 01 / 10');assert.equal(observed.enabled,true);
    consistent(await view(page));return observed;
  });
  await check('Proposition API affichée immédiatement après await','R B R V affiché, 2 bien placées, 2 mal placées, un essai.',async()=>{
    const state=await page.evaluate(async()=>await window.codeSecretTest.submitGuess(['rouge','bleu','rouge','vert']));
    const observed=await view(page);consistent(observed);
    assert.deepEqual(observed.state,state);assert.deepEqual(state.lastResult,{wellPlaced:2,misplaced:2});assert.equal(state.attempts,1);
    return observed;
  });
  await check('Proposition par clics visible dans getState','Quatre rouges ajoutés au même historique : 2 / 0, deuxième essai.',async()=>{
    for(let i=0;i<4;i++)await page.getByRole('button',{name:'Choisir rouge',exact:true}).click();
    await page.locator('#submit').click();
    const observed=await view(page);consistent(observed);
    assert.equal(observed.state.attempts,2);assert.deepEqual(observed.state.lastResult,{wellPlaced:2,misplaced:0});
    assert.deepEqual(observed.state.lastGuess,['rouge','rouge','rouge','rouge']);
    fs.mkdirSync(path.dirname(reportPath),{recursive:true});
    await page.screenshot({path:reportPath.replace(/\.json$/,'.png'),fullPage:true});
    return observed;
  });
  await check('Refus API pendant playing expliqué à l’écran','invalid-length ; données conservées et message visible.',async()=>{
    const before=await page.evaluate(()=>window.codeSecretTest.getState());
    const state=await page.evaluate(async()=>await window.codeSecretTest.submitGuess(['rouge']));
    assert.deepEqual(noError(state),noError(before));assert.equal(state.lastError.code,'invalid-length');
    const observed=await view(page);consistent(observed);assert.equal(observed.message,state.lastError.message);
    return observed;
  });
  await check('Démarrage invalide intégralement sans effet','Error invalid-type ; état, lastError et HTML inchangés.',async()=>{
    const before=await page.evaluate(()=>({state:window.codeSecretTest.getState(),html:document.body.innerHTML}));
    const error=await page.evaluate(async()=>{
      try{await window.codeSecretTest.startGame({secret:['rouge',null]});return null;}
      catch(error){return {code:error.code,message:error.message,isError:error instanceof Error};}
    });
    assert.equal(error.code,'invalid-type');assert.ok(error.message);assert.equal(error.isError,true);
    const after=await page.evaluate(()=>({state:window.codeSecretTest.getState(),html:document.body.innerHTML}));
    assert.deepEqual(after,before);return error;
  });
  await check('Getters sans effets et copies indépendantes dans le navigateur','Modifier un retour ne change ni le jeu ni l’écran.',async()=>{
    const before=await page.evaluate(()=>({state:window.codeSecretTest.getState(),html:document.body.innerHTML}));
    await page.evaluate(()=>{
      const api=window.codeSecretTest;const state=api.getState();
      state.history[0].guess[0]='orange';state.lastResult.wellPlaced=4;state.lastError.message='modifié';
      api.getConfig().colors[0]='rose';api.getState();api.getConfig();
    });
    const after=await page.evaluate(()=>({state:window.codeSecretTest.getState(),html:document.body.innerHTML}));
    assert.deepEqual(after,before);return after.state;
  });
  await check('Victoire au dixième, avec refus à neuf essais','Refus sans essai, puis won à dix ; historique et écran identiques.',async()=>{
    const state=await page.evaluate(async()=>{
      const api=window.codeSecretTest;await api.startGame({secret:['rouge','rouge','rouge','rouge']});
      for(let i=0;i<9;i++)await api.submitGuess(['bleu','bleu','bleu','bleu']);
      const refusal=await api.submitGuess(['rouge']);
      if(refusal.attempts!==9||refusal.lastError.code!=='invalid-length')throw Error('Refus à neuf essais incorrect');
      return await api.submitGuess(['rouge','rouge','rouge','rouge']);
    });
    assert.equal(state.status,'won');assert.equal(state.attempts,10);
    const observed=await view(page);consistent(observed);return observed;
  });
  await check('Refus après victoire','game-finished avant invalid-type ; partie préservée.',async()=>{
    const before=await page.evaluate(()=>window.codeSecretTest.getState());
    const state=await page.evaluate(async()=>await window.codeSecretTest.submitGuess(null));
    assert.equal(state.lastError.code,'game-finished');assert.deepEqual(noError(state),noError(before));
    consistent(await view(page));return state;
  });
  await check('Défaite au dixième et refus après défaite','lost à dix essais, puis game-finished sans ajout d’historique.',async()=>{
    const state=await page.evaluate(async()=>{
      const api=window.codeSecretTest;await api.startGame({secret:['rouge','rouge','rouge','rouge']});
      for(let i=0;i<10;i++)await api.submitGuess(['bleu','bleu','bleu','bleu']);
      return await api.submitGuess(['rouge','rouge','rouge','rouge']);
    });
    assert.equal(state.status,'lost');assert.equal(state.attempts,10);assert.equal(state.lastError.code,'game-finished');
    const observed=await view(page);consistent(observed);return observed;
  });
  await check('Bouton Nouvelle partie après une fin','API et écran repartent sur playing, zéro essai, lastError null.',async()=>{
    await page.locator('#new-game').click();
    const observed=await view(page);consistent(observed);
    assert.deepEqual(observed.state,{status:'playing',attempts:0,history:[],lastGuess:null,lastResult:null,lastError:null});
    return observed;
  });
  await check('Rechargement en mode test','Aucun secret imposé conservé ; retour not-started.',async()=>{
    await page.evaluate(async()=>await window.codeSecretTest.startGame({secret:['violet','violet','violet','violet']}));
    await page.reload({waitUntil:'load'});await page.waitForFunction(()=>Boolean(window.codeSecretTest));
    const observed=await view(page);consistent(observed);assert.equal(observed.state.status,'not-started');return observed;
  });
  await check('Affichage à 390 pixels et API identique','1 / 2 pour T09, historique cohérent et pas de débordement horizontal.',async()=>{
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(async()=>{await window.codeSecretTest.startGame({secret:['rouge','rouge','bleu','vert']});await window.codeSecretTest.submitGuess(['rouge','bleu','rouge','rouge']);});
    const observed=await view(page);consistent(observed);assert.deepEqual(observed.state.lastResult,{wellPlaced:1,misplaced:2});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
    await page.screenshot({path:reportPath.replace(/\.json$/,'-mobile.png'),fullPage:true});
    return observed;
  });
  await check('test=0 ne laisse aucune API exposée','API absente dans un nouveau document sans activation.',async()=>{
    await page.goto(base+'?test=0',{waitUntil:'load'});
    const actual=await page.evaluate(()=>typeof window.codeSecretTest);assert.equal(actual,'undefined');return actual;
  });
  await check('Erreurs JavaScript de la page','Aucune erreur pageerror.',async()=>{assert.deepEqual(pageErrors,[]);return pageErrors;});
})().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{
  const report={testedAt:new Date().toISOString(),baseUrl:base,sourceRevision:revision(),sourceSha256:fingerprints(),browser:browser?browser.version():null,node:process.version,results,pageErrors,limits:['Navigateur automatisé isolé ; ne remplace pas un smartphone réel, un lecteur d’écran ou un binôme humain.','Polices Google bloquées pour garder des essais reproductibles.']};
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
  if(context)await context.close();if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
  console.log(results.filter(r=>r.status==='réussi').length+' contrôles navigateur réussis sur '+results.length+'. Rapport : '+path.relative(root,reportPath));
});
