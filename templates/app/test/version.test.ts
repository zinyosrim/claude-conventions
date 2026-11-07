import { describe, expect, it } from 'vitest';
import { buildIdOf, buildIdOfHtml } from '../src/shared/version.js';

/** Die Kennung eines Builds für die Update-Prüfung (src/app/lib/update.ts). */
describe('build id', () => {
  it('is the hashed code files, sorted, once', () => {
    expect(
      buildIdOf(['/assets/b-2.css', '/icons/icon.svg', '/assets/a-1.js', '/assets/b-2.css']),
    ).toBe('/assets/a-1.js /assets/b-2.css');
  });

  it('reads the same from the built index.html', () => {
    const html = `<link rel="icon" href="/icons/icon.svg">
      <script type="module" crossorigin src="/assets/index-AB12.js"></script>
      <link rel="stylesheet" crossorigin href="/assets/index-CD34.css">`;
    expect(buildIdOfHtml(html)).toBe('/assets/index-AB12.js /assets/index-CD34.css');
  });

  it('is empty without built files (dev server)', () => {
    expect(buildIdOfHtml('<script type="module" src="/src/app/main.tsx"></script>')).toBe('');
  });
});
