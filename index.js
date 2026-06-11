export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.startsWith('/blog/') &&
        !path.match(/\.[a-zA-Z0-9]+$/) &&
        path !== '/blog/' &&
        path !== '/blog') {

      const templateUrl = new URL('/blog/post-template.html', url).toString();
      const templateResp = await env.ASSETS.fetch(new Request(templateUrl));

      return new Response(templateResp.body, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      });
    }
    return env.ASSETS.fetch(request);
  }
}
