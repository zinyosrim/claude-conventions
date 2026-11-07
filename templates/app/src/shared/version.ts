/**
 * Welche Fassung der App läuft, welche ist ausgeliefert? Die Kennung eines Builds sind die Namen
 * seiner JS- und CSS-Dateien: Vite hängt einen Hash des Inhalts an, eine Änderung am Code ändert
 * also die Kennung. Dieselbe Funktion liest beim Build das fertige index.html (daraus wird
 * /version.json, vite.config.ts) und in der laufenden App das Dokument, mit dem sie startete.
 */

/** Nur die gehashten Code-Dateien; Icons, Schriften und Manifest zählen nicht. */
const ASSET = /^\/assets\/[^?#]+\.(?:js|css)$/;

export function buildIdOf(refs: readonly string[]): string {
  return [...new Set(refs.filter((r) => ASSET.test(r)))].sort().join(' ');
}

/** Die Kennung aus dem Text von index.html (beim Build). */
export function buildIdOfHtml(html: string): string {
  return buildIdOf([...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map((m) => m[1]!));
}
