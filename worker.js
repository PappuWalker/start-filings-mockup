const ORIGIN_URL = "https://sleek-analytics-4.preview.emergentagent.com/";

async function handleRequest(request) {
  const response = await fetch(ORIGIN_URL, request);
  const newResponse = new Response(response.body, response);

  // Ensure Content-Type is set to HTML for HTMLRewriter to work
  if (!newResponse.headers.get("content-type")?.includes("text/html")) {
    return newResponse;
  }
  
  // Create a base URL string without a trailing slash for rewriting assets
  const ORIGIN_BASE = ORIGIN_URL.replace(/\/$/, '');

  const rewriter = new HTMLRewriter()
    // 1. Watermark Removal (Original Goal)
    .on('#emergent-badge', {
      element(element) {
        element.remove();
      }
    })
    
    // 2. Asset Rewriting (Fixes broken CSS/JS/Images using absolute paths like /img.png)
    .on('link', { // Handles CSS <link href="/style.css">
      element(element) {
        const href = element.getAttribute('href');
        if (href && href.startsWith('/')) {
          element.setAttribute('href', ORIGIN_BASE + href);
        }
      }
    })
    .on('script', { // Handles JS <script src="/app.js">
      element(element) {
        const src = element.getAttribute('src');
        if (src && src.startsWith('/')) {
          element.setAttribute('src', ORIGIN_BASE + src);
        }
      }
    })
    .on('img', { // Handles Images <img src="/logo.png">
      element(element) {
        const src = element.getAttribute('src');
        if (src && src.startsWith('/')) {
          element.setAttribute('src', ORIGIN_BASE + src);
        }
      }
    });

  return rewriter.transform(newResponse);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});