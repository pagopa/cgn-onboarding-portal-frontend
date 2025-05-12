import { createContext, useContext } from "react";
import {
  UserSession,
  CurrentSession,
  AdminSession,
  MerchantInfo
} from "./authenticationState";

export type AuthenticationContextType = {
  userSessionByFiscalCode: Record<string, UserSession>;
  adminSessionByName: Record<string, AdminSession>;
  currentSession: CurrentSession;
  currentUserFiscalCode?: string;
  currentUserSession?: UserSession;
  currentMerchantFiscalCode?: string;
  currentMerchant?: MerchantInfo;
  currentAdminSession?: AdminSession;
  setCurrentSession(session: CurrentSession): void;
  logout(session: CurrentSession): void;
};

export const AuthenticationContext = createContext<AuthenticationContextType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any
);

export function useAuthentication() {
  return useContext(AuthenticationContext);
}
