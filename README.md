# claude-conventions

Arbeitskonventionen für Claude Code, die über mehrere Projekte hinweg gleich
gelten. Kopiervorlage, kein Plugin: Was hier liegt, wird in ein Projekt
kopiert und dort eingecheckt.

```
skills/issue-tracking/SKILL.md   das Verfahren — wie Tickets geführt werden
skills/support-tickets/SKILL.md  Kundensupport über Notion (MCP)
skills/project-setup/SKILL.md    /project-setup — neues Projekt nach Standard-Stack
templates/CLAUDE.md              Projekt-CLAUDE.md: Stack, de/en, Mobile first, DSGVO
templates/deploy.yml             GitHub Actions → Cloudflare
templates/docs/                  docs/-Gerüst: specs, decisions, research, artefacts, …
templates/vscode/                .vscode/settings.json und extensions.json
templates/ISSUE_TEMPLATE/        Issue-Formulare für .github/ISSUE_TEMPLATE/
templates/labels.json            Label mit Farbe und Beschreibung
```

## Schnellweg: `/project-setup`

Einmalig auf dem Rechner:

```sh
git clone https://github.com/zinyosrim/claude-conventions ~/Dev/claude-conventions
mkdir -p ~/.claude/skills
ln -s ~/Dev/claude-conventions/skills/project-setup ~/.claude/skills/project-setup
```

Danach in Claude Code `/project-setup` aufrufen. Der Skill erledigt die
Schritte unten und zusätzlich Gerüst, `CLAUDE.md`, Deploy, GitHub Project
und die Cloudflare-Anbindung. Er liegt nur global, weil er einmal pro Projekt
läuft; alles, was das Projekt danach braucht, wird eingecheckt.

## Ein Projekt von Hand aufsetzen

**1. Skill kopieren**

```sh
mkdir -p <projekt>/.claude/skills
cp -r skills/issue-tracking skills/support-tickets <projekt>/.claude/skills/
```

Der Skill wird geladen, wenn es um Tickets geht — er muss nicht aufgerufen
werden. Einchecken, damit er auch in einer Web-Sitzung da ist: Deren Container
ist flüchtig, `~/.claude` überlebt nicht.

**2. Issue-Templates kopieren**

```sh
mkdir -p <projekt>/.github/ISSUE_TEMPLATE
cp templates/ISSUE_TEMPLATE/*.yml <projekt>/.github/ISSUE_TEMPLATE/
```

Diese Dateien müssen im Projekt-Repo liegen, weil GitHub sie dort erwartet.

**3. Label anlegen**

```sh
jq -r '.[] | [.name, .color, .description] | @tsv' templates/labels.json |
while IFS=$'\t' read -r name color desc; do
  gh label create "$name" --color "$color" --description "$desc" --force
done
```

Braucht `gh` und `jq`. Ohne die beiden: die Datei lesen und die Label unter
Issues → Labels von Hand anlegen — es sind zehn.

**4. Ungenutzte Standardlabel löschen**

```sh
for l in documentation duplicate enhancement "good first issue" \
         "help wanted" invalid question wontfix; do
  gh label delete "$l" --yes
done
```

`bug` bleibt. `wontfix` sagt dasselbe wie `dropped` — zwei Wege für dieselbe
Sache sind einer zu viel.

**5. Bereichspräfix festlegen**

Der Skill beschreibt das Bereichspräfix als Konzept, nicht als konkreten Wert.
Jedes Projekt wählt seines — `spec:`, `area:`, `pkg:`, `service:` — und nennt
es in seiner `CLAUDE.md`, zusammen mit allem anderen, was dieses Projekt
eigen hat. Beispiel:

```markdown
**Tickets:** nach der Konvention in `.claude/skills/issue-tracking/SKILL.md`.
Bereichspräfix ist `area:<name>`. Zusätzliche Phase: `status:review` — wartet
auf Freigabe durch den Kunden.
```

## Bestehende Projekte auf `docs/` umziehen

Die Ordnung in `templates/docs/README.md` ist aus drei Projekten
zusammengezogen, die jedes eine andere hatten. Beim Umzug gilt:
Verschieben mit `git mv`, damit die Historie bleibt, und Verweise im selben
Commit nachziehen.

| Heute | Wohin |
|---|---|
| sailloop `specs/`, `decisions/`, `research/` im Wurzelverzeichnis | `docs/specs/`, `docs/decisions/`, `docs/research/` |
| sailloop `artefacts/` | `docs/artefacts/` |
| sailloop `architecture/architektur.md`, `specs/vision.md` | `docs/architecture.md`, `docs/vision.md` |
| sailloop `src/brand/`, `artefacts/brandbook.html` | `docs/brand/`, `docs/artefacts/brandbook.html` |
| sailranker `ARCHITECTURE.md` im Wurzelverzeichnis | `docs/architecture.md` |
| sailranker `docs/NN-thema.md` (nummeriert) | je nach Inhalt `docs/specs/<id>.md` oder `docs/decisions/NNNN-….md` |
| sailranker `docs/review/*.html`, `docs/pitch/` | `docs/artefacts/`, Bilder nach `docs/artefacts/assets/` |
| windstation `docs/decisions.md` (eine Datei) | je Entscheidung eine ADR in `docs/decisions/` |
| windstation `design/` | Quelldateien nach `docs/brand/`, Entwürfe nach `docs/artefacts/` |
| fsys `architecture/` | `docs/architecture.md`, Pläne nach `docs/specs/`, ADRs nach `docs/decisions/` |
| fsys `product/prototypes/`, `product/design-system/` | `docs/artefacts/`, `docs/brand/` |
| fsys `domain/`, `norming/` | `docs/research/` |
| fsys `reference/` | `docs/runbooks/` |
| fsys `client-materials/` | `docs/client/` |

fsys ist ein eigenes Doku-Repo neben drei Code-Repos. Dort liegt `docs/`
im Doku-Repo, nicht in jedem Code-Repo.

## Was hierher gehört und was nicht

Hierher: was in **jedem** Projekt gleich ist. Die Phasen, die Präfix-Regel,
das Anlegen und Beenden eines Tickets.

Nicht hierher: alles Projektspezifische. Zusätzliche Phasen, das
Bereichspräfix, die Kopplung an projekteigene Artefakte. Das steht in der
`CLAUDE.md` des Projekts. Ein Skill, der die Eigenheiten eines Projekts
mitschleppt, ist im nächsten Projekt falsch.

## Änderungen

Die Konvention ändert sich selten, aber sie ändert sich. Wer sie ändert,
ändert sie hier — und kopiert sie in die Projekte, die sie brauchen.
Kopieren ist der bewusste Preis dieser Stufe: Sie hat keinen Mechanismus,
der etwas hinter deinem Rücken tut. Wird das Kopieren lästig, ist der
nächste Schritt ein Plugin-Marketplace, der aus diesem Repo eine Quelle
macht, aus der sich die Projekte bedienen.
