# <Projektname>

<Ein Satz: was das Projekt ist und für wen.>

**Art:** <Website | App> — siehe „Stack". Die nicht zutreffende Variante
beim Aufsetzen löschen.

## Stack

Gemeinsam für beide Varianten:

- **Hosting:** Cloudflare Worker mit Static Assets, eigene Domain über
  `custom_domain = true` in `wrangler.toml`. Kein Cloudflare Pages.
- **Deploy:** GitHub Actions, Push auf `main` → `cloudflare/wrangler-action`.
  Nie von Hand deployen; ein Deploy von Hand ist ein Deploy, den niemand
  nachvollziehen kann.
- **Domain:** registriert bei Spaceship, Nameserver zeigen auf Cloudflare.
  DNS wird nur bei Cloudflare gepflegt.
- **Werkzeug:** pnpm, Node 24, TypeScript, Tailwind, Vitest, Playwright.

### Variante Website

- **Astro**, statisch generiert, kein Client-JS außer wo nötig.
- i18n über das Routing von Astro: `defaultLocale: "de"`, `locales: ["de", "en"]`,
  `hreflang`-Links im Layout.

### Variante App

- **Vite + Preact**, PWA (`vite-plugin-pwa`). React nur, wenn eine
  Bibliothek es erzwingt — dann hier begründen.
- **PWA-Updates:** Die App vom Home-Bildschirm wird meist aus dem Hintergrund
  geholt, ohne Seitenaufruf; ohne eigene Prüfung läuft alter Code tagelang
  weiter. Der Build schreibt `/version.json` (Kennung = die gehashten JS- und
  CSS-Dateien, `src/shared/version.ts`, Plugin in `vite.config.ts`), die App
  fragt sie bei jeder Rückkehr in den Vordergrund ab (`src/app/lib/update.ts`):
  nach 15 Minuten weg und ohne Eingabe still neu laden, sonst Hinweis
  „Neu laden“. `index.html` nie vorhalten (NetworkFirst).
- **API im selben Worker** (`src/worker/`), Frontend in `src/app/`. Ein Repo,
  ein Worker, ein Deploy.
- **Daten:** D1. <Falls MySQL: über Hyperdrive, Anbieter und Grund hier nennen.>

## Code

**Code englisch, Dokumente deutsch.** In jeder Codedatei ist alles englisch:
Bezeichner (Variablen, Funktionen, Typen, Dateien, Tabellen und Spalten,
JSON-Schlüssel, Werte technischer Aufzählungen), Kommentare, Testnamen,
URL-Slugs und API-Pfade. Deutsch bleiben Dokumente unter `docs/` und die Texte,
die Nutzer lesen (in `de.json` / `en.json`). Keine Umlaute in Bezeichnern.
Fachbegriffe stehen mit ihrem englischen Namen im Glossar in
`docs/architecture.md`.

## Sprachen

**Deutsch und Englisch, Deutsch ist Standard.** Jeder sichtbare Text existiert
in beiden Sprachen, auch Rechtstexte, Fehlermeldungen und E-Mails.

- Texte liegen in `de.json` / `en.json` (App) bzw. je Locale (Website),
  nie hart im Markup.
- Ein Test prüft, dass beide Dateien dieselben Schlüssel haben.
- `<html lang>` folgt der Seite, nie fest verdrahtet.
- Fehlt eine Übersetzung, fällt die Anzeige auf Deutsch zurück.

## Mobile first

Gestaltet und getestet wird zuerst bei 390 px Breite. Größere Breakpoints
erweitern das Layout, sie retten es nicht. Touch-Ziele mindestens 44 px.

## DSGVO

- **Keine Anfrage an Dritte ohne Einwilligung.** Schriften selbst hosten,
  keine Skripte von fremden CDNs, keine Einbettungen (YouTube, Maps).
- **Kein Tracking.** Ist Statistik nötig: Cloudflare Web Analytics (ohne
  Cookies), und ein Absatz in der Datenschutzerklärung.
- **Kein Cookie-Banner**, solange nichts Einwilligungspflichtiges gesetzt wird.
  Ein Banner ohne Anlass ist kein Schutz, sondern eine falsche Aussage.
- **Impressum (§ 5 DDG) und Datenschutzerklärung** in beiden Sprachen, im
  Footer jeder Seite verlinkt.
- **Auftragsverarbeiter vollständig nennen:** Cloudflare, dazu jeder weitere
  Dienst, der personenbezogene Daten sieht. <Liste für dieses Projekt.>
- **Formulare:** nur für ihren Zweck, direkt ins Postfach, nichts speichern,
  Datenschutz-Link am Formular.
- **Keine personenbezogenen Daten in Git, Issues oder Logs.**

## Doku

Alles, was kein Code ist, liegt unter `docs/`. Aufbau und Regeln in
`docs/README.md`. Die wichtigsten:

- **HTML-Artefakte** (Mockups, Prototypen, Berichte) immer nach
  `docs/artefacts/`, eigenständig, ohne fremde Server, im `index.html`
  eingetragen.
- **Specs** nach `docs/specs/<id>.md`, **Entscheidungen** als ADR nach
  `docs/decisions/`, **Recherche** mit Quelle nach `docs/research/`.
- Keine Doku-Ordner im Wurzelverzeichnis.

## Tickets

- **Support (Kunde):** Notion-Datenbank <Name/URL>, bearbeitet nach
  `.claude/skills/support-tickets/SKILL.md`.
- **Entwicklung (intern):** GitHub Issues nach
  `.claude/skills/issue-tracking/SKILL.md`, gebündelt im GitHub Project
  <Nummer/URL>. Bereichspräfix: `<area:>`.

## Befehle

```sh
pnpm dev          # lokal
pnpm test         # Vitest, inkl. i18n-Vollständigkeit
pnpm test:e2e     # Playwright, mobile Viewport zuerst
pnpm build
```

## Eigenheiten dieses Projekts

<Was nur hier gilt. Leer lassen, wenn nichts.>
