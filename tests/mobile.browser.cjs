'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root=process.cwd(),folder=path.join(root,'docs/preuves');
let css=fs.readFileSync(path.join(root,'style.css'),'utf8'),server,browser;
const afterCss=css,beforeCss=fs.readFileSync(path.join(folder,'style-avant-mobile-27-novembre.css.txt'),'utf8');
const report={testedAt:new Date().toISOString(),sourceRevision:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),method:'Comparaison CSS avant/après, navigateur isolé sur serveur local, secret rouge rouge bleu vert fixé pour rendre les indices reproductibles. Aucun changement du moteur.',cases:[]};
(async()=>{
const allowed=new Set(['index.html','style.css','game.js','api.js','app.js']);
server=http.createServer((req,res)=>{
const name=new URL(req.url,'http://localhost').pathname.replace(/^\/code_secret_1\//,'')||'index.html';
if(!allowed.has(name)){res.writeHead(404).end();return;}
res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');
res.end(name==='style.css'?css:fs.readFileSync(path.join(root,name)));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
browser=await chromium.launch({channel:'msedge',headless:true,ignoreDefaultArgs:['--hide-scrollbars']});
report.browser='Microsoft Edge '+browser.version();
for(const phase of ['avant','apres'])for(const dimensions of [{width:390,height:844},{width:360,height:800}]){
css=phase==='avant'?beforeCss:afterCss;
const context=await browser.newContext({viewport:dimensions});
await context.route('https://fonts.googleapis.com/**',route=>route.abort());
const page=await context.newPage();
await page.goto('http://127.0.0.1:'+server.address().port+'/code_secret_1/?test=1');
await page.evaluate(async()=>await window.codeSecretTest.startGame({secret:['rouge','rouge','bleu','vert']}));
const guesses=[['rouge','bleu','vert','jaune'],['orange','violet','rouge','bleu'],['bleu','vert','jaune','orange'],['rouge','bleu','vert','jaune']];
for(const colors of guesses){
for(const color of colors)await page.getByRole('button',{name:'Choisir '+color,exact:true}).click();
await page.locator('#submit').click();
}
await page.mouse.move(100,400); await page.mouse.wheel(0,1600); await page.waitForFunction(()=>document.scrollingElement.scrollTop>0);
const observed=await page.evaluate(()=>({
clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
scrollTop:document.scrollingElement.scrollTop,pageHeight:document.documentElement.scrollHeight,
counter:document.getElementById('attempt-counter').textContent,
history:window.codeSecretTest.getState().history,
displayedRows:document.querySelectorAll('#rows .feedback').length,
buttonRight:document.getElementById('new-game').getBoundingClientRect().right,
lastResult:window.codeSecretTest.getState().lastResult
}));
assert.equal(observed.history.length,4);assert.equal(observed.displayedRows,4);
assert.deepEqual(observed.history[0].result,observed.history[3].result);
assert.equal(observed.counter,'ESSAI 05 / 10');assert.ok(observed.scrollTop>0);
if(phase==='apres'){
assert.ok(observed.scrollWidth<=observed.clientWidth,'Débordement après correction à '+dimensions.width);
assert.ok(observed.buttonRight<=observed.clientWidth+0.5,'Nouvelle partie déborde encore');
}
const imageName='mobile-27-'+phase+'-'+dimensions.width+'.png';
await page.screenshot({path:path.join(folder,imageName),fullPage:false});
report.cases.push({phase,viewport:dimensions,expected:{historyLength:4,counter:'ESSAI 05 / 10',sameIndicesForRepeatedGuess:true,noHorizontalOverflow:true},observed,noHorizontalOverflow:observed.scrollWidth<=observed.clientWidth,image:imageName});
console.log(phase+' '+dimensions.width+'x'+dimensions.height+': contenu '+observed.clientWidth+', largeur totale '+observed.scrollWidth+', 4 coups et défilement conservés');
await context.close();
}
})().catch(e=>{console.error(e.stack);process.exitCode=1;}).finally(async()=>{
fs.writeFileSync(path.join(folder,'mobile-27-comparaison-css.json'),JSON.stringify(report,null,2)+'\n');
if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
});

