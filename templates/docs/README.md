# Doku

Alles, was kein Code ist, liegt hier: warum es das Projekt gibt, was gilt,
was entschieden ist, was gebaut werden soll, was herausgefunden wurde. Im
Wurzelverzeichnis des Repos liegen nur `README.md` und `CLAUDE.md`.

```
docs/
├─ vision.md        Warum es das Projekt gibt, für wen. Eine Datei.
├─ architecture.md  Was über alles hinweg gilt: Stack, Grenzen, Invarianten.
├─ decisions/       ADRs: warum X statt Y, mit Datum.
├─ specs/           Was gebaut werden soll, je Vorhaben eine Datei.
├─ research/        Befunde mit Quelle: Recherchen, Messungen, Tests.
├─ runbooks/        Betrieb: Deploy, Secrets, Wiederherstellung, Übergaben.
├─ artefacts/       HTML zum Ansehen im Browser: Mockups, Prototypen, Berichte.
├─ brand/           Logo, Farben, Schriften, Brandbook — die Quelldateien.
└─ client/          Was an den Kunden geht: Berichte, Angebote, PDFs.
```

Ein Ordner, der leer bleibt, stört nicht. Ein neuer Ordner neben diesen
braucht einen Grund, der hier nachgetragen wird.

## Die Regeln je Ordner

**`vision.md`, `architecture.md`** sind je eine Datei. Die Vision sagt,
warum; die Architektur sagt, was dabei gilt. Wer eine Invariante brechen
will, schreibt eine ADR, nicht eine Ausnahme in eine Spec.

**`decisions/`** — `NNNN-entscheidung-als-satz.md`, fortlaufend
nummeriert, nach `decisions/_template.md`. Nie löschen, nur ersetzen: Die
neue ADR nennt die alte, die alte bekommt `Status: ersetzt durch NNNN`.

**`specs/`** — `<id>.md`, Dateiname gleich `id` im Frontmatter, ohne
Nummer, flach abgelegt. Der Zustand steht im Frontmatter (`status`), nicht
im Ordner. Nach `specs/_template.md`. Eine Spec ohne Abnahmekriterien ist
eine Notiz und gehört nach `research/`.

**`research/`** — `YYYY-MM-DD-thema.md`. Jede Behauptung mit Quelle und
Abrufdatum. Rohdaten unter `research/raw/`, nicht eingecheckt.

**`runbooks/`** — `thema.md`, Schritt für Schritt, so geschrieben, dass
jemand ohne Vorwissen es ausführen kann. Keine Secrets, nur wo sie liegen.

**`artefacts/`** — der feste Ort für HTML. Siehe unten.

**`brand/`** — Quelldateien (SVG, Schriften, Farbwerte). Was die App
ausliefert, wird daraus nach `public/` kopiert oder gebaut, nicht umgekehrt.

**`client/`** — datierte Fassungen, wie sie verschickt wurden:
`YYYY-MM-DD-thema.pdf` mit der Quelle daneben. Nachträglich nicht ändern.

## HTML-Artefakte

Alles, was man im Browser ansieht statt liest, liegt in `docs/artefacts/`:
Mockups, Design-Varianten, Klick-Prototypen, Denkstücke, Berichte.

- **Dateiname:** `<spec-id>.html` zur Spec gleichen Namens, Varianten als
  `<spec-id>-<zusatz>.html`. Was zu keiner Spec gehört:
  `YYYY-MM-DD-thema.html`.
- **Flach**, keine Unterordner je Thema. Bilder und Screenshots unter
  `artefacts/assets/`. Einzige Ausnahme: ein Artefakt, das aus vielen
  Dateien besteht (Canvas-Abzug, Pitch-Deck mit Build-Skripten), bekommt
  einen eigenen Ordner mit `README.md`.
- **Eigenständig:** CSS und JS in der Datei, keine Anfragen an fremde
  Server. Die Datei muss in fünf Jahren noch genauso aussehen.
- **`index.html` ist das Verzeichnis.** Jedes Artefakt steht dort mit einem
  Satz, zugehöriger Spec, Datum und — falls auf claude.ai veröffentlicht —
  dem Artifact-Link. Überholte Stücke bleiben liegen und werden im Index als
  *Bestand* markiert.
- **Ansehen:** Live Server (VS Code) ist auf diesen Ordner eingestellt.
