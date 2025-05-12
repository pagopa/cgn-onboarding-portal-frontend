import * as Yup from "yup";
import { PublicClientApplication } from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OrganizationsDataApi } from "../api/generated";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, LOGIN } from "../navigation/routes";
import { SessionApi } from "../api/generated_public";
import { YupLiteral } from "../utils/yupUtils";
import { API_INDEX_BASE_URL, API_PUBLIC_BASE_URL } from "../api/common";
import { authenticationStore } from "./authenticationStore";

export function goToUserLoginPage() {
  const targetUri = import.meta.env.VITE_ONE_IDENTITY_LOGIN_URI;
  const redirect_uri =
    window.location.hostname === "localhost"
      ? `${window.location.origin}/session`
      : import.meta.env.VITE_ONE_IDENTITY_REDIRECT_URI;
  const client_id = import.meta.env.VITE_ONE_IDENTITY_CLIENT_ID;
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
    scopes: ["openid", import.meta.env.VITE_MSAL_CLIENT_ID],
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
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority: import.meta.env.VITE_MSAL_AUTHORITY,
    knownAuthorities: [
      "cgnonboardingportaluat.b2clogin.com",
      "cgnonboardingportal.b2clogin.com"
    ],
    redirectUri:
      window.location.hostname === "localhost"
        ? `${window.location.origin}/session`
        : import.meta.env.VITE_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: LOGIN
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
});

const userJWTPayloadSchema = Yup.object({
  role: YupLiteral("ROLE_MERCHANT").required(),
  fiscal_code: Yup.string().required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  iat: Yup.number().required(),
  exp: Yup.number().required()
}).required();

const adminJWTPayloadSchema = Yup.object({
  role: YupLiteral("ROLE_ADMIN").required(),
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  iat: Yup.number().required(),
  exp: Yup.number().required()
}).required();

const sessionApi = new SessionApi(undefined, API_PUBLIC_BASE_URL);

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  API_INDEX_BASE_URL
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
      userJWTPayloadSchema.validateSync(
        jwtDecode<unknown>(userTokenResponse.data)
      );
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
    const { first_name, last_name, exp } = adminJWTPayloadSchema.validateSync(
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
          userFiscalCode: state.fiscal_code,
          merchantFiscalCode: undefined
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
  window.location.hostname === "localhost" &&
  window.location.pathname === "/dev-auth"
) {
  const searchParams = new URLSearchParams(window.location.search);
  authenticationStore.set(
    JSON.parse(searchParams.get("authenticationState") ?? "")
  );
  // eslint-disable-next-line functional/immutable-data
  window.location.href = "http://localhost:3000/";
}
