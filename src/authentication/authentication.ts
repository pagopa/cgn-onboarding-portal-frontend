import { PublicClientApplication } from "@azure/msal-browser";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { href, useNavigate } from "react-router";
import * as z from "zod/mini";
import { API_INDEX_BASE_URL, API_PUBLIC_BASE_URL } from "../api/common";
import { OrganizationsDataApi } from "../api/generated";
import { SessionApi } from "../api/generated_public";
import { authenticationStore } from "./authenticationStore";

export function goToUserLoginPage() {
  const targetUri = import.meta.env.CGN_ONE_IDENTITY_LOGIN_URI;
  const redirect_uri = import.meta.env.CGN_ONE_IDENTITY_REDIRECT_URI;
  const client_id = import.meta.env.CGN_ONE_IDENTITY_CLIENT_ID;
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
  // eslint-disable-next-line functional/immutable-data
  window.location.href = targetUrl;
}

export function goToAdminLoginPage() {
  const state = randomAlphaNumericString(16);
  const nonce = randomAlphaNumericString(16);
  authenticationStore.setAdminNonceByState(state, nonce);
  void AdminAccess.loginRedirect({
    scopes: ["openid", import.meta.env.CGN_MSAL_CLIENT_ID],
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

const AdminAccess = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.CGN_MSAL_CLIENT_ID,
    authority: import.meta.env.CGN_MSAL_AUTHORITY,
    knownAuthorities: [
      "cgnonboardingportaluat.b2clogin.com",
      "cgnonboardingportal.b2clogin.com"
    ],
    redirectUri: import.meta.env.CGN_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: "/login"
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

const sessionApi = new SessionApi(undefined, API_PUBLIC_BASE_URL);

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  API_INDEX_BASE_URL
);

async function onUserLoginRedirect() {
  if (typeof window === "undefined") {
    return { type: "not-executed" } as const;
  }
  if (window.location.pathname !== "/session") {
    return { type: "not-executed" } as const;
  }
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("error")) {
    return { type: "error" } as const;
  }
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
  } catch {
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
  } catch {
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
  const navigate = useNavigate();
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
          userFiscalCode: state.fiscal_code,
          merchantFiscalCode: undefined
        });
        resetQueries();
        navigate(href("/"));
      } else if (state.type === "error") {
        navigate(href("/login"));
      }
    });

    void adminLoginRedirectPromise.then(state => {
      if (state.type === "success") {
        authenticationStore.setCurrentSession({
          type: "admin",
          name: state.name
        });
        resetQueries();
        navigate(href("/"));
      }
    });
  }, [navigate, queryClient]);
}
