# Designbriefing (generischer Teil)

Stand 2026-10-13. Lesbare Fassung mit Projektteil TrailerSlot:
`~/Dev/haengerplanung/docs/artefacts/2026-10-13-designbriefing.html`.
Änderungen hier eintragen, die HTML-Fassung ist Ausgabe, nicht Quelle.

## Anspruch

- **Agenturniveau.** Jede Richtung muss als Arbeit eines guten Studios durchgehen:
  Typografie, Abstände, Zustände, Kanten stimmen. Handwerklich mäßig scheidet aus,
  auch wenn die Idee gut ist. Darum: lieber eine Richtung weniger als eine halbe.
- **Stand der Technik und voraus.** Aktuelle UX-Muster, aber nicht die
  Vorlagenästhetik des Jahres. In drei Jahren noch nicht peinlich.
- **Funktion und Übersicht zuerst.** Ein Screen beantwortet eine Frage. Was fehlt
  oder ansteht, steht oben und fällt sofort auf.
- **Geführt.** Ohne Nachdenken sichtbar: wo bin ich, was muss ich eingeben, was ist
  der nächste Schritt. Pflichtfelder und offene Punkte sind als solche erkennbar
  (Farbe, Form, Wort „fehlt“), nicht erklärt.
- **Nutzer kennen das Thema.** Keine Einführungstexte, keine Marketingsätze,
  Fachbegriffe der Zielgruppe. Erklärungen nur, wo ein Begriff oder eine Folge sonst
  unklar bliebe, dann ein Satz.
- **Minimal.** Kein Element ohne Aufgabe. Keine Emojis, keine Zierlabels, keine
  Kommentare in der Oberfläche.
- **Icons gezielt.** Nur wo ein Icon schneller gelesen wird als ein Wort (Aktion,
  Zustand, Navigation), nie als Schmuck neben Überschriften. Bibliothek
  **Streamline** – der Gründer hat die Lizenz und lädt die SVGs selbst herunter,
  meist nach `docs/brand/icons/`. Erst dort suchen bzw. ihn bitten, zu suchen;
  fehlt ein Motiv (der Bootshänger zum Beispiel ist dort nicht vorhanden), im
  Streamline-Duktus selbst zeichnen: gleiche Strichstärke, Radien, Raster. In
  Mockups vor dem Download: Inline-SVG im selben Duktus als Platzhalter, in der
  README vermerkt.
- **Nicht typografielastig als Vorgabe.** Große Schrift als Träger ist eine
  Richtung unter mehreren, kein Muss. Zeichnung, Fläche, Farbe und Form dürfen
  genauso tragen.

## Grundregeln

- **Mobile first.** Gestaltet und geprüft bei 390 px. Touch-Ziele mindestens 44 px.
  Größere Breiten erweitern, sie retten nicht.
- **Wenige Farben, eine Aufgabe je Farbe.** Drei bis vier Farben mit fester
  Bedeutung. Semantische Farben (fehlt / prüfen / fertig) sind kein Akzent.
  Gedämpftes als Deckung der Tintenfarbe, nicht als eigene Graus.
- **Eine Hauptaktion je Screen.** Ein Block-Button, Nebenaktionen als Textlink.
  Zustände (gedrückt, inaktiv, fehlt) sichtbar.
- **Typografie sauber.** Eine oder zwei Familien, klare Skala, `tabular-nums` für
  Zahlen, Dezimalkomma, schmales geschütztes Leerzeichen (U+202F) vor Einheiten.
- **Zwei Sprachen.** Deutsch Standard, britisches Englisch. Jeder Text muss in
  beiden Sprachen in das Element passen; Sprachumschaltung auf jedem Screen.
- **DSGVO.** In Mockups sind Google Fonts erlaubt; in der App werden Schriften
  selbst gehostet, keine fremden Skripte, keine Einbettungen.
- **Barrierefrei als Standard.** Kontrast 4,5:1 (3:1 ab 24 px), echte `<button>`,
  `<input>` mit `<label>`, `aria-pressed` auf Umschaltern, `aria-label` auf
  Icon-Buttons, SVG mit `role="img"` und Beschreibung.

## Pflicht-Elemente je Richtung

Jede Richtung zeigt auf ihren Screens mindestens einmal:

| Element | Was geprüft wird |
|---|---|
| Überschrift | Hierarchie H1/H2, Zeilenlänge, Umbruch bei langen Namen |
| Formularfeld | Text- und Zahlfeld: Label, Wert, Fokus, Pflicht, Fehler |
| Auswahl | Checkbox, Segment oder Chips; gedrückt und ungedrückt |
| Dropdown | `<select>` mit sinnvollen Optionen |
| Grafik | Die domänenspezifische Zeichnung im Raster der Richtung |
| Teilen | Link oder Text weitergeben: kopieren, in den Chat posten |
| Ablaufschritte | Wo stehe ich, was kommt: Schritt-Anzeige oder Zustandsleiste |
| Sprachumschaltung | DE / EN, erreichbar, unauffällig |
| Status | Fehlt / prüfen / fertig als Form und Farbe, nicht nur Text |
| Liste | Zeilen mit Schlüssel, zwei Zeilen Text, Kennzahl rechts |
| Hauptaktion | Der Button, der den Schritt abschließt |
| Icons | Wo eingesetzt: Streamline oder gleicher Duktus, eine Strichstärke je Screen |

## Referenzen

Eigene Apps, deren Design als gelungen gilt. Nicht kopieren, aber auf dem Niveau:

- **SailRanker** (Brandbook v1, `~/Dev/sailranker/docs/brand/brandbook-v1.md`):
  Plakat-Karten mit Rahmen, genau drei Farben (Beige, Tinte, Orange), Orange für
  genau eine Sache je Karte, Markierungsbalken, Listen-Zeile statt Tabelle, jede
  Grafik endet in einem Satz.
- **FleetSheet, Windstation, sailloop, B6 Empfehlungen**: nüchtern, dicht, lesbar,
  jedes mit eigener Farbwelt.

## Nicht gewünscht (Vorlagen-Tropen)

Cremeweiß mit Serifen-Display und Terrakotta; Dunkel mit einem Neonakzent;
Zeitungs-Haarlinien in dichten Spalten; überall gleiche runde Karten mit demselben
Schatten; Versal-Eyebrow über jeder Überschrift; Pfeil hinter jedem Buttontext;
Mittelpunkte als Meta-Trenner, wo ein Komma reicht; Inter/Roboto/Arial als
„sichere“ Wahl; Icons oder Emojis als Dekoration. Eine dieser Formen ist erlaubt,
wenn der Gründer sie verlangt oder sie aus der Domäne kommt – nie als Standard.
