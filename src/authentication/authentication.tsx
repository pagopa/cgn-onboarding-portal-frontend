import { z } from "zod";
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import * as Msal from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import PublicApi from "../api/public";
import { OrganizationsDataApi } from "../api/generated";
import {
  authenticationStateSchema,
  CurrentSession,
  UserSession,
  empty,
  deleteUserNonceByState,
  getUserNonceByState,
  setUserNonceByState,
  deleteSession,
  setUserSession,
  setCurrentSession,
  setAdminNonceByState,
  deleteAdminNonceByState,
  getAdminNonceByState
} from "./authenticationState";
import { makeStore } from "./authenticationStore";
import { load, save, watch } from "./authenticationPersistance";

const LOCAL_STORAGE_KEY = "oneidentity";

export const authenticationStore = makeStore(
  load({
    key: LOCAL_STORAGE_KEY,
    validate: authenticationStateSchema.parse,
    empty
  })
);

authenticationStore.subscribe(() => {
  save({ key: LOCAL_STORAGE_KEY, value: authenticationStore.get() });
});

watch({
  key: LOCAL_STORAGE_KEY,
  validate: authenticationStateSchema.parse,
  listener: authenticationStore.set
});

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

void (async () => {
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
      const decoded = jwtDecode<unknown>(adminTokenResponse.data);
      // eslint-disable-next-line
      console.log(decoded);
      const parsed = adminJWTPayloadSchema.parse(decoded);
      // TODO salvare admin token e impostare current session
    }
  }
})();

function randomAlphaNumericString(length: number): string {
  const choices =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, byte => choices[byte % choices.length]).join("");
}

async function oneIdentityLoginCallback() {
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
}

setTimeout(oneIdentityLoginCallback, 0);

const organizationsDataApi = new OrganizationsDataApi(
  undefined,
  process.env.BASE_API_PATH,
  undefined
);

export const ALLOW_MULTIPLE_LOGIN =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "portal.cgnonboardingportal-uat.pagopa.it";

export function on401() {
  const data = authenticationStore.get();
  deleteSession(data.currentSession);
  setCurrentSession(null);
  // eslint-disable-next-line functional/immutable-data
  window.location.href = "/";
}

type AuthenticationContextType = {
  userSessionByFiscalCode: Record<string, UserSession>;
  currentSession: CurrentSession;
  changeSession(session: CurrentSession): void;
  logout(session: CurrentSession): void;
};

const AuthenticationContext = createContext<AuthenticationContextType>(
  null as any
);

export function AuthenticationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [persistedState, setPersistedState] = useState(authenticationStore.get);
  useEffect(
    () =>
      authenticationStore.subscribe(() => {
        setPersistedState(authenticationStore.get());
      }),
    []
  );
  const { currentSession, userSessionByFiscalCode } = persistedState;
  const changeSession = useCallback((session: CurrentSession) => {
    setCurrentSession(session);
    // eslint-disable-next-line functional/immutable-data
    window.location.href = "/";
  }, []);
  const logout = useCallback((session: CurrentSession) => {
    deleteSession(session);
    setCurrentSession(null);
    // eslint-disable-next-line functional/immutable-data
    window.location.href = "/";
  }, []);
  const value = useMemo<AuthenticationContextType>(
    () => ({
      userSessionByFiscalCode,
      currentSession,
      changeSession,
      logout
    }),
    [changeSession, currentSession, logout, userSessionByFiscalCode]
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export const AuthenticationConsumer = AuthenticationContext.Consumer;

export function useAuthentication() {
  return React.useContext(AuthenticationContext);
}

export function UserSessionsDropdown() {
  const authentication = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);
  if (!ALLOW_MULTIPLE_LOGIN) {
    return null;
  }
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        one identity
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            maxWidth: "80vw",
            border: "1px solid black",
            zIndex: 1,
            gap: 8,
            display: "flex",
            flexDirection: "column",
            padding: 8
          }}
        >
          {Object.entries(authentication.userSessionByFiscalCode).map(
            ([fiscal_code, { first_name, last_name }]) => {
              return (
                <div
                  key={fiscal_code}
                  style={{
                    padding: "0px 16px"
                  }}
                  onClick={() => {
                    authentication.changeSession({
                      type: "user",
                      userFiscalCode: fiscal_code,
                      merchantFiscalCode: undefined
                    });
                  }}
                >
                  <div>
                    {first_name} {last_name}
                  </div>
                  <div>{fiscal_code}</div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
