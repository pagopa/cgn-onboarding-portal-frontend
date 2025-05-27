const CSPContent = `
script-src 'self' https://www.google.com https://recaptcha.net https://www.gstatic.com;
style-src 'self';
object-src 'none';
base-uri 'self';
connect-src 'self' https://${import.meta.env.CGN_API_DOMAIN} ${import.meta.env.CGN_MSAL_AUTHORITY} https://geocode.search.hereapi.com https://autocomplete.search.hereapi.com;
font-src 'self' data:;
frame-src 'self' https://www.google.com https://recaptcha.net;
img-src 'self' data: https://assets.cdn.io.italia.it ${import.meta.env.CGN_IMAGE_BASE_URL};
manifest-src 'self';
media-src 'self';
worker-src 'none';
`;

export function renderCSP() {
  if (import.meta.env.DEV) {
    return;
  }
  const element = document.createElement("meta");
  element.setAttribute("http-equiv", "Content-Security-Policy");
  element.setAttribute("content", CSPContent);
  document.head.appendChild(element);
}
