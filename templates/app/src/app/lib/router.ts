import { signal } from '@preact/signals';

export type Route = 'home' | 'imprint' | 'privacy';

const PATHS: Record<Route, string> = {
  home: '/',
  imprint: '/impressum',
  privacy: '/datenschutz',
};

function fromPath(path: string): Route {
  return (Object.keys(PATHS) as Route[]).find((r) => PATHS[r] === path) ?? 'home';
}

export const route = signal<Route>(fromPath(location.pathname));

export function pathFor(r: Route): string {
  return PATHS[r];
}

export function navigate(r: Route): void {
  if (route.value === r) return;
  history.pushState(null, '', PATHS[r]);
  route.value = r;
  window.scrollTo({ top: 0 });
}

window.addEventListener('popstate', () => {
  route.value = fromPath(location.pathname);
});
