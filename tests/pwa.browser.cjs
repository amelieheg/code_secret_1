'use strict';
// Essai navigateur isolé : aucun logiciel installé sur l’appareil de l’étudiante.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=path.resolve(__dirname,'..');
const reportPath=path.resolve(root,process.env.PWA_REPORT || 'docs/preuves/pwa-27-local.json');
const assets=['index.html','style.css','game.js','api.js','app.js','pwa.js','sw.js','manifest.webmanifest','assets/icon-192.png','assets/icon-512.png','assets/icon-maskable-512.png','assets/apple-touch-icon.png','assets/qr-code-secret.png'];
const results=[],errors=[];
let server,browser,context,base,profile;
async function check(name,expected,action){
  try{const observed=await action();results.push({name,expected,observed,status:'réussi'});console.log('OK — '+name);}
  catch(e){results.push({name,expected,observed:e.message,status:'échoué'});throw e;}
}
async function localServer(){
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.png':'image/png'};
  server=http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    const file=url.pathname.replace(/^\/code_secret_1\//,'') || 'index.html';
    if(!url.pathname.startsWith('/code_secret_1/')||!assets.includes(file)){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[path.extname(file)],'Cache-Control':'no-cache'});
    res.end(fs.readFileSync(path.join(root,file)));
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return 'http://127.0.0.1:'+server.address().port+'/code_secret_1/';
}
(async()=>{
  base=process.env.CODE_SECRET_BASE_URL || await localServer();
  profile=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'code-secret-pwa-'));
  context=await chromium.launchPersistentContext(profile,{channel:'msedge',headless:true,ignoreDefaultArgs:['--hide-scrollbars'],viewport:{width:1280,height:1000}});
  browser=context.browser();
  await context.route('https://fonts.googleapis.com/**',route=>route.abort());
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base,{waitUntil:'load'});
  await check('Manifeste et icônes du jeu normal','Code secret, démarrage sans test=1 dans le bon dossier, 192/512 PNG et icône maskable.',async()=>{
    const manifest=await page.evaluate(async()=>await (await fetch(document.querySelector('link[rel=manifest]').href)).json());
    assert.equal(manifest.name,'Code secret');assert.equal(manifest.short_name,'Code secret');assert.equal(manifest.display,'standalone');
    assert.equal(new URL(manifest.start_url,base).href,base);assert.equal(new URL(manifest.scope,base).href,base);
    assert.equal(new URL(manifest.id,base).href,base);
    for(const [size,purpose]of [['192x192','any'],['512x512','any'],['512x512','maskable']]){
      const icon=manifest.icons.find(i=>i.sizes===size&&i.purpose===purpose);assert.ok(icon);
      const dim=await page.evaluate(async src=>{const img=new Image();img.src=src;await img.decode();return [img.naturalWidth,img.naturalHeight];},new URL(icon.src,base).href);
      assert.deepEqual(dim,size.split('x').map(Number));
    }
    return manifest;
  });
  await check('Service worker actif et limité au jeu','Scope /code_secret_1/, page contrôlée et tous les fichiers en cache.',async()=>{
    const observed=await page.evaluate(async()=>{
      const registration=await navigator.serviceWorker.ready;
      if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
      const cacheNames=(await caches.keys()).filter(n=>n.startsWith('code-secret:'+registration.scope+':'));
      const cache=await caches.open(cacheNames[0]);
      return {scope:registration.scope,state:registration.active.state,controller:!!navigator.serviceWorker.controller,files:(await cache.keys()).map(r=>new URL(r.url).pathname)};
    });
    assert.equal(observed.scope,base);assert.equal(observed.state,'activated');assert.equal(observed.controller,true);
    for(const file of assets.filter(f=>f!=='sw.js'))assert.ok(observed.files.includes(new URL(file,base).pathname),file+' en cache');
    return observed;
  });
  await check('Contrôle d’installabilité du navigateur','Manifeste reconnu et aucune erreur d’installabilité signalée par Edge.',async()=>{
    const session=await context.newCDPSession(page);
    const manifest=await session.send('Page.getAppManifest');
    const installability=await session.send('Page.getInstallabilityErrors');
    assert.deepEqual(manifest.errors,[]);assert.deepEqual(installability.installabilityErrors,[]);
    await session.detach();return {manifestUrl:manifest.url,errors:manifest.errors,...installability};
  });
  await check('Jeu normal après préparation PWA','API absente, trois couleurs refusées sans essai, quatre acceptées.',async()=>{
    assert.equal(await page.evaluate(()=>typeof window.codeSecretTest),'undefined');
    for(const color of ['rouge','bleu','vert'])await page.getByRole('button',{name:'Choisir '+color,exact:true}).click();
    await page.locator('#submit').click();assert.equal(await page.locator('#rows .feedback').count(),0);
    assert.match(await page.locator('#message').textContent(),/incomplète/);
    await page.getByRole('button',{name:'Choisir jaune',exact:true}).click();await page.locator('#submit').click();
    assert.equal(await page.locator('#rows .feedback').count(),1);
    return {api:'absente',historyLength:1};
  });
  await check('Aide d’installation et QR sur petit écran','Guide dépliable, QR chargé, lien public normal et aucun débordement à 360 px.',async()=>{
    await page.setViewportSize({width:360,height:800});
    await page.locator('#installation summary').click();
    await page.locator('#installation img').scrollIntoViewIfNeeded();
    const observed=await page.evaluate(()=>({
      width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
      qrWidth:document.querySelector('#installation img').naturalWidth,
      link:document.querySelector('#installation figure a').href,
      help:document.querySelector('#installation').textContent
    }));
    assert.ok(observed.scrollWidth<=observed.width);assert.ok(observed.qrWidth>0);
    assert.equal(observed.link,'https://amelieheg.github.io/code_secret_1/');
    assert.match(observed.help,/Android/);assert.match(observed.help,/Ordinateur/);
    await page.screenshot({path:reportPath.replace(/\.json$/,'-mobile.png')});
    return observed;
  });
  await check('Ouverture normale hors connexion','Nouvelle partie jouable depuis les fichiers en cache ; API absente.',async()=>{
    await context.setOffline(true);
    await page.reload({waitUntil:'load'});
    assert.equal(await page.evaluate(()=>typeof window.codeSecretTest),'undefined');
    assert.equal(await page.locator('#rows .feedback').count(),0);
    for(const color of ['rouge','bleu','vert','jaune'])await page.getByRole('button',{name:'Choisir '+color,exact:true}).click();
    await page.locator('#submit').click();assert.equal(await page.locator('#rows .feedback').count(),1);
    return {offline:true,historyLength:1,api:'absente'};
  });
  await check('API et interface hors connexion','?test=1 conservé, état initial not-started ; coup API 2/2 visible et coup par clics dans le même historique.',async()=>{
    await page.goto(base+'?test=1',{waitUntil:'load'});
    assert.equal(await page.evaluate(()=>window.codeSecretTest.version),'0.2');
    assert.equal(await page.evaluate(()=>window.codeSecretTest.getState().status),'not-started');
    const state=await page.evaluate(async()=>{
      const api=window.codeSecretTest;await api.startGame({secret:['rouge','rouge','bleu','vert']});
      return await api.submitGuess(['rouge','bleu','rouge','vert']);
    });
    assert.deepEqual(state.lastResult,{wellPlaced:2,misplaced:2});
    assert.equal(await page.locator('#rows .feedback').count(),1);
    for(let i=0;i<4;i++)await page.getByRole('button',{name:'Choisir rouge',exact:true}).click();
    await page.locator('#submit').click();
    const observed=await page.evaluate(()=>({state:window.codeSecretTest.getState(),rows:document.querySelectorAll('#rows .feedback').length}));
    assert.equal(observed.state.attempts,2);assert.equal(observed.rows,2);
    assert.deepEqual(observed.state.lastResult,{wellPlaced:2,misplaced:0});
    return observed;
  });
  await check('Retour en ligne et API préservée','Même état initial et même calcul après navigation en ligne.',async()=>{
    await context.setOffline(false);await page.goto(base+'?test=1',{waitUntil:'load'});
    const observed=await page.evaluate(async()=>{const api=window.codeSecretTest;const initial=api.getState();await api.startGame({secret:['rouge','rouge','bleu','vert']});const state=await api.submitGuess(['rouge','bleu','rouge','vert']);return {initial,state};});
    assert.equal(observed.initial.status,'not-started');assert.deepEqual(observed.state.lastResult,{wellPlaced:2,misplaced:2});
    return observed;
  });
  await check('Erreurs JavaScript','Aucune erreur pageerror.',async()=>{assert.deepEqual(errors,[]);return errors;});
})().catch(e=>{console.error(e.stack);process.exitCode=1;}).finally(async()=>{
  const report={testedAt:new Date().toISOString(),baseUrl:base,sourceRevision:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceSha256:Object.fromEntries(assets.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,f))).digest('hex')])),browser:browser?browser.version():null,node:process.version,results,errors,limits:['Contrôle automatisé isolé, sans installation réelle sur le téléphone ou l’ordinateur de l’étudiante.','L’absence d’erreur d’installabilité ne prouve pas le succès d’une installation utilisateur.']};
  fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
  if(context)await context.close();if(server)await new Promise(resolve=>server.close(resolve));
  // Nettoyer uniquement le profil temporaire créé par ce test.
  if(profile && path.dirname(profile)===path.resolve(require('node:os').tmpdir()) && path.basename(profile).startsWith('code-secret-pwa-'))fs.rmSync(profile,{recursive:true,force:true,maxRetries:3});
  console.log(results.filter(r=>r.status==='réussi').length+' contrôles PWA réussis sur '+results.length);
});
