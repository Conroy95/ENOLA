# PROJECT ENOLA — PWA

Mobielvriendelijke PWA voor iOS en Android. De applicatie bestaat uit statische bestanden en kan op iedere HTTPS-webserver worden gehost.

## Bestanden
- `index.html` — app-shell, tabs en metadata
- `styles.css` — terminal-interface en exact opgegeven kleuren
- `app.js` — kaart, GPS, radio-overzicht en checklist
- `manifest.json` — PWA-installatiegegevens
- `sw.js` — offline app-shell en runtime-cache voor kaarttegels
- `icons/` — app-iconen

## Lokaal testen
Een service worker werkt niet via `file://`. Start een lokale webserver vanuit deze map, bijvoorbeeld:

```bash
python3 -m http.server 8080
```

Open daarna `http://localhost:8080`. Voor installatie op een telefoon is HTTPS vereist.

## Installeren
- **iOS:** open de HTTPS-site in Safari → Deel → Zet op beginscherm.
- **Android:** open de HTTPS-site in Chrome → Installeren / Toevoegen aan startscherm.

Open de app eerst online zodat de app-shell en Leaflet-bestanden worden gecachet. De kaarttegels worden alleen gecachet wanneer ze daadwerkelijk worden bekeken. Offline zijn alleen eerder geladen kaartgebieden beschikbaar. De app downloadt niet automatisch heel Nederland; dat voorkomt onredelijk bulkgebruik van de publieke OpenStreetMap-tegeldienst.

## Kaart en offline-gedrag
Leaflet 1.9.4 wordt tijdens de eerste online sessie door de service worker gecachet. OpenStreetMap-kaarttegels worden bij gebruik maximaal 250 tegels diep lokaal bewaard (FIFO-benadering). Geolocation vereist toestemming en een veilige context (HTTPS of localhost). De GPS-functie werkt alleen wanneer het apparaat locatievoorzieningen toestaat.

## Radiofrequenties — belangrijke nuance
De FM-tabel bevat regionale publieke calamiteitenzenders en de zendlocaties/frequenties zoals gepubliceerd door de overheidscampagne Denk vooruit. De frequentie die het best werkt hangt af van je exacte locatie. Nederland heeft geen universele landelijke FM-noodfrequentie. Controleer actuele frequenties en lokale ontvangst vóór een incident.

Marifoon: VHF 16 is het spraaknoodkanaal op zee en ruime wateren; VHF 70 is voor DSC en niet voor spraak. Op binnenwateren gelden vaarweg- en blokkanalen; kanaal 16 is niet overal het juiste kanaal. Gebruik marifoonapparatuur alleen volgens de geldende regels en je bevoegdheden.

PMR446 is gedeelde vergunningvrije korte-afstandscommunicatie onder voorwaarden, niet een officieel noodkanaal en niet gegarandeerd storingsvrij.

## Checklist en privacy
Checkliststatus wordt uitsluitend in `localStorage` van de browser bewaard. De GPS-locatie wordt niet naar een server verstuurd door deze applicatie. Kaartaanvragen aan OpenStreetMap kunnen uiteraard netwerkmetadata bevatten wanneer je online bent.

## Bronnen
- Rijksoverheid / Denk vooruit — https://www.denkvooruit.nl/bereid-je-voor/zo-krijg-je-een-waarschuwing/radio
- Rijksoverheid — https://www.rijksoverheid.nl/home/vraag-en-antwoord/veiligheidsregios-en-crisisbeheersing/wat-zit-er-in-een-noodpakket
- KNRM — https://www.knrm.nl/alarmeren
- RDI — https://www.rdi.nl/onderwerpen/vergunningen-en-registraties/portofoons-en-mobilofoons
- OpenStreetMap tile usage policy — https://operations.osmfoundation.org/policies/tiles/

## Gebruik
Project ENOLA is een hulpmiddel voor voorbereiding en algemene informatie. Het is geen meldkamer, officiële overheidsapp, noodcommunicatiesysteem of vervanging van 112. Volg bij incidenten altijd actuele aanwijzingen van de bevoegde autoriteiten.
