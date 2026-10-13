---
name: design-richtungen
description: Designrichtungen für eine App auf einem Canvas entwerfen und in Runden zur Entscheidung führen – nach dem Designbriefing von Dual Citizen (Agenturniveau, minimal, geführt, Streamline-Icons). Nutzen, sobald der Gründer Designalternativen, Richtungen, ein Board, Mockups mehrerer Varianten, eine neue Designrunde, ein Brandbook aus einer gewählten Richtung oder „App Design“ für eines seiner Projekte will (TrailerSlot/Hängerplanung, SailRanker, FleetSheet, Windstation, sailloop, B6 oder ein neues) – auch wenn er nur „zeig mir ein paar Varianten“ oder „Runde 2“ sagt. Nicht nutzen für einzelne UI-Fixes in bestehendem Code.
---

# Designrichtungen

Du arbeitest als Design Lead eines kleinen Studios für den Gründer von Dual Citizen.
Er wählt Design nicht aus einem Entwurf, sondern aus mehreren klar verschiedenen
Richtungen, die er nebeneinander vergleicht; aus seiner Rückmeldung entsteht die
nächste Runde oder eine Entscheidung. Dieser Skill hält den Prozess und den
Qualitätsanspruch fest, damit jedes Projekt auf demselben Niveau startet.

Die Regeln stehen in `references/briefing.md`. Lies sie vor der ersten Richtung;
sie sind kurz und entscheiden, ob das Ergebnis durchgeht.

## Ablauf

### 1 Projektteil klären – fragen, nicht raten

Das Generische kennst du; das Projektspezifische kennt nur der Gründer. Lies erst,
was im Repo steht (`CLAUDE.md`, `docs/vision.md`, `docs/decisions/`, frühere Runden
unter `docs/artefacts/`, ein Brandbook unter `docs/brand/`). Stelle dann mit
`AskUserQuestion` nur die Fragen, die das Repo nicht beantwortet. Fehlt viel, in zwei
Runden fragen statt in einer Wand. Die Fragen stehen in `references/fragen.md`;
die wichtigsten:

- Welche **Rollen und welche zwei bis drei Schlüsselscreens** je Richtung?
- Was ist **gesetzt** (Farben, Schrift, Zeichenregeln, ADRs) und was ist offen?
- Wie viele Richtungen, und soll die bestehende Richtung als eine davon mitlaufen?
- Gibt es **domänenspezifische Grafik** (bei TrailerSlot die Hängerzeichnung), die
  jede Richtung zeigen muss?
- Arbeitstitel, Vereins- oder Kundenname für die Beispieldaten?

Was der Gründer beantwortet hat, schreibst du als Abschnitt „Projekt“ in die
README des Abzugs (Schritt 4), damit die nächste Runde nicht neu fragt.

### 2 Richtungen entwerfen

Jede Richtung bekommt einen Namen aus der Domäne und eine These in einem Satz
(„Die Zeichnung ist das Dokument“). Richtungen müssen sich im **System**
unterscheiden – Grund, Farbe, Schrift, Form, Rhythmus –, nicht nur im Akzent.
Gleiche Daten, gleiche Screens, gleiche Inhalte in allen Richtungen, sonst
vergleicht der Gründer Inhalte statt Gestaltung.

Prüfe jede Richtung gegen die Pflicht-Elemente in `references/briefing.md`
(Überschrift, Formularfeld, Auswahl, Dropdown, Grafik, Teilen, Ablaufschritte,
Sprachumschaltung, Status, Liste, Hauptaktion). Fehlt eines, ist der Screen nicht
fertig. Prüfe sie auch gegen die Liste der Vorlagen-Tropen dort: Was auf jeder
beliebigen Seite so aussehen könnte, ist keine Richtung.

Wenn eine Richtung schon entschieden ist (ADR vorhanden) und der Gründer eine neue
Runde will, läuft die entschiedene als eine Richtung mit – weiterentwickelt, nicht
kopiert – und mindestens drei neue stehen daneben.

### 3 Canvas bauen

Artefakttyp **Design** (Canvas) über das Artifact-Werkzeug (`quickstart` mit
`intent: "design"`, dann den Typ anlegen). Je Richtung ein Artboard pro Screen,
Telefon 390 px breit; Höhe 844, oder bis 960, wenn alle Pflicht-Elemente sonst
nicht ohne Gedränge hineinpassen – lieber höher als gequetscht. Spalten je
Richtung, Zeilen je Screen, 80 px zwischen Frames, eine Titelnotiz über dem Board,
je Richtung eine Sticky mit Name und These zwischen den Zeilen.

Technik und Stolpersteine in `references/canvas.md`.

### 4 Abzug ins Repo

Der Canvas liegt auf claude.ai; die Quelle gehört ins Repo:

- Ordner `docs/artefacts/<thema>-runde<N>/` mit allen `.dc.html`, `canvas.json`
  und einer `README.md`: Link zum Canvas, Datum, je Richtung zwei Sätze, Abschnitt
  „Projekt“ mit den Antworten aus Schritt 1, Zeile „Rückmeldung: noch offen“.
- Eintrag in `docs/artefacts/index.html` (Titel, ein Absatz, Datum, Artifact-Link).
- Nichts committen, außer der Gründer sagt es.

### 5 Rückmeldung einholen

Schließe mit dem Link und einer Tabelle Richtung → These. Bitte um **einen Satz je
Richtung: was trägt, was stört.** Mehr nicht; der Gründer kennt das Verfahren.

### 6 Runde 2 oder Entscheidung

- **Runde 2:** Stärken kombinieren, Schwächen verwerfen, Neues dazu. Gleicher
  Canvas, neue Zeile oder neue Spalten; README um die Rückmeldung und die neue
  Runde ergänzen.
- **Entscheidung:** ADR nach `docs/decisions/_template.md` mit Farben, Schrift,
  Formregeln und dem, was verworfen wurde; README und ADR verweisen aufeinander.
  Danach anbieten, aus den Schlüsselscreens ein Brandbook nach `docs/brand/`
  abzuleiten (Vorbild: SailRanker Brandbook v1).

## Was du nicht tust

- Keine Richtung ohne These, kein Screen ohne alle Pflicht-Elemente.
- Keine Platzhaltertexte, keine Platzhalterkästen; erfundene, aber echte Daten.
- Kein Verifizieren des Canvas durch Screenshots oder Lesen der eigenen Dateien,
  solange der Gründer es nicht verlangt – er sieht das Board selbst.
- Keine Entscheidung vorwegnehmen. Du darfst eine Richtung empfehlen, in einem
  Satz, nach der Tabelle.
