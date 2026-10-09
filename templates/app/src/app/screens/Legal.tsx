import { dict } from '../i18n/index.js';
import { AppLink } from '../components/Shell.js';

/**
 * Impressum und Datenschutzerklärung, Texte unter `legal` in den i18n-Dateien
 * (Vorlage: claude-conventions/templates/legal). Die Datenschutzerklärung
 * beschreibt den heutigen Stand der App; speichert sie personenbezogene Daten,
 * wächst sie mit — vor größeren Änderungen juristisch prüfen lassen.
 */
function LegalPage({ page }: { page: 'imprint' | 'privacy' }) {
  const d = dict.value;
  const text = d.legal[page];
  return (
    <>
      <AppLink to="home" class="flex min-h-11 items-center self-start text-sm font-bold text-muted">
        ← {d.legal.back}
      </AppLink>
      <h1 class="text-2xl font-extrabold text-ink">{text.title}</h1>
      {d.legal.bindingNote && <p class="text-xs text-muted">{d.legal.bindingNote}</p>}
      <div class="flex flex-col gap-3 text-sm leading-relaxed text-muted">
        <p>{text.intro}</p>
        {text.sections.map((s) => (
          <section key={s.h}>
            <h2 class="pt-2 font-extrabold text-ink">{s.h}</h2>
            <p>
              {s.lines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>
    </>
  );
}

export function ImprintScreen() {
  return <LegalPage page="imprint" />;
}

export function PrivacyScreen() {
  return <LegalPage page="privacy" />;
}
