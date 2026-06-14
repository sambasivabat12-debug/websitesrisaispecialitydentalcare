export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // HTML must always revalidate so deploys show immediately (no stale cache)
    const htmlHeaders = (src, forceType) => {
      const h = new Headers(src ? src.headers : undefined);
      h.set('Cache-Control', 'no-cache, must-revalidate');
      if (forceType) h.set('Content-Type', 'text/html; charset=UTF-8');
      return h;
    };

    // Handle homepage
    if (path === '/' || path === '') {
      const r = await env.ASSETS.fetch(
        new Request(new URL('/index.html', url).toString())
      );
      return new Response(r.body, { status: r.status, statusText: r.statusText, headers: htmlHeaders(r) });
    }

    // Route blog posts to post-template.html
    if (path.startsWith('/blog/') &&
        !path.match(/\.[a-zA-Z0-9]+$/) &&
        path !== '/blog/' &&
        path !== '/blog') {

      const templateUrl = new URL('/blog/post-template.html', url).toString();
      let resp = await env.ASSETS.fetch(new Request(templateUrl));

      if (resp.status >= 300 && resp.status < 400) {
        const loc = resp.headers.get('Location');
        if (loc) resp = await env.ASSETS.fetch(
          new Request(new URL(loc, url).toString())
        );
      }

      return new Response(resp.body, { status: 200, headers: htmlHeaders(null, true) });
    }

    // Static assets (images, fonts, css, js) get a long immutable cache
    const assetResp = await env.ASSETS.fetch(request);
    if (/\.(webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|css|js|mp4|webm|avif)$/i.test(path)) {
      const h = new Headers(assetResp.headers);
      h.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(assetResp.body, { status: assetResp.status, statusText: assetResp.statusText, headers: h });
    }

    // Everything else (clean-URL HTML pages) must revalidate too
    return new Response(assetResp.body, { status: assetResp.status, statusText: assetResp.statusText, headers: htmlHeaders(assetResp) });
  }
}
