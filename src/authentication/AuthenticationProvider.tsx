import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { href, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { createAgreement } from "../store/agreement/agreementSlice";
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
  const navigate = useNavigate();
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
        navigate(href("/"));
      }
      if (session?.type === "admin") {
        navigate(href("/"));
      }
      resetQueries();
    },
    [navigate, resetQueries]
  );
  const logout = useCallback(
    (session: CurrentSession) => {
      authenticationStore.deleteSession(session);
      authenticationStore.setCurrentSession({ type: "none" });
      navigate(href("/login"));
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
  const dispatch = useDispatch();
  useEffect(() => {
    if (value.currentMerchantFiscalCode) {
      dispatch(createAgreement());
    }
  }, [dispatch, value.currentMerchantFiscalCode]);
  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}
