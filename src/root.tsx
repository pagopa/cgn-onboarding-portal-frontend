import { Links, Meta, Scripts, ScrollRestoration } from "react-router";
import { App } from "./App.tsx";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/pagopa.svg" />
        <title>PagoPA</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`
              script-src 'self' 'unsafe-inline' https://www.google.com https://recaptcha.net https://www.gstatic.com;
              style-src 'self' ${import.meta.env.DEV ? "'unsafe-inline'" : ""};
              object-src 'none';
              base-uri 'self';
              connect-src 'self' ${import.meta.env.CGN_API_URL} ${import.meta.env.CGN_MSAL_AUTHORITY};
              font-src 'self' data:;
              frame-src 'self' https://www.google.com https://recaptcha.net;
              img-src 'self' data: https://assets.cdn.io.italia.it ${import.meta.env.CGN_IMAGE_BASE_URL};
              manifest-src 'self';
              media-src 'self';
              worker-src 'none';
            `}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <p>Caricamento</p>;
}

export default App;
