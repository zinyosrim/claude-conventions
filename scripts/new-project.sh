#!/usr/bin/env bash
# Die mechanischen Schritte von /project-setup in einem Lauf: Repo, Gerüst,
# Konventionen, VS Code, Label, GitHub Project, Account-ID als Secret.
# Was Urteil braucht (Texte, CLAUDE.md, Rechtsfragen), bleibt beim Skill.
#
#   scripts/new-project.sh <name> <titel> <app|website> [domain]
#
#   name    kebab-case, wird Ordner-, Repo- und Worker-Name
#   titel   Anzeigename, z. B. "Hängerplanung"
#   domain  leer lassen, solange es keine gibt: dann workers.dev und noindex
#
# Umgebungsvariablen:
#   OFFLINE=1           nur lokal (kein GitHub, kein Cloudflare) — zum Ausprobieren
#   PROJECT_DIR         Zielordner, Standard ~/Dev/<name>
#   GH_OWNER            Standard zinyosrim
#   WORKERS_SUBDOMAIN   Standard zinyosrim (<name>.<subdomain>.workers.dev)
#
# Das Skript committet nicht; der erste Commit gehört zum Skill (Schritt „Erster Deploy“).
set -euo pipefail

die() { printf '✗ %s\n' "$*" >&2; exit 1; }
step() { printf '\n▸ %s\n' "$*"; }

[ $# -ge 3 ] || die "Aufruf: $0 <name> <titel> <app|website> [domain]"
NAME=$1 TITLE=$2 ART=$3 DOMAIN=${4:-}
C=$(cd "$(dirname "$0")/.." && pwd)
OWNER=${GH_OWNER:-zinyosrim}
WORKERS_SUBDOMAIN=${WORKERS_SUBDOMAIN:-zinyosrim}
DIR=${PROJECT_DIR:-$HOME/Dev/$NAME}
OFFLINE=${OFFLINE:-0}
export NAME TITLE DOMAIN WORKERS_SUBDOMAIN TODAY=$(date +%F)

# ---- Vorbedingungen: alles prüfen, bevor irgendetwas angelegt wird -------------
[[ $NAME =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || die "Name muss kebab-case sein: $NAME"
[[ $ART == app || $ART == website ]] || die "Art muss app oder website sein: $ART"
for t in git jq pnpm python3; do command -v $t >/dev/null || die "$t fehlt"; done
if [ -d "$DIR" ]; then
  [ -e "$DIR/.git" ] && die "$DIR ist schon ein Git-Repo"
  [ -z "$(ls -A "$DIR" | grep -v '^.DS_Store$' || true)" ] || die "$DIR ist nicht leer"
fi
if [ "$OFFLINE" != 1 ]; then
  command -v gh >/dev/null || die "gh fehlt"
  gh auth status 2>&1 | grep -q "'project'" ||
    die "dem gh-Token fehlt die Berechtigung project — im Terminal: gh auth refresh -s project"
  gh repo view "$OWNER/$NAME" >/dev/null 2>&1 && die "Repo $OWNER/$NAME gibt es schon"
fi

# ---- Repo ------------------------------------------------------------------------
step "Repo $DIR"
mkdir -p "$DIR" && cd "$DIR"
git init -q -b main
[ "$OFFLINE" = 1 ] || gh repo create "$OWNER/$NAME" --private --source . --remote origin >/dev/null

# ---- Gerüst ----------------------------------------------------------------------
step "Gerüst ($ART)"
if [ "$ART" = app ]; then
  cp -R "$C/templates/app/." .
  for l in de en; do
    f=src/app/i18n/$l.json
    jq -s '.[0] * .[1]' "$f" "$C/templates/legal/$l.json" >"$f.tmp" && mv "$f.tmp" "$f"
  done
  python3 - <<'EOF'
import os, pathlib, re
env = os.environ
tokens = {
    '__NAME__': env['NAME'], '__TITLE__': env['TITLE'], '__DATE__': env['TODAY'],
    '__WORKERS_SUBDOMAIN__': env['WORKERS_SUBDOMAIN'],
}
for p in pathlib.Path('.').rglob('*'):
    if p.is_file() and '.git' not in p.parts:
        s = p.read_text()
        t = s
        for k, v in tokens.items():
            t = t.replace(k, v)
        if t != s:
            p.write_text(t)
if env['DOMAIN']:
    w = pathlib.Path('wrangler.toml')
    s = re.sub(r'# Noch keine eigene Domain:.*?\n# routes = .*?\n',
               'routes = [{ pattern = "%s", custom_domain = true }]\n' % env['DOMAIN'],
               w.read_text(), flags=re.S)
    w.write_text(s)
    pathlib.Path('public/_headers').unlink()
EOF
else
  pnpm create astro@latest . --template minimal --no-install --no-git --no-ai --skip-houston --yes >/dev/null
  printf '.claude/\n.github/\ndocs/\n' >>.prettierignore
fi

# ---- Konventionen ------------------------------------------------------------------
step "Konventionen"
mkdir -p .claude/skills .github/ISSUE_TEMPLATE .github/workflows .vscode
cp -R "$C/skills/issue-tracking" "$C/skills/support-tickets" .claude/skills/
cp "$C"/templates/ISSUE_TEMPLATE/*.yml .github/ISSUE_TEMPLATE/
cp "$C/templates/deploy.yml" .github/workflows/deploy.yml
cp "$C/templates/CLAUDE.md" CLAUDE.md
cp -R "$C/templates/docs" docs
cp "$C"/templates/vscode/*.json .vscode/

# ---- VS Code: Titelleiste in einer freien Farbe, nächster freier Live-Server-Port --
step "VS Code"
python3 - "$ART" <<'EOF'
import colorsys, glob, os, re, sys
art = sys.argv[1]
home = os.path.expanduser('~/Dev')
here = os.path.realpath('.')
others = [f for f in glob.glob(f'{home}/*/.vscode/settings.json')
          if os.path.realpath(os.path.dirname(os.path.dirname(f))) != here]
text = ''.join(open(f, errors='ignore').read() for f in others)

# Farbtöne der anderen Projekte; der neue liegt möglichst weit von allen weg.
hues = []
for h in re.findall(r'"titleBar\.activeBackground"\s*:\s*"#([0-9a-fA-F]{6})', text):
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    hue, light, sat = colorsys.rgb_to_hls(r, g, b)
    if sat > 0.15:
        hues.append(hue * 360)
dist = lambda a, b: min(abs(a - b), 360 - abs(a - b))
hue = max(range(0, 360, 5), key=lambda c: min((dist(c, h) for h in hues), default=180))
def hexcolor(l, s=0.65):
    return '#%02x%02x%02x' % tuple(round(x * 255) for x in colorsys.hls_to_rgb(hue / 360, l, s))
active, inactive = hexcolor(0.42), hexcolor(0.22)

ports = [int(p) for p in re.findall(r'"liveServer\.settings\.port"\s*:\s*(\d+)', text)]
port = 5502
while port in ports:
    port += 1

p = '.vscode/settings.json'
s = open(p).read()
s = re.sub(r'("titleBar\.activeForeground":\s*)"[^"]*"', r'\1"#ffffff"', s)
s = re.sub(r'("titleBar\.activeBackground":\s*)"[^"]*"', rf'\1"{active}"', s)
s = re.sub(r'("titleBar\.inactiveBackground":\s*)"[^"]*"', rf'\1"{inactive}"', s)
s = re.sub(r'("liveServer\.settings\.port":\s*)\d+', rf'\g<1>{port}', s)
if art == 'app':
    s = re.sub(r',\s*"tailwindCSS\.includeLanguages":\s*\{[^}]*\}', '', s)
    s = re.sub(r'\s*"\*\*/\.astro": true,', '', s)
    e = '.vscode/extensions.json'
    open(e, 'w').write(re.sub(r'\s*"astro-build\.astro-vscode",', '', open(e).read()))
open(p, 'w').write(s)
print(f'  Titelleiste {active} (inaktiv {inactive}), Live-Server-Port {port}')
EOF

# ---- Abhängigkeiten und erster Prüflauf ------------------------------------------------
step "Abhängigkeiten"
pnpm install --silent
if [ "$ART" = app ]; then
  pnpm exec playwright install chromium >/dev/null
  pnpm exec prettier --write . >/dev/null
  pnpm test >/dev/null && pnpm build >/dev/null && echo "  Test und Build grün"
else
  pnpm astro add tailwind --yes >/dev/null
fi

# ---- GitHub: Label, Project ---------------------------------------------------------
if [ "$OFFLINE" != 1 ]; then
  step "Label"
  jq -r '.[] | [.name, .color, .description] | @tsv' "$C/templates/labels.json" |
    while IFS=$'\t' read -r n col desc; do
      gh label create "$n" --color "$col" --description "$desc" --force >/dev/null
    done
  for l in documentation duplicate enhancement "good first issue" "help wanted" \
           invalid question wontfix accessibility; do
    gh label delete "$l" --yes >/dev/null 2>&1 || true
  done

  # `gh project create` scheitert in gh 2.87 an einem GraphQL-Fehler; die Mutation
  # direkt legt das Project an und verknüpft es im selben Schritt mit dem Repo.
  step "GitHub Project"
  read -r PNUM PURL < <(gh api graphql \
    -f query='mutation($o:ID!,$r:ID!,$t:String!){createProjectV2(input:{ownerId:$o,repositoryId:$r,title:$t}){projectV2{number url}}}' \
    -f o="$(gh api "users/$OWNER" --jq .node_id)" \
    -f r="$(gh api "repos/$OWNER/$NAME" --jq .node_id)" \
    -f t="$TITLE" --jq '.data.createProjectV2.projectV2 | "\(.number) \(.url)"')
  echo "  Nummer $PNUM: $PURL"
  export PNUM PURL
  python3 - <<'EOF'
import os
s = open('CLAUDE.md').read()
s = s.replace('<Nummer/URL>', f'„{os.environ["TITLE"]}", Nummer {os.environ["PNUM"]}:\n  {os.environ["PURL"]}')
open('CLAUDE.md', 'w').write(s)
EOF

  step "Cloudflare"
  ACCOUNTS=$(pnpm dlx wrangler@4 whoami 2>/dev/null | grep -oE '\b[0-9a-f]{32}\b' | sort -u || true)
  if [ "$(printf '%s\n' "$ACCOUNTS" | grep -c .)" = 1 ]; then
    gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$OWNER/$NAME" --body "$ACCOUNTS" >/dev/null
    echo "  CLOUDFLARE_ACCOUNT_ID gesetzt"
  else
    echo "  Account-ID nicht eindeutig (wrangler whoami) — von Hand setzen"
  fi
fi
python3 - <<'EOF'
import os
s = open('CLAUDE.md').read()
open('CLAUDE.md', 'w').write(s.replace('<Projektname>', os.environ['TITLE']))
EOF

# ---- Was offen ist -----------------------------------------------------------------
step "Offen"
grep -rnoE '__[A-Z_]+__' --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist . |
  sed 's/^/  Platzhalter: /' || true
grep -noE '<[^>`]+>' CLAUDE.md | grep -vE '<id>|<html lang>' | sed 's/^/  CLAUDE.md: /' || true
if [ "$OFFLINE" != 1 ]; then
  # Nur prüfen, ob der Eintrag existiert — ohne -w wird der Wert nicht gelesen.
  if security find-generic-password -s cloudflare-workers-token >/dev/null 2>&1; then
    echo "  Token liegt im Schlüsselbund. Der Nutzer setzt ihn selbst:"
  else
    echo "  Kein Token im Schlüsselbund. Einmalig anlegen (Vorlage „Edit Cloudflare Workers“ + D1 Edit,"
    echo "  All zones from an account) und speichern:"
    echo "    security add-generic-password -a \"\$USER\" -s cloudflare-workers-token -w"
    echo "  Danach setzt der Nutzer ihn selbst:"
  fi
  echo "    gh secret set CLOUDFLARE_API_TOKEN --repo $OWNER/$NAME --body \"\$(security find-generic-password -s cloudflare-workers-token -w)\""
fi
