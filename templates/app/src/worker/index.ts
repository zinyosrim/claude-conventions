import { type Env } from './env.js';

export { type Env } from './env.js';

export default {
  fetch(request, env): Response | Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      return Response.json({ ok: true });
    }
    if (url.pathname.startsWith('/api/')) {
      return Response.json({ error: 'not found' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
