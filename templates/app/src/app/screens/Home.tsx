import { dict } from '../i18n/index.js';

export function HomeScreen() {
  const d = dict.value;
  return (
    <>
      <p class="self-start rounded-full bg-accent px-3 py-1 text-xs font-bold text-on-accent">
        {d.home.status}
      </p>
      <h1 class="text-3xl leading-tight font-extrabold text-ink">{d.app.tagline}</h1>
      <p class="leading-relaxed text-muted">{d.home.intro}</p>
    </>
  );
}
