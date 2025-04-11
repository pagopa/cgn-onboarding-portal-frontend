import { z } from "zod";
import * as Msal from "@azure/msal-browser";
import React, { Fragment, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import PublicApi from "../api/public";
import { OrganizationsDataApi } from "../api/generated";
import { queryClient } from "../api/common";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, ROOT } from "../navigation/routes";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
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

export const authenticationStore = makeStore(localStorageInitialState);
localStorageSetup(authenticationStore);

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
    redirectUri: process.env.MSAL_REDIRECT_URI as string,
    postLogoutRedirectUri: "/"
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

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  process.env.BASE_API_PATH,
  undefined
);

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

export function LoginRedirect() {
  const history = useHistory();
  const location = useLocation();
  const [loginState, setLoginState] = useState<{
    admin:
      | { type: "loading" }
      | { type: "not-executed" }
      | { type: "error" }
      | { type: "success"; name: string };
    user:
      | { type: "loading" }
      | { type: "not-executed" }
      | { type: "error" }
      | { type: "success"; fiscal_code: string };
  }>({
    admin: { type: "loading" },
    user: { type: "loading" }
  });

  const historyPush = history.push;

  useEffect(() => {
    void (async function onUserLoginRedirect() {
      const searchParams = new URLSearchParams(location.search);
      const state = searchParams.get("state") ?? "";
      const code = searchParams.get("code") ?? "";
      try {
        const nonce = getUserNonceByState(state);
        if (!nonce) {
          setLoginState(loginState => ({
            ...loginState,
            user: { type: "not-executed" }
          }));
          return;
        }
        deleteUserNonceByState(state);
        const userTokenResponse = await PublicApi.Session.createJwtSessionToken(
          {
            createJwtSessionTokenRequest: { requestType: "oi", nonce, code }
          }
        );
        if (userTokenResponse instanceof AxiosError) {
          throw userTokenResponse;
        }
        const { fiscal_code, first_name, last_name, exp } =
          userJWTPayloadSchema.parse(
            jwtDecode<unknown>(userTokenResponse.data)
          );
        const merchantTokensReponse =
          await organizationsDataApi.getOrganizations({
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
        setLoginState(loginState => ({
          ...loginState,
          user: { type: "success", fiscal_code }
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setLoginState(loginState => ({
          ...loginState,
          user: { type: "error" }
        }));
      }
    })();
  }, [location.search]);

  useEffect(() => {
    void (async function onAdminLoginRedirect() {
      try {
        const result = await AdminAccess.handleRedirectPromise();
        if (!result) {
          setLoginState(loginState => ({
            ...loginState,
            admin: { type: "not-executed" }
          }));
          return;
        }
        const nonce = getAdminNonceByState(result.state ?? "");
        if (!nonce) {
          throw new Error("Admin login nonce not found");
        }
        deleteAdminNonceByState(result.state ?? "");
        const adminTokenResponse =
          await PublicApi.Session.createJwtSessionToken({
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
        setLoginState(loginState => ({
          ...loginState,
          admin: { type: "success", name }
        }));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        setLoginState(loginState => ({
          ...loginState,
          admin: { type: "error" }
        }));
      }
    })();
  }, []);

  useEffect(() => {
    if (loginState.user.type === "success") {
      setCurrentSession({
        type: "user",
        userFiscalCode: loginState.user.fiscal_code
      });
      historyPush(DASHBOARD);
      resetQueries();
    } else if (loginState.admin.type === "success") {
      setCurrentSession({ type: "admin", name: loginState.admin.name });
      historyPush(ADMIN_PANEL_RICHIESTE);
      resetQueries();
    }
  }, [historyPush, loginState]);

  return (
    <Layout>
      <Container>
        <div className="col-12 bg-white my-20 p-10 d-flex flex-column align-items-center">
          {(() => {
            if (
              loginState.user.type === "error" ||
              loginState.admin.type === "error" ||
              (loginState.user.type === "not-executed" &&
                loginState.admin.type === "not-executed")
            ) {
              return (
                <Fragment>
                  <h1 className="h2 font-weight-bold text-dark-blue">
                    Errore durante il login
                  </h1>
                  <Link className="mt-8 btn btn-outline-primary" to={ROOT}>
                    Riprova
                  </Link>
                </Fragment>
              );
            }
            return (
              <h1 className="h2 font-weight-bold text-dark-blue">
                Login in corso
              </h1>
            );
          })()}
        </div>
      </Container>
    </Layout>
  );
}

export function resetQueries() {
  queryClient.clear();
  void queryClient.invalidateQueries();
}

export function on401() {
  const data = authenticationStore.get();
  deleteSession(data.currentSession);
  setCurrentSession(null);
  resetQueries();
  // eslint-disable-next-line functional/immutable-data
  window.location.href = ROOT;
}
