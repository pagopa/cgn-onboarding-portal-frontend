import * as Msal from "@azure/msal-browser";

const msalConfig: Msal.Configuration = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID as string,
    authority: process.env.MSAL_AUTHORITY as string,
    knownAuthorities: [
      "testcgnportalbitrock.b2clogin.com",
      "cgnonboardingportaluat.b2clogin.com"
    ], // You must identify your tenant's domain as a known authority.
    redirectUri: process.env.MSAL_REDIRECT_URI as string,
    postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["openid", process.env.MSAL_CLIENT_ID as string]
};

export const AdminAccess = new Msal.PublicClientApplication(msalConfig);
