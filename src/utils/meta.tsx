const CSPContent = `
script-src 'self' https://www.google.com https://www.gstatic.com ${window.location.hostname === "localhost" ? "'unsafe-eval'" : ""};
style-src 'self';
object-src 'none';
base-uri 'self';
connect-src 'self' ${process.env.BASE_API_DOMAIN ?? ""} ${process.env.MSAL_AUTHORITY ?? ""} https://geocode.search.hereapi.com https://autocomplete.search.hereapi.com;
font-src 'self';
frame-src 'self' https://www.google.com;
img-src 'self' https://assets.cdn.io.italia.it ${process.env.BASE_IMAGE_PATH ?? ""};
manifest-src 'self';
media-src 'self';
worker-src 'none';
`;

export function renderCSP() {
  const element = document.createElement("meta");
  element.setAttribute("http-equiv", "Content-Security-Policy");
  element.setAttribute("content", CSPContent);
  document.head.appendChild(element);
}
