/**
 * Workers owns request routing while Cloudflare's asset binding serves the Vite
 * build. `single-page-application` in wrangler.jsonc sends client-side routes
 * back to index.html, allowing TanStack Router to resolve them in the browser.
 */
export default {
  fetch(request, env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
