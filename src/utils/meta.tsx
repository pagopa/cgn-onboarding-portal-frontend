import { fromNullable } from "fp-ts/lib/Option";

const getCSPContent = () => 
`
Content-Security-Policy-Report-Only: 
default-src 'self'; 
script-src 'self'; 
style-src 'self'; 
object-src 'none'; 
base-uri 'self';
connect-src 'self' https://api.cgnonboardingportal.pagopa.it https://geocode.search.hereapi.com https://autocomplete.search.hereapi.com;
font-src 'self'; 
frame-src 'self'; 
img-src 'self' https://assets.cdn.io.italia.it https://cgnonboardingportalpsa.blob.core.windows.net https://www.spid.gov.it ${fromNullable(process.env.BASE_BLOB_PATH).getOrElse("")} ${process.env.NODE_ENV !== 'production' ? "https://upload.wikimedia.org/" : ""};
manifest-src 'self'; 
media-src 'self'; 
worker-src 'none';
`;


export const renderCSP = () => {
    if (process.env.NODE_ENV === 'production' && false){
        // eslint-disable-next-line functional/immutable-data
        document.getElementsByTagName("head")[0].innerHTML += `<meta http-equiv="Content-Security-Policy" content="${getCSPContent()}">`;
    }
};
    