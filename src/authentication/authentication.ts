import { z } from "zod";
import * as Msal from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OrganizationsDataApi } from "../api/generated";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, LOGIN } from "../navigation/routes";
import { SessionApi } from "../api/generated_public";
import { authenticationStore } from "./authenticationStore";

export function goToUserLoginPage() {
  const targetUri = process.env.ONE_IDENTITY_LOGIN_URI ?? "";
  const redirect_uri = process.env.ONE_IDENTITY_REDIRECT_URI ?? "";
  const client_id = process.env.ONE_IDENTITY_CLIENT_ID ?? "";
  const state = randomAlphaNumericString(16);
  const nonce = randomAlphaNumericString(16);
  const targetUrl = `${targetUri}?${new URLSearchParams({
    response_type: "CODE",
    scope: "openid",
    client_id,
    state,
    nonce,
    redirect_uri
  }).toString()}`;
  authenticationStore.setUserNonceByState(state, nonce);
  // using window.location.href intead of link hreh since nonce must be different on every click
  // eslint-disable-next-line functional/immutable-data
  window.location.href = targetUrl;
}

export function goToAdminLoginPage() {
  const state = randomAlphaNumericString(16);
  const nonce = randomAlphaNumericString(16);
  authenticationStore.setAdminNonceByState(state, nonce);
  void AdminAccess.loginRedirect({
    scopes: ["openid", process.env.MSAL_CLIENT_ID as string],
    state,
    nonce
  });
}

function randomAlphaNumericString(length: number): string {
  const choices =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, byte => choices[byte % choices.length]).join("");
}

const AdminAccess = new Msal.PublicClientApplication({
  auth: {
    clientId: process.env.MSAL_CLIENT_ID as string,
    authority: process.env.MSAL_AUTHORITY as string,
    knownAuthorities: [
      "testcgnportalbitrock.b2clogin.com",
      "cgnonboardingportaluat.b2clogin.com",
      "cgnonboardingportal.b2clogin.com"
    ],
    redirectUri:
      window.location.host === "localhost:3000"
        ? "http://localhost:3000/session"
        : (process.env.MSAL_REDIRECT_URI as string),
    postLogoutRedirectUri: LOGIN
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
});

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

const sessionApi = new SessionApi(undefined, process.env.BASE_PUBLIC_PATH);

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  process.env.BASE_API_PATH
);

async function onUserLoginRedirect() {
  if (window.location.pathname !== "/session") {
    return { type: "not-executed" } as const;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const state = searchParams.get("state") ?? "";
  const code = searchParams.get("code") ?? "";
  try {
    const nonce = authenticationStore.getUserNonceByState(state);
    if (!nonce) {
      return { type: "not-executed" } as const;
    }
    authenticationStore.deleteUserNonceByState(state);
    const userTokenResponse = await sessionApi.createJwtSessionToken({
      createJwtSessionTokenRequest: { requestType: "oi", nonce, code }
    });
    const { fiscal_code, first_name, last_name, exp } =
      userJWTPayloadSchema.parse(jwtDecode<unknown>(userTokenResponse.data));
    const merchantTokensReponse = await organizationsDataApi.getOrganizations({
      headers: {
        Authorization: `Bearer ${userTokenResponse.data}`
      }
    });
    authenticationStore.setUserSession(fiscal_code, {
      token: userTokenResponse.data,
      first_name,
      last_name,
      exp,
      merchants: merchantTokensReponse.data.items
    });
    return { type: "success", fiscal_code } as const;
  } catch (error) {
    return { type: "error" } as const;
  }
}

async function onAdminLoginRedirect() {
  try {
    const result = await AdminAccess.handleRedirectPromise();
    if (!result) {
      return { type: "not-executed" } as const;
    }
    const nonce = authenticationStore.getAdminNonceByState(result.state ?? "");
    if (!nonce) {
      throw new Error("Admin login nonce not found");
    }
    authenticationStore.deleteAdminNonceByState(result.state ?? "");
    const adminTokenResponse = await sessionApi.createJwtSessionToken({
      createJwtSessionTokenRequest: {
        requestType: "ad",
        token: result.idToken,
        nonce
      }
    });
    const { first_name, last_name, exp } = adminJWTPayloadSchema.parse(
      jwtDecode<unknown>(adminTokenResponse.data)
    );
    const name = `${first_name} ${last_name}`;
    authenticationStore.setAdminSession(name, {
      token: adminTokenResponse.data,
      first_name,
      last_name,
      exp
    });
    return { type: "success", name } as const;
  } catch (error) {
    return { type: "error" } as const;
  }
}

export function adminLogoutRedirect() {
  void AdminAccess.logoutRedirect();
}

export function adminLogoutPopup() {
  void AdminAccess.logoutPopup();
}

const userLoginRedirectPromise = onUserLoginRedirect();
const adminLoginRedirectPromise = onAdminLoginRedirect();

export function useLoginRedirect() {
  const history = useHistory();
  const historyPush = history.push;
  const queryClient = useQueryClient();

  useEffect(() => {
    const resetQueries = () => {
      queryClient.clear();
      void queryClient.invalidateQueries();
    };

    void userLoginRedirectPromise.then(state => {
      if (state.type === "success") {
        authenticationStore.setCurrentSession({
          type: "user",
          userFiscalCode: state.fiscal_code
        });
        resetQueries();
        historyPush(DASHBOARD);
      }
    });

    void adminLoginRedirectPromise.then(state => {
      if (state.type === "success") {
        authenticationStore.setCurrentSession({
          type: "admin",
          name: state.name
        });
        resetQueries();
        historyPush(ADMIN_PANEL_RICHIESTE);
      }
    });
  }, [historyPush, queryClient]);
}

// developer utility to be able to test from localhost
if (
  process.env.NODE_ENV === "uat" &&
  window.location.pathname === "/dev-auth"
) {
  const searchParams = new URLSearchParams(window.location.search);
  authenticationStore.set(
    JSON.parse(searchParams.get("authenticationState") ?? "")
  );
  // eslint-disable-next-line functional/immutable-data
  window.location.href = "http://localhost:3000/";
}
