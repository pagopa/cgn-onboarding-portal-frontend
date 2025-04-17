import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useHistory } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, LOGIN } from "../navigation/routes";
import { adminLogoutRedirect, useLoginRedirect } from "./authentication";
import { authenticationStore } from "./authenticationStore";
import {
  UserSession,
  CurrentSession,
  AdminSession,
  MerchantInfo
} from "./authenticationState";

type AuthenticationContextType = {
  userSessionByFiscalCode: Record<string, UserSession>;
  adminSessionByName: Record<string, AdminSession>;
  currentSession: CurrentSession;
  currentUserFiscalCode: string | undefined;
  currentUserSession: UserSession | undefined;
  currentMerchantFiscalCode: string | undefined;
  currentMerchant: MerchantInfo | undefined;
  currentAdminSession: AdminSession | undefined;
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
  useLoginRedirect();
  const history = useHistory();
  const historyPush = history.push;
  const queryClient = useQueryClient();
  const [persistedState, setPersistedState] = useState(authenticationStore.get);
  useEffect(
    () =>
      authenticationStore.subscribe(() => {
        setPersistedState(authenticationStore.get());
      }),
    []
  );
  const { currentSession, userSessionByFiscalCode, adminSessionByName } =
    persistedState;
  const resetQueries = useCallback(() => {
    queryClient.clear();
    void queryClient.invalidateQueries();
  }, [queryClient]);
  const changeSession = useCallback(
    (session: CurrentSession) => {
      authenticationStore.setCurrentSession(session);
      if (session?.type === "user") {
        historyPush(DASHBOARD);
      }
      if (session?.type === "admin") {
        historyPush(ADMIN_PANEL_RICHIESTE);
      }
      resetQueries();
    },
    [historyPush, resetQueries]
  );
  const logout = useCallback(
    (session: CurrentSession) => {
      authenticationStore.deleteSession(session);
      authenticationStore.setCurrentSession(null);
      historyPush(LOGIN);
      resetQueries();
      if (session?.type === "admin") {
        adminLogoutRedirect();
      }
    },
    [historyPush, resetQueries]
  );
  const value = useMemo<AuthenticationContextType>(
    () => ({
      userSessionByFiscalCode,
      adminSessionByName,
      currentSession,
      currentUserFiscalCode:
        currentSession && currentSession.type === "user"
          ? currentSession.userFiscalCode
          : undefined,
      currentUserSession:
        currentSession && currentSession.type === "user"
          ? userSessionByFiscalCode[currentSession.userFiscalCode]
          : undefined,
      currentMerchantFiscalCode:
        currentSession && currentSession.type === "user"
          ? currentSession.merchantFiscalCode
          : undefined,
      currentMerchant:
        currentSession && currentSession.type === "user"
          ? userSessionByFiscalCode[
              currentSession.userFiscalCode
            ]?.merchants.find(
              merchant =>
                merchant.organization_fiscal_code ===
                currentSession.merchantFiscalCode
            )
          : undefined,
      currentAdminSession:
        currentSession && currentSession.type === "admin"
          ? adminSessionByName[currentSession.name]
          : undefined,
      changeSession,
      logout
    }),
    [
      adminSessionByName,
      changeSession,
      currentSession,
      logout,
      userSessionByFiscalCode
    ]
  );
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  return React.useContext(AuthenticationContext);
}
