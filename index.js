export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route blog post URLs to post-template.html
    if (path.startsWith('/blog/') && 
        !path.match(/\.[a-zA-Z0-9]+$/) && 
        path !== '/blog/' && 
        path !== '/blog') {
      const templateUrl = new URL('/blog/post-template.html', url);
      return env.ASSETS.fetch(new Request(templateUrl.toString(), request));
    }

    return env.ASSETS.fetch(request);
  }
}
