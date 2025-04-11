import { z } from "zod";
import { authenticationStore } from "./authentication";
import { AuthenticationContextType } from "./AuthenticationContext";

const merchantInfoSchema = z.object({
  organization_name: z.string(),
  organization_fiscal_code: z.string(),
  email: z.string(),
  token: z.string()
});

const currentSessionSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("admin"),
      email: z.string()
    }),
    z.object({
      type: z.literal("user"),
      userFiscalCode: z.string(),
      merchantFiscalCode: z.string().optional()
    })
  ])
  .nullable();

export type CurrentSession = z.infer<typeof currentSessionSchema>;

const userSessionSchema = z.object({
  token: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  merchants: z.array(merchantInfoSchema)
});

export type UserSession = z.infer<typeof userSessionSchema>;

export const authenticationStateSchema = z.object({
  userNonceByState: z.record(z.string(), z.string()),
  userSessionByFiscalCode: z.record(z.string(), userSessionSchema),
  adminNonceByState: z.record(z.string(), z.string()),
  currentSession: currentSessionSchema
});

export type AuthenticationState = z.infer<typeof authenticationStateSchema>;

export const empty: AuthenticationState = {
  userNonceByState: {},
  userSessionByFiscalCode: {},
  adminNonceByState: {},
  currentSession: null
};

export function setUserNonceByState(state: string, nonce: string) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    userNonceByState: { ...data.userNonceByState, [state]: nonce }
  });
}

export function getUserNonceByState(state: string): string | undefined {
  const data = authenticationStore.get();
  return data.userNonceByState[state];
}

export function deleteUserNonceByState(state: string) {
  const data = authenticationStore.get();
  const { [state]: deleted, ...userNonceByState } = data.userNonceByState;
  authenticationStore.set({ ...data, userNonceByState });
}

export function setAdminNonceByState(state: string, nonce: string) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    adminNonceByState: { ...data.adminNonceByState, [state]: nonce }
  });
}

export function getAdminNonceByState(state: string): string | undefined {
  const data = authenticationStore.get();
  return data.adminNonceByState[state];
}

export function deleteAdminNonceByState(state: string) {
  const data = authenticationStore.get();
  const { [state]: deleted, ...adminNonceByState } = data.adminNonceByState;
  authenticationStore.set({ ...data, adminNonceByState });
}

export function setUserSession(fiscal_code: string, session: UserSession) {
  const data = authenticationStore.get();
  authenticationStore.set({
    ...data,
    userSessionByFiscalCode: {
      ...data.userSessionByFiscalCode,
      [fiscal_code]: session
    }
  });
}

export function setAdminSession() {
  // TODO
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
    // TODO remove admin token
  }
}

export function getUserToken(): string {
  const data = authenticationStore.get();
  if (data.currentSession?.type === "user") {
    return (
      data.userSessionByFiscalCode[data.currentSession.userFiscalCode]?.token ??
      ""
    );
  }
  return "";
  // returning empty, invalid or expired token here is fine since authentication errors are handled elsewhere
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
  // returning empty, invalid or expired token here is fine since authentication errors are handled elsewhere
}

export function getAdminToken(): string {
  // TODO
  return "";
}

export function getCurrentUserFiscalCode(state: AuthenticationContextType) {
  if (state.currentSession && state.currentSession.type === "user") {
    return state.currentSession.userFiscalCode;
  }
}

export function getCurrentUserSession(state: AuthenticationContextType) {
  if (state.currentSession && state.currentSession.type === "user") {
    return state.userSessionByFiscalCode[state.currentSession.userFiscalCode];
  }
}

export function getCurrentMerchantFiscalCode(state: AuthenticationContextType) {
  if (state.currentSession && state.currentSession.type === "user") {
    return state.currentSession.merchantFiscalCode;
  }
}

export function getCurrentMerchant(state: AuthenticationContextType) {
  if (state.currentSession && state.currentSession.type === "user") {
    const merchantFiscalCode = state.currentSession.merchantFiscalCode;
    return state.userSessionByFiscalCode[
      state.currentSession.userFiscalCode
    ]?.merchants.find(
      merchant => merchant.organization_fiscal_code === merchantFiscalCode
    );
  }
}
