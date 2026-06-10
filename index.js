export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (!path.match(/\.[a-zA-Z0-9]+$/) && !path.endsWith('/')) {
      const newRequest = new Request(
        new URL(path + '.html', url), request
      );
      return env.ASSETS.fetch(newRequest);
    }
    return env.ASSETS.fetch(request);
  }
}
