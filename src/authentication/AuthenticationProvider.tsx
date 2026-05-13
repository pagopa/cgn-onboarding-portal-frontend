import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const persistedState = useSyncExternalStore(
    authenticationStore.subscribe,
    authenticationStore.get
  );
  useLoginRedirect();
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
        navigate(DASHBOARD);
      }
      if (session?.type === "admin") {
        navigate(ADMIN_PANEL_RICHIESTE);
      }
      resetQueries();
    },
    [navigate, resetQueries]
  );
  const logout = useCallback(
    (session: CurrentSession) => {
      authenticationStore.deleteSession(session);
      authenticationStore.setCurrentSession({ type: "none" });
      navigate(LOGIN);
      resetQueries();
      if (session?.type === "admin") {
        adminLogoutRedirect();
      }
    },
    [navigate, resetQueries]
  );
  const value = useMemo<AuthenticationContextType>(
    () => ({
      userSessionByFiscalCode,
      adminSessionByName,
      currentSession,
      currentUserFiscalCode:
        currentSession?.type === "user"
          ? currentSession.userFiscalCode
          : undefined,
      currentUserSession:
        currentSession?.type === "user"
          ? userSessionByFiscalCode[currentSession.userFiscalCode]
          : undefined,
      currentMerchantFiscalCode:
        currentSession?.type === "user"
          ? currentSession.merchantFiscalCode
          : undefined,
      currentMerchant:
        currentSession?.type === "user"
          ? userSessionByFiscalCode[
              currentSession.userFiscalCode
            ]?.merchants.find(
              merchant =>
                merchant.organization_fiscal_code ===
                currentSession.merchantFiscalCode
            )
          : undefined,
      currentAdminSession:
        currentSession?.type === "admin"
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
