import { fromNullable } from "fp-ts/lib/Option";

const getAdminLoginUri = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      return "https://login.microsoftonline.com https://cgnonboardingportal.b2clogin.com";
    case "uat":
      return "https://cgnonboardingportaluat.b2clogin.com";
    default:
      return "";
  }
};

const getCSPContent = () =>
  `
Content-Security-Policy-Report-Only: default-src 'self';
script-src 'self' https://www.google.com https://www.gstatic.com;
style-src 'self';
object-src 'none';
base-uri 'self';
connect-src 'self' ${getAdminLoginUri()} ${
    process.env.BASE_API_DOMAIN
  } https://geocode.search.hereapi.com https://autocomplete.search.hereapi.com;
font-src 'self';
frame-src 'self' https://www.google.com;
img-src 'self' https://assets.cdn.io.italia.it https://iopitncgnpeassetsst01.blob.core.windows.net ${fromNullable(
    process.env.BASE_BLOB_PATH
  ).getOrElse("")} ${
    process.env.NODE_ENV !== "production" ? "https://upload.wikimedia.org/" : ""
  };
manifest-src 'self';
media-src 'self';
worker-src 'none';
`;

export const renderCSP = () => {
  if (location.host.startsWith("localhost")) {
    return;
  }
  if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "uat") {
    // eslint-disable-next-line functional/immutable-data
    document.getElementsByTagName("head")[0].innerHTML +=
      `<meta http-equiv="Content-Security-Policy" content="${getCSPContent()}">`;
  }
};
