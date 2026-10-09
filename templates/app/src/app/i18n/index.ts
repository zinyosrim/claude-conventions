import { computed, effect, signal } from '@preact/signals';
import { readStored, writeStored } from '../lib/storage.js';
import de from './de.json';
import en from './en.json';

export type Lang = 'de' | 'en';
export type Dict = typeof de;
const DICTS: Record<Lang, Dict> = { de, en };

const STORAGE_KEY = 'lang';

/** Gespeicherte Wahl, sonst die Browsersprache; Deutsch ist Standard. */
function detect(): Lang {
  const stored = readStored(STORAGE_KEY);
  if (stored === 'de' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de';
}

export const lang = signal<Lang>(detect());
export const dict = computed(() => DICTS[lang.value]);

effect(() => {
  document.documentElement.lang = lang.value;
});

export function setLang(l: Lang): void {
  lang.value = l;
  writeStored(STORAGE_KEY, l);
}
