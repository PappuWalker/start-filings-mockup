const ORIGIN_URL = "https://sleek-analytics-4.preview.emergentagent.com/";

async function handleRequest(request) {
  // Fetch the original response from the source URL
  const response = await fetch(ORIGIN_URL, request);

  // Clone the response so we can modify the body
  const newResponse = new Response(response.body, response);

  // Use HTMLRewriter to find and remove the watermark element
  // Targetting the ID: #emergent-badge based on your inspect screenshot
  return new HTMLRewriter()
    .on('#emergent-badge', {
      element(element) {
        // Remove the entire element (the <a> tag) and its contents
        element.remove();
      }
    })
    // Transform and return the cleaned response
    .transform(newResponse);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});