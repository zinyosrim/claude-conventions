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

## 1. Erfragen

Nur das, was sich nicht ableiten lässt, in einer Frage:

- **Name** (wird Repo-, Ordner- und Worker-Name, kebab-case) — entfällt, wenn der aktuelle Ordner es schon sagt, siehe 2.
- **Art:** Website (Astro) oder App (Vite + Preact + Worker-API)
- **Domain**
- **Notion-Datenbank** für Support, falls schon vorhanden
- **Bereichspräfix** für Tickets (`area:` ist der Standard)

## 2. Repo

Läuft Claude schon in einem leeren Ordner unter `~/Dev`, ist das der
Projektordner und sein Name der Projektname — dann nicht danach fragen.
Sonst den Ordner anlegen. Ist der Ordner nicht leer oder schon ein
Git-Repo, anhalten und nachfragen.

```sh
mkdir -p ~/Dev/<name> && cd ~/Dev/<name>
git init -b main
gh repo create zinyosrim/<name> --private --source . --remote origin
```

## 3. Gerüst

- **Website:** `pnpm create astro@latest . -- --template minimal --typescript strict`,
  dann Tailwind und in `astro.config.mjs` `i18n: { defaultLocale: "de", locales: ["de", "en"] }`.
  Seiten unter `src/pages/` (de) und `src/pages/en/`.
- **App:** Vite + Preact + Tailwind + `vite-plugin-pwa`. Worker unter
  `src/worker/`, Frontend unter `src/app/`, Texte unter `src/app/i18n/de.json`
  und `en.json`. Vorbild: `windstation`.

Beide:

- `wrangler.toml` mit `name`, `compatibility_date` von heute, `[assets]`
  und `routes = [{ pattern = "<domain>", custom_domain = true }]`.
  Bei einer App zusätzlich `main` und, wenn Daten nötig sind, eine D1-Datenbank
  (`wrangler d1 create <name>`).
- Test, der prüft, dass `de` und `en` dieselben Schlüssel haben.
- Seiten **Impressum** und **Datenschutz** in beiden Sprachen, im Footer
  verlinkt. Inhalt mit dem Nutzer klären; nichts erfinden, was eine
  Rechtsaussage ist.
- Playwright-Konfiguration mit mobilem Viewport (390 px) als erstem Projekt.
- Scripts `dev`, `build`, `test`, `test:e2e` in `package.json`.

## 4. Konventionen übernehmen

```sh
C=~/Dev/claude-conventions
mkdir -p .claude/skills .github/ISSUE_TEMPLATE .github/workflows .vscode
cp -r $C/skills/issue-tracking $C/skills/support-tickets .claude/skills/
cp $C/templates/ISSUE_TEMPLATE/*.yml .github/ISSUE_TEMPLATE/
cp $C/templates/deploy.yml .github/workflows/deploy.yml
cp $C/templates/CLAUDE.md CLAUDE.md
cp -r $C/templates/docs docs
cp $C/templates/vscode/*.json .vscode/
```

`CLAUDE.md` ausfüllen: Platzhalter ersetzen, die nicht zutreffende
Stack-Variante löschen. Kein Platzhalter bleibt stehen.

`.vscode/settings.json` anpassen:

- **Titelleiste:** eine Farbe, die noch kein anderes Projekt unter `~/Dev`
  hat (`grep -h activeBackground ~/Dev/*/.vscode/settings.json`).
  `inactiveBackground` ist dieselbe Farbe deutlich dunkler;
  `activeForeground` schwarz oder weiß, je nachdem, was lesbarer ist.
- **Live-Server-Port:** der nächste freie ab 5502
  (`grep -h liveServer.settings.port ~/Dev/*/.vscode/settings.json`).
- Bei einer App den Eintrag `tailwindCSS.includeLanguages` für Astro löschen.

`docs/vision.md` mit dem ersten Satz aus dem Gespräch füllen, den Rest der
Doku-Vorlagen unverändert lassen.

Label anlegen und Standardlabel löschen wie in der README von
`claude-conventions`, Schritte 3 und 4.

## 5. GitHub Project

```sh
gh project create --owner zinyosrim --title "<Name>"
gh project link <nummer> --owner zinyosrim --repo zinyosrim/<name>
```

Nummer und URL in die `CLAUDE.md`.

## 6. Cloudflare und Domain

Diese Schritte macht der Nutzer; Claude sagt sie an und wartet:

1. **Domain bei Cloudflare hinzufügen** (Free-Plan). Cloudflare nennt zwei
   Nameserver.
2. **Bei Spaceship** die Nameserver der Domain auf diese beiden umstellen.
   Spaceship bleibt Registrar, DNS lebt ab jetzt bei Cloudflare.
3. **API-Token** anlegen (Vorlage „Edit Cloudflare Workers“) und zusammen mit
   der Account-ID als Repo-Secret setzen:
   ```sh
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID
   ```

## 7. Erster Deploy

Committen, pushen, den Deploy-Lauf abwarten
(`gh run watch`), dann die Domain auf dem Handy-Viewport öffnen und beide
Sprachen prüfen. Erst dann ist das Projekt aufgesetzt.

## 8. Notion prüfen

Ist der Notion-MCP-Server verbunden, die Support-Datenbank einmal lesen und
bestätigen, dass die Felder aus `support-tickets` vorhanden sind. Fehlende
Felder dem Nutzer nennen, nicht selbst anlegen.

## Abschluss

In drei Zeilen berichten: URL, Repo, was offen ist (fehlende Rechtstexte,
Nameserver noch nicht umgestellt, Notion nicht verbunden).
