/**
 * Eine neue Version, während die App läuft (Vorbild SailRanker, `Hinweise.tsx`). Die installierte
 * App auf dem iPhone wird meist aus dem Hintergrund geholt, nicht neu geladen: kein Seitenaufruf,
 * also weder frisches HTML noch eine Prüfung auf einen neuen Service Worker. Alter Code lief so
 * weiter, bis jemand die App ganz schloss.
 *
 * Deshalb fragt die App bei jeder Rückkehr in den Vordergrund `/version.json` ab
 * (vite.config.ts) und vergleicht mit dem Build, mit dem sie startete. Weicht er ab:
 * - 15 Minuten oder länger weg und seither nichts angefasst oder getippt: still neu laden, das
 *   sieht aus wie ein normaler Start;
 * - sonst schaltet `updateReady` ein, und die Shell bietet „Neu laden“ an (UpdateNotice). Mitten
 *   in der Benutzung neu zu laden, nähme Eingetipptes weg.
 * Still neu geladen wird höchstens einmal je Build und Sitzung, damit altes HTML aus einem Cache
 * keine Schleife auslöst.
 */
import { signal } from '@preact/signals';
import { buildIdOf } from '../../shared/version.js';

/**
 * Die Kennung aus dem laufenden Dokument. Beim Start lesen, bevor ein nachgeladener Teil ein
 * eigenes `<link>` einhängt; im Entwicklungsserver leer, dann wird nichts geprüft.
 */
function buildIdOfDocument(doc: Document): string {
  const refs: string[] = [];
  for (const el of doc.querySelectorAll('script[src], link[href]')) {
    const v = el.getAttribute('src') ?? el.getAttribute('href');
    if (v !== null) refs.push(v);
  }
  return buildIdOf(refs);
}

export const updateReady = signal(false);

const QUIET_AFTER_MS = 15 * 60 * 1000;
const PAUSE_MS = 60 * 1000;
const RELOADED_KEY = 'update-reloaded';

async function servedId(): Promise<string | null> {
  try {
    const res = await fetch('/version.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const body = (await res.json()) as { id?: unknown };
    return typeof body.id === 'string' && body.id !== '' ? body.id : null;
  } catch {
    return null;
  }
}

/** Steht etwas Getipptes im Feld? Dann nie still neu laden. */
function typing(): boolean {
  const el = document.activeElement;
  return (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.value !== '';
}

function quietReload(id: string): boolean {
  try {
    if (sessionStorage.getItem(RELOADED_KEY) === id) return false;
    sessionStorage.setItem(RELOADED_KEY, id);
  } catch {
    return false;
  }
  location.reload();
  return true;
}

/** Startet die Prüfung; einmal beim Start der App aufrufen. */
export function watchForUpdates() {
  const startId = buildIdOfDocument(document);
  // Entwicklungsserver: nichts gebaut, nichts zu vergleichen.
  if (startId === '') return;
  let awaySince: number | null = null;
  let last = 0;
  let touched = false;

  async function check(awayMs: number) {
    const now = Date.now();
    if (now - last < PAUSE_MS) return;
    last = now;
    // Den Service Worker mit anstoßen: von selbst sieht er nur beim Seitenaufruf nach.
    void navigator.serviceWorker
      ?.getRegistration()
      .then((r) => r?.update())
      .catch(() => undefined);
    const id = await servedId();
    if (id === null || id === startId) return;
    if (awayMs >= QUIET_AFTER_MS && !touched && !typing() && quietReload(id)) return;
    updateReady.value = true;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      awaySince = Date.now();
      return;
    }
    const away = awaySince === null ? 0 : Date.now() - awaySince;
    awaySince = null;
    touched = false;
    void check(away);
  });
  for (const e of ['pointerdown', 'keydown', 'scroll'] as const) {
    window.addEventListener(e, () => (touched = true), { capture: true, passive: true });
  }
  // Einmal kurz nach dem Start: Das HTML kam vielleicht aus dem Cache (Netz zu langsam).
  setTimeout(() => void check(0), 10_000);
}
