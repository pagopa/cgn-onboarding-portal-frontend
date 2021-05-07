import * as Msal from "msal";

const msalConfig = {
  auth: {
    clientId: "bcab7c72-7b61-4ac6-bd6e-122c1fb6c4d3",
    authority: "https://login.microsoftonline.com/testcgnportalbitrock.onmicrosoft.com",
    redirectUri: "http://localhost:3000",
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