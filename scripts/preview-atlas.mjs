// Local-only preview of the actual Worker with an in-memory SQLite database.
// All coordinates/visits below are explicit sample data. No live API is contacted.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import worker from '../workers/atlas-worker.js';
import { createLocalDB } from '../workers/local-db.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)), port=8766;
const origin=`http://127.0.0.1:${port}`;
const scenarios=new Set(['demo','empty','no-location','offline','save-fails','timeout','cached']);
const stores=new Map();
const current={city:'Berlin',region:'Berlin',country:'DE',latitude:'52.52',longitude:'13.405'};
async function environment(mode) {
  if(stores.has(mode))return stores.get(mode);
  const env={DB:createLocalDB(),ALLOWED_ORIGINS:origin,RECORDING:'on'};
  stores.set(mode,env);
  if(mode==='empty')return env;
  const samples=[['Singapore','', 'SG',1.3,103.8,12],['Boston','Massachusetts','US',42.4,-71.1,7],['London','England','GB',51.5,-.1,5],['Tokyo','Tokyo','JP',35.7,139.7,4],['Sydney','New South Wales','AU',-33.9,151.2,3],['Zhengzhou','Henan','CN',34.8,113.7,3]];
  for(const [index,[city,region,country,latitude,longitude,hits]] of samples.entries()) {
    const request=new Request(origin+'/visits',{method:'POST',headers:{origin},body:JSON.stringify({token:`sample_browser_${String(index).padStart(4,'0')}`})});
    Object.defineProperty(request,'cf',{value:{city,region,country,latitude,longitude}});
    await worker.fetch(request,env);
    env.DB.sqlite.prepare('UPDATE atlas_visits SET hits=? WHERE city=?').run(hits,city);
  }
  return env;
}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.pdf':'application/pdf','.woff2':'font/woff2'};
createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,origin), parts=url.pathname.split('/');
    if(parts[1]==='__atlas' && scenarios.has(parts[2])) {
      const mode=parts[2], env=await environment(mode), route='/'+parts.slice(3).join('/');
      if(mode==='timeout') {const timer=setTimeout(()=>{if(!res.destroyed)res.end('{}');},12000);req.on('close',()=>clearTimeout(timer));return;}
      const cachedFailure=mode==='cached' && route==='/visits' && req.method==='GET' && (env.reads=(env.reads||0)+1)>2;
      if(mode==='offline' || cachedFailure || (mode==='save-fails' && req.method==='POST')) {res.writeHead(503,{'content-type':'application/json'});res.end('{"ok":false,"code":"demo_failure"}');return;}
      let body='';for await(const chunk of req)body+=chunk;
      const request=new Request(origin+route,{method:req.method,headers:{...req.headers,origin},...(['POST','PUT'].includes(req.method)?{body}: {})});
      Object.defineProperty(request,'cf',{value:mode==='no-location'||mode==='empty'?{}:current});
      const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
    }
    const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!path.startsWith(root.endsWith(sep)?root:root+sep)) {res.writeHead(403);res.end();return;}
    let data=await readFile(path);
    if(path===resolve(root,'index.html')) {
      const mode=scenarios.has(url.searchParams.get('atlas'))?url.searchParams.get('atlas'):'demo';
      data=data.toString().replace('</head>',`<script>window.QT_ATLAS_ENDPOINT=${JSON.stringify(origin+'/__atlas/'+mode)};</script></head>`)
        .replace('<div class="atlas-shell"',`<p style="padding:12px 16px;border:1px solid var(--gold);border-radius:12px;color:var(--ink);font-size:13px;line-height:1.6"><strong>本地功能演示 · 示例数据</strong> / Local demo · Sample locations and counts. Berlin is a simulated visitor; no live records are changed.</p><div class="atlas-shell"`);
    }
    res.writeHead(200,{'content-type':types[extname(path)]||'application/octet-stream','cache-control':'no-store'});res.end(data);
  }catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local atlas demo: ${origin}/?atlas=demo#atlas`));
