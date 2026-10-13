# Canvas: Technik und Stolpersteine

Der Canvas ist ein Artifact vom Typ **Design**. Die verbindlichen Formatregeln
liefert der Typ selbst beim Anlegen (SKILL.md und `format.md` des Typs); hier steht
nur, was sich in Runden bewährt hat.

## Anlegen

1. `Artifact` mit `action: "quickstart"`, `intent: "design"`.
2. Typ anlegen: `type_url` aus dem Ergebnis, `title` = „<Arbeitstitel>
   Designrichtungen“, `auto_open: "after_first_write"`.
3. Dateien in einem Ordner im Scratchpad unter `project/`: zuerst
   `project/canvas.json` vollständig (alle Boards und `order`), dann
   `project/Main.dc.html`, beide in einem Publish mit `root` und `url`. Danach die
   übrigen Artboards, je zwei bis vier pro Publish.

## Anordnung, die sich bewährt hat

- Spalten je Richtung (x = Index × 470), Zeilen je Screen.
- Höhe 920 statt 844, wenn alle Pflicht-Elemente auf einem Screen stehen sollen;
  `$preview` im Artboard muss dieselben Maße haben.
- Titelnotiz (`kind: "title1"`) bei y = 0, `maxW` über die ganze Breite; erste
  Zeile bei y = 300.
- Je Richtung eine Sticky (ohne `kind`, `w: 390`, `maxH: 300`, `fill` je Richtung
  verschieden) zwischen erster und zweiter Zeile; zweite Zeile 420 px tiefer als
  die Sticky.
- Board-`title` im Muster „G · Klartext — Eltern melden“, damit die Namensleiste
  Richtung und Screen nennt.

## Artboard

- Skelett exakt wie vom Typ vorgegeben: `<script src="./support.js">` im Head,
  `<x-dc>`, `<helmet>` nur für Font-Link und `body{margin:0}`, Stile **inline**
  (die Eigenschaftenleiste bearbeitet inline-Stile), `data-props` mit `$preview`.
- Root fest `width: 390px; height: <h>px; overflow: hidden; display: flex;
  flex-direction: column`, Fußbereich mit `margin-top: auto`.
- Google Fonts nur über `<link>` in `<helmet>`; Fallback-Stack angeben.
- Formularelemente echt (`<input>`, `<select>`, `<label>`), mit `id`; Umschalter
  als `<button aria-pressed>`.
- Domänen-Grafik als Inline-SVG mit `role="img"` und `aria-label`; eine Geometrie
  für alle Richtungen, nur Farben und Strich ändern sich – so vergleicht man
  Gestaltung, nicht Zeichnung.
- Icons: Inline-SVG, Strich 1,8–2,2, `aria-hidden="true"`; Icon-Buttons mit
  `aria-label`.

## Nach dem Publish

- Nicht verifizieren (keine Screenshots, kein Zurücklesen), der Gründer sieht das
  Board. Ausnahme: er meldet etwas Sichtbares als kaputt.
- Abzug: Inhalt von `project/` nach `docs/artefacts/<thema>-runde<N>/` kopieren,
  README dazu, `index.html` ergänzen.
- Änderungen an einem Board: Datei im Scratchpad editieren, nur diese Datei neu
  publizieren, Abzug im Repo mitziehen.
