import type { ExperimentDef } from "./config";

// Escapes a value for safe embedding inside an inline <script>: stops a literal
// "</script>" in the data from closing the tag early, and escapes the U+2028 /
// U+2029 line separators that break JS string parsing. Same hardening Next.js
// applies to its own inlined data.
function serialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// Generates the self-contained inline <head> script that assigns experiment
// variants in the browser before first paint. It has NO imports and must stay
// dependency-free (it runs before the app bundle). It:
//   1. ensures a click_id (mirrors lib/analytics/click-id.ts: 32 lowercase hex),
//   2. deterministically buckets each ACTIVE experiment from hash(click_id+key),
//   3. honours a `?exp_<key>=<variant>` QA override (works even when inactive),
//   4. respects per-experiment locale targeting,
//   5. stamps <html data-exp-<key>="<variant>"> and caches localStorage "s1_exp".
//
// The React layer (lib/experiment/assign.ts) only READS what this writes, so the
// bucketing logic lives in exactly one place.
export function experimentBootScript(
  experiments: readonly ExperimentDef[],
  routeLocales: readonly string[],
): string {
  // Only ship the fields the client needs (descriptions stay server-side).
  const payload = experiments.map((e) => ({
    key: e.key,
    active: e.active,
    variants: e.variants,
    weights: e.weights ?? null,
    locales: e.locales ?? null,
    seed: e.seed ?? null,
  }));
  const data = serialize(payload);
  const rl = serialize(routeLocales);
  // When every experiment is off, the script is a true no-op (no click_id,
  // no localStorage writes) unless a `?exp_` QA override is present.
  const guard = experiments.some((e) => e.active)
    ? ""
    : `if(location.search.indexOf('exp_')<0)return;`;

  return (
    `(function(){try{` +
    guard +
    `var EXP=${data},RL=${rl},QS=new URLSearchParams(location.search);` +
    `var seg=location.pathname.split('/')[1]||'';var loc=RL.indexOf(seg)!==-1?seg:'en';` +
    `function cid(){try{var k='s1_click_id',v=localStorage.getItem(k);if(v)return v;` +
    `var g=(window.crypto&&crypto.randomUUID)?crypto.randomUUID().replace(/-/g,''):(Date.now().toString(16)+Math.random().toString(16).slice(2)).replace(/[^a-f0-9]/g,'').slice(0,32);` +
    `try{localStorage.setItem(k,g);}catch(e){}return g;}catch(e){return String(Math.random());}}` +
    `function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}` +
    `function pick(e,r){var w=e.weights,n=e.variants.length,t=0,i;for(i=0;i<n;i++)t+=(w&&w[i]!=null?w[i]:1);var x=r*t,c=0;for(i=0;i<n;i++){c+=(w&&w[i]!=null?w[i]:1);if(x<c)return e.variants[i];}return e.variants[n-1];}` +
    `var id=cid(),store={};try{store=JSON.parse(localStorage.getItem('s1_exp')||'{}')||{};}catch(e){store={};}` +
    `var de=document.documentElement;` +
    `for(var i=0;i<EXP.length;i++){var e=EXP[i],v,ov=QS.get('exp_'+e.key);` +
    `if(ov&&e.variants.indexOf(ov)!==-1){v=ov;}` +
    `else if(!e.active){delete store[e.key];de.removeAttribute('data-exp-'+e.key);continue;}` +
    `else if(e.locales&&e.locales.indexOf(loc)===-1){delete store[e.key];de.removeAttribute('data-exp-'+e.key);continue;}` +
    `else{v=pick(e,hash(id+':'+e.key+':'+(e.seed||'')));}` +
    `store[e.key]=v;de.setAttribute('data-exp-'+e.key,v);}` +
    `try{localStorage.setItem('s1_exp',JSON.stringify(store));}catch(e){}` +
    `}catch(e){}})();`
  );
}
