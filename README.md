# claude-conventions

Arbeitskonventionen für Claude Code, die über mehrere Projekte hinweg gleich
gelten. Kopiervorlage, kein Plugin: Was hier liegt, wird in ein Projekt
kopiert und dort eingecheckt.

```
skills/issue-tracking/SKILL.md   das Verfahren — wie Tickets geführt werden
templates/ISSUE_TEMPLATE/        Issue-Formulare für .github/ISSUE_TEMPLATE/
templates/labels.json            Label mit Farbe und Beschreibung
```

## Ein Projekt aufsetzen

**1. Skill kopieren**

```sh
mkdir -p <projekt>/.claude/skills
cp -r skills/issue-tracking <projekt>/.claude/skills/
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
