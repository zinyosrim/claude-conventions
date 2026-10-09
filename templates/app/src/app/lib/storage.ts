/**
 * Einstellungen je Gerät in localStorage. Jeder Zugriff ist abgesichert —
 * privates Surfen und gesperrte Browser werfen.
 */
const PREFIX = '__NAME__.';

export function readStored(name: string): string | null {
  try {
    return localStorage.getItem(PREFIX + name);
  } catch {
    return null;
  }
}

export function writeStored(name: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + name, value);
  } catch {
    /* ignore */
  }
}
