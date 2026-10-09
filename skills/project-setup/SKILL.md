---
name: project-setup
description: Ein neues Projekt nach dem Standard-Stack aufsetzen — Repo unter ~/Dev, Cloudflare-Deploy über GitHub, de/en, Mobile first, DSGVO, Support in Notion, Entwicklung als GitHub Issues. Nur auf ausdrücklichen Aufruf (/project-setup).
disable-model-invocation: true
---

# Ein Projekt aufsetzen

Legt ein Projekt so an, dass es ab dem ersten Push deployt, zweisprachig ist
und die Konventionen aus `claude-conventions` mitbringt. Die Konventionen
liegen lokal unter `~/Dev/claude-conventions`; fehlt der Ordner, erst
klonen.

Die festen Schritte macht `scripts/new-project.sh`. Der Skill fragt, ruft das
Skript, füllt, was Urteil braucht, und begleitet die Schritte, die nur der
Nutzer machen kann.

## 0. Vorbedingungen prüfen

Vor der Frage an den Nutzer, damit alles Fehlende in einem Rutsch kommt:

- `gh auth status` muss den Scope `project` zeigen. Sonst den Nutzer bitten,
  `gh auth refresh -s project` auszuführen: Enter, Code im Browser eingeben,
  „Authorize“. Im Terminal-Bereich der Claude-App wartet `gh` an der ersten
  Frage auf Enter — darauf hinweisen.
- `security find-generic-password -s cloudflare-workers-token` (ohne `-w`,
  also ohne den Wert zu lesen) zeigt, ob der Cloudflare-Token im Schlüsselbund
  liegt. Fehlt er, siehe 4.
- **Dateien aus `~/Downloads`** kann die Claude-App nicht lesen; macOS sperrt
  den Ordner, und eine Freigabe für die Sitzung hilft nicht. Den Nutzer bitten,
  Unterlagen nach `~/Dev` zu ziehen oder in den Chat zu kopieren. Nicht zu
  „Festplattenvollzugriff“ raten.

## 1. Erfragen

Nur das, was sich nicht ableiten lässt, in einer Frage:

- **Name** (wird Repo-, Ordner- und Worker-Name, kebab-case) und Anzeigename
- **Art:** Website (Astro) oder App (Vite + Preact + Worker-API) — aus einem
  Briefing meist ableitbar, dann nicht fragen, sondern nennen
- **Domain** — „noch keine“ ist eine gültige Antwort
- **Notion-Datenbank** für Support, falls schon vorhanden
- **Rechtstexte:** Anbieterangaben aus `templates/legal/` (Dual Citizen)
  oder andere

`area:` ist das Bereichspräfix, solange der Nutzer nichts anderes sagt.

## 2. Skript

```sh
~/Dev/claude-conventions/scripts/new-project.sh <name> "<Anzeigename>" <app|website> [domain]
```

Es bricht ab, bevor es etwas anlegt, wenn der Ordner nicht leer ist, das Repo
existiert oder ein Werkzeug fehlt. Es legt an: Ordner, Git, privates Repo,
Gerüst, Konventionen (Skills, Issue-Vorlagen, Deploy, `CLAUDE.md`, `docs/`,
`.vscode/` mit freier Farbe und freiem Port), Label, GitHub Project
(verknüpft, Nummer in der `CLAUDE.md`), Secret `CLOUDFLARE_ACCOUNT_ID`.
Bei einer App zusätzlich: Impressum und Datenschutz mit den Texten aus
`templates/legal/`, Test, Build, Playwright-Chromium. Ohne Domain läuft das
Projekt unter `<name>.zinyosrim.workers.dev` mit `noindex`.

Zum Schluss listet es alles, was noch offen ist. Das ist die Liste für 3.

## 3. Füllen

- **Platzhalter** `__TAGLINE__`, `__INTRO__` (App) in beiden Sprachen — aus dem
  Gespräch oder Briefing, nichts erfinden.
- **`CLAUDE.md`:** jeden `<…>`-Platzhalter ersetzen, die nicht zutreffende
  Stack-Variante löschen, Projekteigenes unter „Eigenheiten“. Kein Platzhalter
  bleibt stehen.
- **`docs/vision.md`** mit dem ersten Satz aus dem Gespräch, den Rest der
  Doku-Vorlagen unverändert lassen. Mitgebrachte Unterlagen nach
  `docs/README.md` einordnen (ein Briefing ohne Abnahmekriterien ist
  `research/`, keine Spec).
- **Website:** Tailwind ist eingebunden; dazu `i18n: { defaultLocale: "de",
  locales: ["de", "en"] }` in `astro.config.mjs`, Seiten unter `src/pages/`
  und `src/pages/en/`, Impressum und Datenschutz aus `templates/legal/`,
  Test auf gleiche Schlüssel, Playwright mit 390 px als erstem Projekt,
  `wrangler.toml` wie in `templates/app/`.
- **Rechtstexte** anders als Dual Citizen: Inhalt mit dem Nutzer klären;
  nichts erfinden, was eine Rechtsaussage ist.
- **D1** erst mit dem ersten Datenmodell (`wrangler d1 create <name>`).

Danach `pnpm lint`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.

## 4. Cloudflare — macht der Nutzer

Claude sagt an und wartet; Tokens trägt Claude nie selbst ein.

**Token**, einmal für alle Projekte: dash.cloudflare.com/profile/api-tokens →
Vorlage „Edit Cloudflare Workers“, dazu **D1: Edit**; Account Resources: der
Account; Zone Resources: **All zones from an account**. Dann im Schlüsselbund
speichern (fragt nach dem Wert):

```sh
security add-generic-password -a "$USER" -s cloudflare-workers-token -w
```

Je Projekt setzt der Nutzer ihn mit einem Befehl, den das Skript ausgibt:

```sh
gh secret set CLOUDFLARE_API_TOKEN --repo zinyosrim/<name> --body "$(security find-generic-password -s cloudflare-workers-token -w)"
```

**Domain**, falls es eine gibt:
1. Domain bei Cloudflare hinzufügen (Free-Plan); Cloudflare nennt zwei
   Nameserver.
2. Bei Spaceship die Nameserver darauf umstellen. Spaceship bleibt
   Registrar, DNS lebt ab jetzt bei Cloudflare.

## 5. Erster Deploy

Committen, pushen, den Deploy-Lauf abwarten (`gh run watch`), dann die
Adresse im Browser-Bereich bei 390 px öffnen und beide Sprachen prüfen,
Impressum und Datenschutz eingeschlossen. Erst dann ist das Projekt
aufgesetzt.

## 6. Notion prüfen

Ist der Notion-MCP-Server verbunden und gibt es eine Support-Datenbank, sie
einmal lesen und bestätigen, dass die Felder aus `support-tickets` vorhanden
sind. Fehlende Felder dem Nutzer nennen, nicht selbst anlegen.

## Abschluss

In drei Zeilen berichten: URL, Repo, was offen ist (Domain, Rechtstexte,
Notion).

## Wenn etwas hakt

- `gh project create` scheitert in gh 2.87 an einem GraphQL-Fehler — das
  Skript nimmt deshalb die Mutation `createProjectV2` direkt.
- TypeScript bleibt bei der neuesten Version, die `typescript-eslint`
  unterstützt (Stand Oktober 2026: 6.0, nicht 7).
- Fehlen Playwright-Browser nach einem Update: `pnpm exec playwright install chromium`.
