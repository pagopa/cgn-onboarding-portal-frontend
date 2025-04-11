import { z } from "zod";
import * as Msal from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import PublicApi from "../api/public";
import { OrganizationsDataApi } from "../api/generated";
import {
  deleteUserNonceByState,
  getUserNonceByState,
  setUserNonceByState,
  deleteSession,
  setUserSession,
  setCurrentSession,
  setAdminNonceByState,
  deleteAdminNonceByState,
  getAdminNonceByState,
  setAdminSession
} from "./authenticationState";
import { makeStore } from "./authenticationStore";
import {
  localStorageInitialState,
  localStorageSetup
} from "./authenticationPersistance";

// TODO remove tokens and nonces that are expired
// TODO replace /session?... on page load
// TODO delete nonce and session on login error and show error message

export const authenticationStore = makeStore(localStorageInitialState);
localStorageSetup(authenticationStore);

function randomAlphaNumericString(length: number): string {
  const choices =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, byte => choices[byte % choices.length]).join("");
}

const userJWTPayloadSchema = z.object({
  role: z.literal("ROLE_MERCHANT"),
  fiscal_code: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  iat: z.number(),
  exp: z.number()
});

const adminJWTPayloadSchema = z.object({
  role: z.literal("ROLE_ADMIN"),
  first_name: z.string(),
  last_name: z.string(),
  iat: z.number(),
  exp: z.number()
});

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  process.env.BASE_API_PATH,
  undefined
);

export function goToUserLoginPage() {
  const targetHost = process.env.ONE_IDENTITY_LOGIN_HOST ?? "";
  const currentHost = process.env.ONE_IDENTITY_REDIRECT_HOST ?? "";
  const client_id = process.env.ONE_IDENTITY_CLIENT_ID ?? "";
  const state = randomAlphaNumericString(16);
  const nonce = randomAlphaNumericString(16);
  const redirect_uri = `https://${currentHost}/session`;
  const targetUrl = `https://${targetHost}/login?${new URLSearchParams({
    response_type: "CODE",
    scope: "openid",
    client_id,
    state,
    nonce,
    redirect_uri
  }).toString()}`;
  setUserNonceByState(state, nonce);
  // eslint-disable-next-line functional/immutable-data
  window.location.href = targetUrl;
}

void (async function onUserLoginRedirect() {
  const url = new URL(window.location.href);
  if (url.pathname !== "/session") {
    return;
  }
  const state = url.searchParams.get("state") ?? "";
  const code = url.searchParams.get("code") ?? "";
  const nonce = getUserNonceByState(state ?? "");
  if (!nonce) {
    return;
  }
  deleteUserNonceByState(state ?? "");
  const userTokenResponse = await PublicApi.Session.createJwtSessionToken({
    createJwtSessionTokenRequest: { requestType: "oi", nonce, code }
  });
  const merchantTokensReponse = await organizationsDataApi.getOrganizations({
    headers: {
      Authorization: `Bearer ${userTokenResponse.data}`
    }
  });
  const { fiscal_code, first_name, last_name } = userJWTPayloadSchema.parse(
    jwtDecode<unknown>(userTokenResponse.data)
  );
  setUserSession(fiscal_code, {
    token: userTokenResponse.data,
    first_name,
    last_name,
    merchants: merchantTokensReponse.data.items
  });
  setCurrentSession({ type: "user", userFiscalCode: fiscal_code });
  // eslint-disable-next-line functional/immutable-data
  window.location.href = "/";
  // TODO reset queries, change route
})();

const AdminAccess = new Msal.PublicClientApplication({
  auth: {
    clientId: process.env.MSAL_CLIENT_ID as string,
    authority: process.env.MSAL_AUTHORITY as string,
    knownAuthorities: [
      "testcgnportalbitrock.b2clogin.com",
      "cgnonboardingportaluat.b2clogin.com",
      "cgnonboardingportal.b2clogin.com"
    ], // You must identify your tenant's domain as a known authority.
    redirectUri: process.env.MSAL_REDIRECT_URI as string,
    postLogoutRedirectUri: "/"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
});

export function goToAdminLoginPage() {
  const state = randomAlphaNumericString(16);
  const nonce = randomAlphaNumericString(16);
  setAdminNonceByState(state, nonce);
  void AdminAccess.loginRedirect({
    scopes: ["openid", process.env.MSAL_CLIENT_ID as string],
    state,
    nonce
  });
}

void (async function onAdminLoginRedirect() {
  const result = await AdminAccess.handleRedirectPromise();
  if (result) {
    const nonce = getAdminNonceByState(result.state ?? "");
    if (nonce) {
      deleteAdminNonceByState(result.state ?? "");
      const adminTokenResponse = await PublicApi.Session.createJwtSessionToken({
        createJwtSessionTokenRequest: {
          requestType: "ad",
          token: result.idToken,
          nonce
        }
      });
      const { first_name, last_name } = adminJWTPayloadSchema.parse(
        jwtDecode<unknown>(adminTokenResponse.data)
      );
      const name = `${first_name} ${last_name}`;
      setAdminSession(name, {
        token: adminTokenResponse.data,
        first_name,
        last_name
      });
      setCurrentSession({ type: "admin", name });
      // eslint-disable-next-line functional/immutable-data
      window.location.href = "/";
      // TODO reset queries, change route
    }
  }
})();

export function on401() {
  const data = authenticationStore.get();
  deleteSession(data.currentSession);
  setCurrentSession(null);
  // eslint-disable-next-line functional/immutable-data
  window.location.href = "/";
  // TODO reset queries, change route
}
