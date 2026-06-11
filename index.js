export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

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

      return new Response(resp.body, {
        status: 200,
        headers: {'Content-Type': 'text/html; charset=UTF-8'}
      });
    }
    return env.ASSETS.fetch(request);
  }
}
