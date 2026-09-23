---
name: support-tickets
description: Support-Tickets von Kunden aus der Notion-Datenbank lesen, kategorisieren, beantworten und bei Bedarf als GitHub Issue weitergeben. Nutzen, wenn es um Support, Kundenanfragen, Kundentickets, das Support-Board oder „was haben die Kunden gemeldet" geht; auch bei support ticket, customer request, helpdesk. Nicht nutzen für interne Entwicklungs-Tickets — die führt der Skill issue-tracking.
---

# Support-Tickets in Notion

Kunden melden sich über eine Notion-Datenbank. Claude liest sie über den
Notion-MCP-Server, ordnet jedes Ticket ein und bearbeitet es. Welche
Datenbank es ist, steht in der `CLAUDE.md` des Projekts.

**Zwei Welten, eine Grenze.** Notion ist die Welt des Kunden, GitHub die
interne. Ein Support-Ticket wird nie selbst zur Entwicklungsaufgabe — es
*erzeugt* eine, und beide verweisen aufeinander.

## Voraussetzung

Der Notion-MCP-Server ist verbunden. Fehlt er, nicht improvisieren, sondern
sagen, dass er fehlt: lokal mit `claude mcp add`, in einer Web-Sitzung unter
claude.ai → Settings → Connectors.

## Die Felder

| Feld | Werte |
|---|---|
| **Status** | `Neu` → `In Bearbeitung` → `Wartet auf Kunde` → `Erledigt` |
| **Kategorie** | `Fehler`, `Frage`, `Wunsch` |
| **GitHub** | Link zum Issue, falls eines entsteht |

Heißen die Felder in einem Projekt anders, nennt die `CLAUDE.md` die
Zuordnung. Weitere Felder bleiben unangetastet.

## Ein Ticket bearbeiten

1. **Lesen**, samt Kommentaren. Ist es unklar, beim Kunden nachfragen und auf
   `Wartet auf Kunde` setzen, statt zu raten.
2. **Kategorisieren.**
   - `Fehler`: etwas Gebautes verhält sich anders als zugesagt.
   - `Frage`: es funktioniert, der Kunde weiß nicht wie.
   - `Wunsch`: etwas, das es nicht gibt.
3. **Bearbeiten nach Kategorie.**
   - `Frage`: direkt als Kommentar im Ticket beantworten, dann `Erledigt`.
   - `Fehler`: nachstellen. Lässt er sich nachstellen, GitHub Issue anlegen
     (`bug`, nach issue-tracking), Link ins Feld **GitHub**, Status
     `In Bearbeitung`. Lässt er sich nicht nachstellen, sagen, was geprüft
     wurde, und nachfragen.
   - `Wunsch`: GitHub Issue auf `status:triage`, Link ins Feld **GitHub**.
     Dem Kunden sagen, dass es aufgenommen ist — nicht, dass es kommt.
4. **Abschließen**, wenn das verknüpfte Issue geschlossen ist: dem Kunden in
   einem Satz sagen, was sich geändert hat, dann `Erledigt`.

## Antworten an den Kunden

- In der Sprache, in der das Ticket geschrieben ist.
- Kurz, konkret, ohne interne Begriffe (keine Issue-Nummern, Branch- oder
  Dateinamen).
- **Nichts zusagen, was nicht entschieden ist**, weder Termine noch Umfang.
  Eine Zusage an einen Kunden ist eine Entscheidung, und die trifft der
  Mensch.

## Datenschutz

Ein Support-Ticket enthält personenbezogene Daten, das GitHub Issue darf
das nicht. Ins Issue kommt das Verhalten, nicht die Person: keine Namen,
E-Mail-Adressen, Telefonnummern oder Screenshots mit Kundendaten. Der Link
zum Notion-Ticket genügt als Rückverweis.

## Was nicht ohne Rückfrage geschieht

- Ein Ticket löschen oder archivieren.
- Den Kunden auf etwas festlegen (Termin, Preis, Umfang).
- Mehr als einen Kommentar pro Ticket und Durchgang schreiben.

## Projektspezifische Ergänzungen

Die Datenbank, abweichende Feldnamen und zusätzliche Status stehen in der
`CLAUDE.md` des Projekts, nicht hier.
