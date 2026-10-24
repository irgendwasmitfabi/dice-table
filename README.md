# Würfeltafel

Punktezähler fürs Würfelspiel mit sechs Würfeln – als App fürs Handy.
Reines HTML, CSS und JavaScript, ohne Build-Schritt und ohne externe Dienste.

## Ordnerstruktur

```
wuerfeltafel/
├── netlify.toml              Netlify: Ausgabeordner, Sicherheits-Header, Caching
├── README.md
├── .gitignore
├── .editorconfig
└── public/                   wird von Netlify ausgeliefert
    ├── index.html            die App
    ├── 404.html              Fehlerseite (Netlify nutzt sie automatisch)
    ├── manifest.webmanifest  macht die Seite installierbar
    ├── sw.js                 Service Worker für Offline-Betrieb
    ├── robots.txt
    └── assets/
        ├── css/app.css
        ├── js/app.js
        ├── fonts/            Alegreya, selbst gehostet (SIL Open Font License, siehe OFL.txt)
        └── icons/            Favicon, App-Icons, Apple-Touch-Icon
```

## Auf Netlify veröffentlichen

1. Den Ordnerinhalt in ein neues Git-Repository legen und zu GitHub, GitLab oder Bitbucket pushen.
2. In Netlify: **Add new site → Import an existing project** und das Repository wählen.
3. Netlify liest `netlify.toml` selbst. Build command leer lassen, Publish directory ist `public`.
4. **Deploy** – fertig.

Ohne Git geht es auch: den Ordner `public` per Drag-and-drop auf
<https://app.netlify.com/drop> ziehen. Dann gelten die Header aus `netlify.toml`
allerdings nicht; dafür müsste man sie als `public/_headers` ablegen.

## Als App aufs Handy

- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“.
- **Android (Chrome):** Menü → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

Danach startet die Würfeltafel im Vollbild und funktioniert auch ohne Internet.

## Sicherheit und Datenschutz

- Strenge Content-Security-Policy: Skripte, Styles und Schriften nur von der eigenen Domain, keine Inline-Skripte, keine Einbettung in fremde Seiten.
- HSTS, `nosniff`, `Referrer-Policy: no-referrer`, abgeschaltete Browser-Berechtigungen (Kamera, Mikrofon, Standort …).
- Keine Cookies, kein Tracking, keine Google Fonts von Fremdservern. Der Spielstand liegt nur im `localStorage` des eigenen Browsers.

Prüfen lässt sich das nach dem Deploy z. B. mit <https://securityheaders.com>.

**HSTS-Hinweis:** Der Header enthält `preload` und `includeSubDomains`. Auf einer
`*.netlify.app`-Adresse ist das unproblematisch. Nutzt du eine eigene Domain mit
weiteren Subdomains ohne HTTPS, nimm diese beiden Teile vorher heraus.

## Updates ausrollen

Nach Änderungen an Dateien in `public/` in `public/sw.js` die Zeile
`const CACHE_VERSION = "v1";` hochzählen (`"v2"`, `"v3"` …). So bekommen auch
installierte Apps die neue Version statt der zwischengespeicherten.

## Lizenzen

Schrift Alegreya / Alegreya SC von Huerta Tipográfica, SIL Open Font License 1.1.
