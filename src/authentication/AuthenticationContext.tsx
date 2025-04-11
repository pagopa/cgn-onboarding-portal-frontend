import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import { authenticationStore } from "./authentication";
import {
  UserSession,
  CurrentSession,
  setCurrentSession,
  deleteSession
} from "./authenticationState";

export type AuthenticationContextType = {
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
