import { z } from "zod";
import * as Msal from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { OrganizationsDataApi } from "../api/generated";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, LOGIN } from "../navigation/routes";
import { SessionApi } from "../api/generated_public";
import { makeStore } from "./authenticationStore";
import {
  localStorageInitialState,
  localStorageSetup
} from "./authenticationPersistance";
import {
  UserSession,
  AdminSession,
  CurrentSession
} from "./authenticationState";

export const authenticationStore = makeStore(localStorageInitialState);
localStorageSetup(authenticationStore);

const NONCE_DURATION = 15 * 60 * 1000;

function setUserNonceByState(state: string, nonce: string) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    userNonceByState: {
      ...data.userNonceByState,
      [state]: { nonce, exp: Date.now() + NONCE_DURATION }
    }
  });
}

function getUserNonceByState(state: string): string | undefined {
  const data = authenticationStore.get();
  return data.userNonceByState[state]?.nonce;
}

function deleteUserNonceByState(state: string) {
  const data = authenticationStore.get();
  const { [state]: deleted, ...userNonceByState } = data.userNonceByState;
  authenticationStore.set({ ...data, userNonceByState });
}

function setAdminNonceByState(state: string, nonce: string) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    adminNonceByState: {
      ...data.adminNonceByState,
      [state]: { nonce, exp: Date.now() + NONCE_DURATION }
    }
  });
}

function getAdminNonceByState(state: string): string | undefined {
  const data = authenticationStore.get();
  return data.adminNonceByState[state]?.nonce;
}

function deleteAdminNonceByState(state: string) {
  const data = authenticationStore.get();
  const { [state]: deleted, ...adminNonceByState } = data.adminNonceByState;
  authenticationStore.set({ ...data, adminNonceByState });
}

function setUserSession(fiscal_code: string, session: UserSession) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    userSessionByFiscalCode: {
      ...data.userSessionByFiscalCode,
      [fiscal_code]: session
    }
  });
}

function setAdminSession(name: string, session: AdminSession) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    adminSessionByName: { ...data.adminSessionByName, [name]: session }
  });
}

export function setCurrentSession(session: CurrentSession) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    currentSession: session
  });
}

export function deleteSession(session: CurrentSession) {
  const data = authenticationStore.get();
  if (session?.type === "user") {
    const { [session.userFiscalCode]: deleted, ...userSessionByFiscalCode } =
      data.userSessionByFiscalCode;
    authenticationStore.set({
      ...data,
      userSessionByFiscalCode
    });
  }
  if (session?.type === "admin") {
    const { [session.name]: deleted, ...adminSessionByName } =
      data.adminSessionByName;
    authenticationStore.set({
      ...data,
      adminSessionByName
    });
  }
}

export function getMerchantToken(): string {
  const data = authenticationStore.get();
  if (data.currentSession?.type === "user") {
    const merchantFiscalCode = data.currentSession.merchantFiscalCode;
    return (
      data.userSessionByFiscalCode[
        data.currentSession.userFiscalCode
      ]?.merchants.find(
        merchant => merchant.organization_fiscal_code === merchantFiscalCode
      )?.token ?? ""
    );
  }
  return "";
  // returning empty, invalid or expired token here is fine since authentication errors are handled on401
}

export function getAdminToken(): string {
  const data = authenticationStore.get();
  if (data.currentSession?.type === "admin") {
    return data.adminSessionByName[data.currentSession.name]?.token ?? "";
  }
  return "";
  // returning empty, invalid or expired token here is fine since authentication errors are handled on401
}

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
  setUserNonceByState(state, nonce);
  // using window.location.href intead of link hreh since nonce must be different on every click
  // eslint-disable-next-line functional/immutable-data
  window.location.href = targetUrl;
}

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
    ], // You must identify your tenant's domain as a known authority.
    // redirectUri: process.env.MSAL_REDIRECT_URI as string,
    redirectUri: "http://localhost:3000/session", // TODO
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
  if (location.pathname !== "/session") {
    return { type: "not-executed" } as const;
  }
  const searchParams = new URLSearchParams(location.search);
  const state = searchParams.get("state") ?? "";
  const code = searchParams.get("code") ?? "";
  try {
    const nonce = getUserNonceByState(state);
    if (!nonce) {
      return { type: "not-executed" } as const;
    }
    deleteUserNonceByState(state);
    const userTokenResponse = await sessionApi.createJwtSessionToken({
      createJwtSessionTokenRequest: { requestType: "oi", nonce, code }
    });
    if (userTokenResponse instanceof AxiosError) {
      throw userTokenResponse;
    }
    const { fiscal_code, first_name, last_name, exp } =
      userJWTPayloadSchema.parse(jwtDecode<unknown>(userTokenResponse.data));
    const merchantTokensReponse = await organizationsDataApi.getOrganizations({
      headers: {
        Authorization: `Bearer ${userTokenResponse.data}`
      }
    });
    if (merchantTokensReponse instanceof AxiosError) {
      throw merchantTokensReponse;
    }
    setUserSession(fiscal_code, {
      token: userTokenResponse.data,
      first_name,
      last_name,
      exp,
      merchants: merchantTokensReponse.data.items
    });
    return { type: "success", fiscal_code } as const;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { type: "error" } as const;
  }
}

async function onAdminLoginRedirect() {
  try {
    const result = await AdminAccess.handleRedirectPromise();
    if (!result) {
      return { type: "not-executed" } as const;
    }
    const nonce = getAdminNonceByState(result.state ?? "");
    if (!nonce) {
      throw new Error("Admin login nonce not found");
    }
    deleteAdminNonceByState(result.state ?? "");
    const adminTokenResponse = await sessionApi.createJwtSessionToken({
      createJwtSessionTokenRequest: {
        requestType: "ad",
        token: result.idToken,
        nonce
      }
    });
    if (adminTokenResponse instanceof AxiosError) {
      throw adminTokenResponse;
    }
    const { first_name, last_name, exp } = adminJWTPayloadSchema.parse(
      jwtDecode<unknown>(adminTokenResponse.data)
    );
    const name = `${first_name} ${last_name}`;
    setAdminSession(name, {
      token: adminTokenResponse.data,
      first_name,
      last_name,
      exp
    });
    return { type: "success", name } as const;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return { type: "error" } as const;
  }
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
        setCurrentSession({
          type: "user",
          userFiscalCode: state.fiscal_code
        });
        resetQueries();
        historyPush(DASHBOARD);
      }
    });

    void adminLoginRedirectPromise.then(state => {
      if (state.type === "success") {
        setCurrentSession({
          type: "admin",
          name: state.name
        });
        resetQueries();
        historyPush(ADMIN_PANEL_RICHIESTE);
      }
    });
  }, [historyPush, queryClient]);
}
