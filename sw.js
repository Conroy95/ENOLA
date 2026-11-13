/* PROJECT ENOLA service worker */
'use strict';
const VERSION = 'enola-v1.0.0';
const APP_CACHE = `${VERSION}-app`;
const TILE_CACHE = `${VERSION}-tiles`;
const APP_FILES = [
  './','./index.html','./styles.css','./app.js','./manifest.json',
  './icons/enola-192.png','./icons/enola-512.png','./icons/enola-maskable-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(APP_CACHE);
    // Cache local shell first; CDN assets are best-effort so installation can complete.
    await cache.addAll(APP_FILES.slice(0,8));
    await Promise.all(APP_FILES.slice(8).map(async url=>{
      try { const res=await fetch(url,{mode:'cors'}); if(res.ok) await cache.put(url,res); } catch(e) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('enola-') && ![APP_CACHE,TILE_CACHE].includes(k)).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.hostname.endsWith('tile.openstreetmap.org')){
    event.respondWith((async()=>{
      const cache=await caches.open(TILE_CACHE);
      const cached=await cache.match(req);
      const network=fetch(req).then(async res=>{
        if(res.ok){await cache.put(req,res.clone()); trimTiles(cache,250);}
        return res;
      }).catch(()=>null);
      return cached || await network || new Response('',{status:504,statusText:'Offline tile not cached'});
    })());
    return;
  }
  if(url.origin===self.location.origin || url.hostname==='unpkg.com'){
    event.respondWith((async()=>{
      const cache=await caches.open(APP_CACHE);
      const cached=await cache.match(req) || await cache.match(url.href);
      if(cached) return cached;
      try { const res=await fetch(req); if(res.ok) cache.put(req,res.clone()); return res; }
      catch(e){ if(req.mode==='navigate') return cache.match('./index.html'); throw e; }
    })());
  }
});
async function trimTiles(cache,max){
  const keys=await cache.keys();
  if(keys.length>max) await Promise.all(keys.slice(0,keys.length-max).map(k=>cache.delete(k)));
}