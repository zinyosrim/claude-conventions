---
name: issue-tracking
description: Tickets als GitHub Issues führen — anlegen, labeln, in die nächste Phase ziehen, schließen oder verwerfen. Nutzen, wenn es um Aufgaben, Ideen, Tickets, Issues, Backlog, Status oder „was steht an" geht; auch bei englischen Formulierungen wie new task, create issue, triage, backlog, close ticket, what's open. Nicht nutzen für Pull-Request-Reviews.
---

# Tickets als GitHub Issues

Ein Ticket ist ein Arbeitspaket. Es lebt als GitHub Issue, weil nur dort die
Verknüpfung mit Commits und Pull Requests entsteht: `fixes #7` in einer
Commit-Nachricht schließt das Ticket, `refs #7` verlinkt es.

## Die eine Regel

**Jedes Ticket trägt genau ein `status:`-Label.** Zwei sind immer ein
Pflegefehler, kein Sonderfall. Der Zustand ist die Phase, in der das Ticket
gerade steht — es gibt daneben keine zweite Achse „Art der Arbeit".

| Label | Bedeutung |
|---|---|
| `status:triage` | Idee, noch nicht entschieden |
| `status:research` | wird untersucht, **um zu entscheiden** |
| `status:planned` | entschieden, noch nicht begonnen |
| `status:spec` | die Spezifikation wird geschrieben |
| `status:dev` | wird gebaut |
| *(kein Label, Issue geschlossen)* | erledigt |
| *(`dropped`, geschlossen als „not planned")* | verworfen |

**Research steht vor Planned.** Untersucht wird, um zu entscheiden — ein
Ticket auf `status:research` ist eine offene Frage, keine beschlossene Arbeit.
Wer die beiden vertauscht, plant Arbeit, deren Sinn noch nicht feststeht.

**Phasen dürfen übersprungen werden.** Eine Zeile in einer Konfigurationsdatei
geht direkt auf `status:dev`. Die Reihenfolge ist eine Ordnung, kein
Pflichtweg.

**`status:spec` ist nicht der Zustand des Dokuments.** Es sagt, dass an
*diesem Ticket* gearbeitet wird. Wo eine Spec ihren eigenen Zustand führt (im
Frontmatter, in einer Datenbank), gewinnt bei Widerspruch immer die Spec.
Ein Label ändert nie den Zustand eines Artefakts.

## Die übrigen Label

| Label | Bedeutung |
|---|---|
| `bug` | etwas Gebautes verhält sich anders als spezifiziert |
| `infra` | Repo, Deployment, Werkzeug; gehört zu keinem Fachbereich |
| `tracking` | Sammel-Issue für einen Bereich, bündelt Sub-Issues |
| `blocked` | etwas steht im Weg; der Grund steht im Issue |
| `dropped` | verworfen, Issue geschlossen als „not planned" |
| `<bereich>:<id>` | Bereichszuordnung, siehe unten |

`blocked` ist **kein Zustand**, sondern eine Eigenschaft. Ein blockiertes
Ticket behält sein `status:`-Label und sagt damit, wo es stünde, wenn der
Blocker fiele.

## Die Präfix-Regel

**Präfix, wo eine Menge von Werten sich gegenseitig ausschließt. Kein Präfix,
wo ein Label allein für sich steht.**

Deshalb `status:`, `horizon:` und das Bereichspräfix mit Doppelpunkt — und
`bug`, `blocked`, `infra`, `tracking`, `dropped` nackt. Das Präfix macht
dreierlei: Es zeigt an der Schreibweise, welche Ausschlussregel gilt; es
verhindert die Doppeldeutigkeit zwischen Phase und Eigenschaft (ein nacktes
`research` kann beides heißen, `status:research` nur eines); und es sortiert
die Label im Picker zu Gruppen statt sie übers Alphabet zu streuen.

Was es **nicht** bringt: Die GitHub-Suche kennt keine Platzhalter bei Labeln.
`label:status:*` gibt es nicht, jeder Wert muss einzeln genannt werden.

**Das Bereichspräfix wählt das Projekt.** Je nach Zuschnitt `spec:`, `area:`,
`pkg:` oder `service:`. Ein Ticket trägt höchstens eines davon. Welches ein
Projekt benutzt, steht in seiner `CLAUDE.md`.

## Ein Ticket anlegen

Nötig ist ein **Abnahmekriterium**: woran erkennt man, dass es fertig ist,
prüfbar formuliert. Fehlt es, ist es keine Aufgabe, sondern eine Notiz.

Die eine Ausnahme: **`status:triage` verlangt keines.** Das Abnahmekriterium
bindet beim *Verlassen* von Triage, nicht beim Anlegen — hineinwerfen darf man
jeden unfertigen Gedanken. Wer ein Ticket weiterzieht, muss sagen, woran man
erkennt, dass es fertig ist.

Triage ist ein **Wartezimmer, kein Archiv**. Vierzig Tickets darin sind eine
Notizhalde. Was zu groß für ein Ticket ist, gehört in die offenen Fragen des
Projekts; was ein Befund mit Quelle ist, in die Recherche-Ablage.

Beim Anlegen ableiten, was ableitbar ist — Bereichslabel aus dem genannten
Modul, weitere Label aus dessen Metadaten — und die Ableitung benennen. Nur
das Abnahmekriterium wird erfragt, wenn es sich nicht aus dem Auftrag ergibt.

Gehört das Ticket zu einem Bereich mit Tracking-Issue, wird es als
**Sub-Issue** dort eingehängt.

## Ein Ticket weiterziehen

**Achtung beim Umlabeln über die API:** Das `labels`-Feld **ersetzt** die
ganze Menge. Erst die bestehenden Label lesen, dann die vollständige neue
Liste schreiben — sonst fallen `blocked`, Bereichs- und Horizontlabel
stillschweigend weg.

## Ein Ticket beenden

- **Erledigt:** schließen als `completed`, `status:`-Label entfernen.
  „Erledigt" bekommt kein eigenes Label — das sagt der geschlossene Zustand,
  und ein Label daneben wäre die zweite Quelle.
- **Verworfen:** schließen als `not_planned`, Label `dropped` setzen, im
  Schließkommentar in einem Satz sagen, warum.
- Ist abzusehen, dass die Idee wiederkommt, gehört die Begründung in eine
  ADR und nicht nur in den Kommentar — sonst verwirft man sie zweimal.

## Suchen statt Board

GitHub-Projects-Spalten binden an ein Projektfeld, nicht an ein Label; ein
Board ist deshalb entweder Handarbeit oder eine Automatik mit eigenem Token.
Gespeicherte Suchen leisten dasselbe und sind über die API bedienbar:

| Frage | Suche |
|---|---|
| Was ist zu tun? | `is:open -label:tracking` |
| Was ist nicht begonnen? | `is:open label:"status:planned"` |
| Woran wird gearbeitet? | `is:open label:"status:spec","status:dev"` |
| Welche Fragen sind offen? | `is:open label:"status:research"` |
| Was ist blockiert? | `is:open label:blocked` |
| Was wurde verworfen? | `is:closed label:dropped` |

Die Anführungszeichen gehören dazu, sobald ein Doppelpunkt im Labelnamen
steckt.

## Ein neues Projekt aufsetzen

1. Label anlegen: die fünf `status:`, dazu `bug`, `infra`, `tracking`,
   `blocked`, `dropped`. Weitere Phasen nur, wenn das Projekt sie wirklich
   hat — jede zusätzliche ist eine, die gepflegt werden muss.
2. Bereichspräfix festlegen und in `CLAUDE.md` nennen.
3. Ungenutzte GitHub-Standardlabel löschen: `documentation`, `duplicate`,
   `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`,
   `wontfix`. `wontfix` sagt dasselbe wie `dropped` — zwei Wege für dieselbe
   Sache sind einer zu viel. `bug` bleibt.
4. Label je Namensraum einfärben, damit das Auge sie gruppiert.
5. Issue-Templates unter `.github/ISSUE_TEMPLATE/` anlegen: Aufgabe
   (`status:planned`), Idee (`status:triage`), Fehler (`bug`,
   `status:planned`).

## Projektspezifische Ergänzungen

Zusätzliche Phasen, zusätzliche Label und das Bereichspräfix stehen in der
`CLAUDE.md` des Projekts. Dieser Skill beschreibt nur den Kern, der überall
gleich ist — was ein einzelnes Projekt braucht, gehört nicht hierher.
