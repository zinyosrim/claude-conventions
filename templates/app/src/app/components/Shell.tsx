import { type ComponentChildren } from 'preact';
import { dict, lang, setLang, type Lang } from '../i18n/index.js';
import { navigate, pathFor, type Route } from '../lib/router.js';

/** Ein Link innerhalb der App: echte Adresse, aber ohne Neuladen. */
export function AppLink({
  to,
  class: cls,
  children,
}: {
  to: Route;
  class?: string;
  children: ComponentChildren;
}) {
  return (
    <a
      href={pathFor(to)}
      class={cls}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

const LANGS: Lang[] = ['de', 'en'];

function Footer() {
  const d = dict.value;
  return (
    <footer class="mt-auto border-t border-line px-4 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] text-sm text-muted">
      <div class="mx-auto flex max-w-2xl flex-wrap items-center gap-x-4">
        <AppLink to="imprint" class="flex min-h-11 items-center">
          {d.footer.imprint}
        </AppLink>
        <AppLink to="privacy" class="flex min-h-11 items-center">
          {d.footer.privacy}
        </AppLink>
        <div class="ml-auto flex" role="group" aria-label={d.footer.language}>
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              class={`min-h-11 min-w-11 font-bold uppercase ${lang.value === l ? 'text-ink' : 'text-muted'}`}
              aria-pressed={lang.value === l}
              onClick={() => setLang(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ComponentChildren }) {
  const d = dict.value;
  return (
    <div class="flex min-h-dvh flex-col">
      <header class="px-4 pt-[max(16px,env(safe-area-inset-top))] pb-2">
        <div class="mx-auto max-w-2xl">
          <AppLink to="home" class="text-lg font-extrabold text-ink">
            {d.app.name}
          </AppLink>
        </div>
      </header>
      <main class="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4">{children}</main>
      <Footer />
    </div>
  );
}
