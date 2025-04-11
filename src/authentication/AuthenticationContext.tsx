import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { useHistory } from "react-router-dom";
import { ADMIN_PANEL_RICHIESTE, DASHBOARD, ROOT } from "../navigation/routes";
import { authenticationStore, resetQueries } from "./LoginRedirect";
import {
  UserSession,
  CurrentSession,
  setCurrentSession,
  deleteSession,
  AdminSession
} from "./authenticationState";

export type AuthenticationContextType = {
  userSessionByFiscalCode: Record<string, UserSession>;
  adminSessionByName: Record<string, AdminSession>;
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
  const history = useHistory();
  const historyPush = history.push;
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
  const changeSession = useCallback(
    (session: CurrentSession) => {
      setCurrentSession(session);
      if (session?.type === "user") {
        historyPush(DASHBOARD);
      }
      if (session?.type === "admin") {
        historyPush(ADMIN_PANEL_RICHIESTE);
      }
      resetQueries();
    },
    [historyPush]
  );
  const logout = useCallback(
    (session: CurrentSession) => {
      deleteSession(session);
      setCurrentSession(null);
      historyPush(ROOT);
      resetQueries();
    },
    [historyPush]
  );
  const value = useMemo<AuthenticationContextType>(
    () => ({
      userSessionByFiscalCode,
      adminSessionByName,
      currentSession,
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
