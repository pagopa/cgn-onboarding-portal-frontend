const getCSPContent = () =>
  `
script-src 'self' https://www.google.com https://www.gstatic.com;
style-src 'self';
object-src 'none';
base-uri 'self';
connect-src 'self' https://login.microsoftonline.com ${process.env.MSAL_AUTHORITY ?? ""} ${
    process.env.BASE_API_DOMAIN
  } https://geocode.search.hereapi.com https://autocomplete.search.hereapi.com;
font-src 'self';
frame-src 'self' https://www.google.com;
img-src 'self' https://assets.cdn.io.italia.it ${process.env.BASE_IMAGE_PATH ?? ""};
manifest-src 'self';
media-src 'self';
worker-src 'none';
`;

export const renderCSP = () => {
  if (
    window.location.host.startsWith("localhost") ||
    window.location.host.startsWith("127.0.0.1")
  ) {
    return;
  }
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat") {
    // eslint-disable-next-line functional/immutable-data
    document.getElementsByTagName("head")[0].innerHTML +=
      `<meta http-equiv="Content-Security-Policy" content="${getCSPContent()}">`;
  }
};
