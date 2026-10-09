import { describe, expect, it } from 'vitest';
import de from '../src/app/i18n/de.json';
import en from '../src/app/i18n/en.json';

/** Alle Schlüsselpfade, Listen eingeschlossen: `legal.imprint.sections[0].lines[2]`. */
function keys(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) return obj.flatMap((v, i) => keys(v, `${prefix}[${i}]`));
  if (typeof obj !== 'object' || obj === null) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

function leaves(obj: unknown, prefix = ''): [string, unknown][] {
  if (Array.isArray(obj)) return obj.flatMap((v, i) => leaves(v, `${prefix}[${i}]`));
  if (typeof obj !== 'object' || obj === null) return [[prefix, obj]];
  return Object.entries(obj).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
}

function placeholders(s: unknown): string[] {
  return typeof s === 'string' ? [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]!).sort() : [];
}

describe('i18n', () => {
  it('de und en haben dieselben Schlüssel', () => {
    expect(keys(en).sort()).toEqual(keys(de).sort());
  });

  it('jeder Text hat in beiden Sprachen dieselben Platzhalter', () => {
    const enMap = new Map(leaves(en));
    for (const [k, v] of leaves(de)) {
      expect(placeholders(enMap.get(k)), k).toEqual(placeholders(v));
    }
  });
});
