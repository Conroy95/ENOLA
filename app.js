/* PROJECT ENOLA — client application */
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const fmStations = [
  ['Friesland','Omrop Fryslân','Jirnsum','92.2'],['Friesland','Omrop Fryslân','Smilde','92.5'],
  ['Groningen','Radio Noord','Groningen','97.5'],
  ['Drenthe','Radio Drenthe','Smilde','90.8'],['Drenthe','Radio Drenthe','Emmen','99.3'],
  ['Overijssel','Radio Oost','Hengelo','89.4'],['Overijssel','Radio Oost','Markelo','95.6'],['Overijssel','Radio Oost','Deventer','97.9'],['Overijssel','Radio Oost','Zwollekerspel','99.4'],
  ['Gelderland','Omroep Gelderland','Arnhem','88.9'],['Gelderland','Omroep Gelderland','Ugchelen','103.5'],['Gelderland','Omroep Gelderland','Ruurlo','90.4'],['Gelderland','Omroep Gelderland','Megen','89.1'],['Gelderland','Omroep Gelderland','Zaltbommel','99.6'],
  ['Utrecht','Radio M Utrecht','Lopik','93.1'],['Utrecht','Radio M Utrecht','Rhenen','97.9'],
  ['Flevoland','Omroep Flevoland','Lelystad','89.8'],
  ['Noord-Holland','NH Radio','Amsterdam','88.9'],['Noord-Holland','NH Radio','Alkmaar','88.7'],['Noord-Holland','NH Radio','Hilversum','88.7'],['Noord-Holland','NH Radio','Wieringermeer','93.9'],
  ['Zuid-Holland','Radio West','Den Haag','89.3'],['Zuid-Holland','Radio West','Leiden','88.0'],['Zuid-Holland','Radio West','Rotterdam','89.3'],['Zuid-Holland','Radio Rijnmond','Rotterdam','93.4'],
  ['Zeeland','Omroep Zeeland','Goes','87.9'],['Zeeland','Omroep Zeeland','Vlissingen','98.4'],
  ['Noord-Brabant','Omroep Brabant','Roosendaal','91.0'],['Noord-Brabant','Omroep Brabant','Loon op Zand','91.9'],['Noord-Brabant','Omroep Brabant','Megen','95.8'],['Noord-Brabant','Omroep Brabant','Mierlo','87.6'],
  ['Limburg','L1 Radio','Roermond','100.3'],['Limburg','L1 Radio','Emmaberg','95.3']
];

const kitItems = [
  'Drinkwater: 3 liter per persoon per dag (9 liter / 72 uur)',
  'Lang houdbaar eten en eventueel blikopener',
  'Radio op batterijen / zonne-energie / dynamo + reservebatterijen',
  'Telefoon + opgeladen powerbank en laadkabel',
  'Zaklamp + extra batterijen',
  'EHBO-doos en gebruiksaanwijzing',
  'Persoonlijke medicijnen en medische hulpmiddelen',
  'Dekens en warme kleding',
  'Fluitje om hulpdiensten te waarschuwen',
  'Contant geld (kleine coupures)',
  'Hygiëne: wc-papier, natte doekjes, desinfecterende gel',
  'Kaarsen, lucifers / aansteker (veilig opgeborgen)',
  'Kopieën ID-bewijzen en belangrijke telefoonnummers',
  'Reservesleutels huis en auto',
  'Voorraad voor baby’s, kinderen en huisdieren (indien van toepassing)'
];

function renderFM() {
  const province = $('#province-filter').value;
  const rows = fmStations.filter(r => province === 'all' || r[0] === province);
  $('#fm-table').innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
}
$('#province-filter').addEventListener('change', renderFM);
renderFM();

$('#pmr-channels').innerHTML = Array.from({length:16},(_,i)=>`<span>${i+1}</span>`).join('');

const CHECK_KEY = 'enola-checklist-v1';
let checked = new Set();
try { checked = new Set(JSON.parse(localStorage.getItem(CHECK_KEY) || '[]')); } catch {}
function renderChecklist() {
  $('#checklist').innerHTML = kitItems.map((item,i)=>`<label class="check-item ${checked.has(i)?'checked':''}"><input type="checkbox" data-index="${i}" ${checked.has(i)?'checked':''}><span>${item}</span></label>`).join('');
  $('#check-progress').textContent = `${checked.size} / ${kitItems.length}`;
}
$('#checklist').addEventListener('change', e => {
  if (!e.target.matches('input[type=checkbox]')) return;
  const i = Number(e.target.dataset.index);
  e.target.checked ? checked.add(i) : checked.delete(i);
  localStorage.setItem(CHECK_KEY, JSON.stringify([...checked]));
  renderChecklist();
});
$('#reset-checklist').addEventListener('click', () => {
  if (!confirm('Alle vinkjes van de noodpakket-checklist wissen?')) return;
  checked.clear(); localStorage.removeItem(CHECK_KEY); renderChecklist();
});
renderChecklist();

function updateWater() {
  const people = Math.max(1, Math.min(30, Number($('#people-count').value) || 1));
  $('#people-count').value = people;
  $('#water-total').textContent = `${people*9} LITER`;
}
$('#people-count').addEventListener('input', updateWater);
updateWater();

// Tabs
$$('.tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.tab').forEach(t => { t.classList.toggle('active',t===tab); t.setAttribute('aria-selected',String(t===tab)); });
  $$('.panel').forEach(p => { const active = p.id === `panel-${tab.dataset.tab}`; p.hidden = !active; p.classList.toggle('active',active); });
  if (tab.dataset.tab === 'map' && window.enolaMap) setTimeout(()=>window.enolaMap.invalidateSize(),80);
}));

// Clock / connection
function tick(){ $('#clock').textContent = new Date().toLocaleTimeString('nl-NL',{hour12:false}); }
tick(); setInterval(tick,1000);
function networkStatus(){ $('#connection-status').textContent = navigator.onLine ? 'VERBONDEN' : 'OFFLINE MODUS'; }
window.addEventListener('online',networkStatus); window.addEventListener('offline',networkStatus); networkStatus();

// Map
let map, userMarker, accuracyCircle;
const nlCenter = [52.1326,5.2913];
function setMapStatus(text){ $('#gps-status').textContent = text; }
function updateCoords(lat,lng){ $('#map-coords').textContent = `${lat.toFixed(4)}° N / ${lng.toFixed(4)}° E`; }
function initMap(){
  if (!window.L) {
    $('#tile-status').textContent = 'KAARTBIBLIOTHEEK NIET BESCHIKBAAR';
    $('#map').innerHTML = '<div style="padding:25px;color:#292923">Kaartcomponent niet geladen. Open de app eenmaal online om Leaflet lokaal beschikbaar te maken.</div>';
    return;
  }
  map = L.map('map',{zoomControl:true,preferCanvas:true}).setView(nlCenter,7);
  window.enolaMap = map;
  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  tiles.on('tileerror',()=>{ if(!navigator.onLine) $('#tile-status').textContent='OFFLINE: ALLEEN EERDER BEKEKEN TEGELS'; });
  tiles.on('tileload',()=>{ $('#tile-status').textContent=navigator.onLine?'KAARTTEGELS: ONLINE / WORDEN GECACHED':'KAARTTEGELS: CACHE'; });
  tiles.addTo(map);
  map.on('moveend',()=>{const c=map.getCenter();updateCoords(c.lat,c.lng);});
}
initMap();

$('#reset-map').addEventListener('click',()=>{ if(map){map.setView(nlCenter,7);setMapStatus('GPS: NIET GEACTIVEERD');} });
$('#locate-btn').addEventListener('click',()=>{
  if(!navigator.geolocation){setMapStatus('GPS: NIET ONDERSTEUND');return;}
  setMapStatus('GPS: LOCATIE OPVRAGEN…');
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude:lat,longitude:lng,accuracy}=pos.coords;
    if(!map) return;
    if(userMarker) map.removeLayer(userMarker);
    if(accuracyCircle) map.removeLayer(accuracyCircle);
    userMarker=L.circleMarker([lat,lng],{radius:8,color:'#292923',weight:3,fillColor:'#E87524',fillOpacity:1}).addTo(map).bindPopup('JOUW GPS-POSITIE');
    accuracyCircle=L.circle([lat,lng],{radius:accuracy,color:'#E87524',weight:1,fillOpacity:.08}).addTo(map);
    map.setView([lat,lng],Math.max(13,map.getZoom()));
    updateCoords(lat,lng);setMapStatus(`GPS: ACTIEF · ±${Math.round(accuracy)} M`);
  },err=>{setMapStatus(err.code===1?'GPS: TOESTEMMING GEWEIGERD':'GPS: LOCATIE NIET BESCHIKBAAR');},{enableHighAccuracy:true,timeout:12000,maximumAge:30000});
});
$('#print-map').addEventListener('click',()=>window.print());

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js').then(()=>console.info('ENOLA service worker registered')).catch(err=>console.warn('SW registratie mislukt',err));
  });
}
