import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { DASHBOARD, ADMIN_PANEL_RICHIESTE, LOGIN } from "../navigation/routes";
import { useLoginRedirect, adminLogoutRedirect } from "./authentication";
import {
  AuthenticationContextType,
  AuthenticationContext
} from "./AuthenticationContext";
import { CurrentSession } from "./authenticationState";
import { authenticationStore } from "./authenticationStore";

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
  const setCurrentSession = useCallback(
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
      authenticationStore.setCurrentSession({ type: "none" });
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
      setCurrentSession,
      logout
    }),
    [
      adminSessionByName,
      setCurrentSession,
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
