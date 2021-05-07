import * as Msal from "msal";

const msalConfig = {
  auth: {
    clientId: process.env.MSAL_CLIENT_ID as string,
    authority: process.env.MSAL_AUTHORITY as string,
    redirectUri: process.env.MSAL_REDIRECT_URI as string,
  },
  cache: {
    cacheLocation: "sessionStorage" as Msal.CacheLocation,
    storeAuthStateInCookie: false,
  }
};  
  
export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"]
};


export const AdminAccess = new Msal.UserAgentApplication(msalConfig); 