import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { locationFromRequest } from './atlas-worker.js';
import { createLocalDB, schema } from './local-db.mjs';
const origin = 'http://127.0.0.1:8765';
const geo = {latitude:'34.7567',longitude:'113.6543',city:'Zhengzhou',region:'Henan',country:'CN'};
function setup() {
  const DB = createLocalDB();
  const env = {DB, ALLOWED_ORIGINS:origin+',https://tengqi159.github.io', RECORDING:'on'};
  const call = async (method, path, body, cf=geo, headers={}) => {
    const request = new Request('https://atlas.test'+path,{method,headers:{origin,'user-agent':'Mozilla/5.0',...headers},...(body===undefined?{}:{body:typeof body==='string'?body:JSON.stringify(body)})});
    Object.defineProperty(request,'cf',{value:cf});
    const response = await worker.fetch(request,env);
    return {status:response.status,headers:response.headers,data:response.status===204?null:await response.json()};
  };
  return {DB,env,call,visit:(token='browser_token_0001',cf=geo)=>call('POST','/visits',{token},cf)};
}
test('coarse coordinates and region fallback; absent/invalid coordinates never become zero', () => {
  const p=locationFromRequest({cf:geo});
  assert.equal(p.latitude,34.8); assert.equal(p.longitude,113.7); assert.equal(p.placeKey,'cn|henan|zhengzhou');
  assert.equal(locationFromRequest({cf:{...geo,city:''}}).level,'region');
  for(const value of [null,undefined,'','no',999]) assert.equal(locationFromRequest({cf:{...geo,latitude:value}}),null);
  assert.equal(locationFromRequest({cf:{...geo,city:'',region:''}}),null);
});
test('empty map, local/prod CORS, rejected origin and supported methods',async()=>{
  const {call}=setup();
  assert.deepEqual((await call('GET','/visits')).data.totals,{visitors:0,visits:0,places:0,countries:0,cities:0});
  assert.equal((await call('OPTIONS','/visits')).headers.get('access-control-allow-origin'),origin);
  assert.equal((await call('GET','/location',undefined,geo,{origin:'https://tengqi159.github.io'})).status,200);
  assert.equal((await call('GET','/visits',undefined,geo,{origin:'https://bad.test'})).status,403);
  assert.equal((await call('POST','/visits',{token:'browser_token_0001'},geo,{origin:''})).status,403);
  assert.equal((await call('DELETE','/visits')).status,405);
});
test('simultaneous refreshes count once; the time window does not slide',async()=>{
  const {visit,DB}=setup();
  const replies=await Promise.all(Array.from({length:8},()=>visit()));
  assert.ok(replies.every(r=>r.data.recorded));
  const row=DB.sqlite.prepare('SELECT * FROM atlas_visits').get(); assert.equal(row.hits,1);
  await visit();assert.equal(DB.sqlite.prepare('SELECT last_seen FROM atlas_visits').get().last_seen,row.last_seen);
  DB.sqlite.prepare('UPDATE atlas_visits SET last_seen=?').run(new Date(Date.now()-3600000).toISOString());
  await visit();assert.equal(DB.sqlite.prepare('SELECT hits FROM atlas_visits').get().hits,2);
});
test('new places preserve older points; same-named cities stay separate; browsers counted globally',async()=>{
  const {visit,call}=setup();
  const a={...geo,city:'Springfield',region:'Illinois',country:'US'};
  const b={...a,region:'Massachusetts'};
  await visit('browser_token_0001',a); await visit('browser_token_0001',b); await visit('browser_token_0002',b);
  const {data}=await call('GET','/visits');
  assert.equal(data.points.length,2); assert.deepEqual(data.totals,{visitors:2,visits:3,places:2,countries:1,cities:2});
  assert.equal(data.points[0].visits,2);
});
test('ignores client coordinates; rejects malformed or oversized payloads',async()=>{
  const {call,DB}=setup();
  await call('POST','/visits',{token:'browser_token_0001',lat:-90,lon:180,city:'Fake'});
  const row=DB.sqlite.prepare('SELECT * FROM atlas_visits').get();assert.equal(row.city,'Zhengzhou');assert.equal(row.lat,34.8);
  for(const body of ['{bad','null','{}',JSON.stringify({token:1234567890123456})]) assert.equal((await call('POST','/visits',body)).status,400);
  assert.equal((await call('POST','/visits','x'.repeat(2049))).status,413);
});
test('missing geolocation, recording pause and recognized bots do not write',async()=>{
  const {call,visit,DB,env}=setup();
  assert.equal((await visit('browser_token_0001',{})).status,422);
  assert.equal((await call('POST','/visits',{token:'browser_token_0001'},geo,{'user-agent':'Googlebot'})).data.recorded,false);
  env.RECORDING='off';assert.equal((await visit()).status,503);
  assert.equal((await call('GET','/location')).data.recording,false);
  assert.equal(DB.sqlite.prepare('SELECT COUNT(*) n FROM atlas_visits').get().n,0);
});
test('legacy migration is repeatable, preserves hits and leaves original rows intact',()=>{
  const {DB}=setup();
  DB.sqlite.prepare('INSERT INTO visits VALUES(?,?,?,?,?,?,?,?,?,?)').run('legacy_token_0001',1.291,103.852,'Singapore','','Singapore','SG',4,'2026-09-01T00:00:00.000Z','2026-09-02T00:00:00.000Z');
  DB.sqlite.exec(schema); DB.sqlite.exec(schema);
  const rows=DB.sqlite.prepare('SELECT * FROM atlas_visits').all();assert.equal(rows.length,1);assert.equal(rows[0].hits,4);assert.equal(rows[0].lat,1.3);
  assert.equal(DB.sqlite.prepare('SELECT COUNT(*) n FROM visits').get().n,1);
});
