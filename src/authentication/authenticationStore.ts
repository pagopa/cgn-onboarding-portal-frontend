import { load, save, watch } from "../utils/localStoragePersistance";
import { makeStore } from "../utils/SimpleStore";
import {
  UserSession,
  AdminSession,
  CurrentSession,
  AuthenticationState,
  authenticationStateSchema,
  empty
} from "./authenticationState";

function excludeExpiredTokens(data: AuthenticationState): AuthenticationState {
  const now = Date.now() / 1000;
  return {
    ...data,
    userNonceByState: Object.fromEntries(
      Object.entries(data.userNonceByState).filter(([, { exp }]) => exp > now)
    ),
    adminNonceByState: Object.fromEntries(
      Object.entries(data.adminNonceByState).filter(([, { exp }]) => exp > now)
    ),
    userSessionByFiscalCode: Object.fromEntries(
      Object.entries(data.userSessionByFiscalCode).filter(
        ([, { exp }]) => exp > now
      )
    ),
    adminSessionByName: Object.fromEntries(
      Object.entries(data.adminSessionByName).filter(([, { exp }]) => exp > now)
    )
  };
}

const LOCAL_STORAGE_KEY = "oneidentity";

const store = makeStore(
  excludeExpiredTokens(
    load({
      key: LOCAL_STORAGE_KEY,
      validate: authenticationStateSchema.validateSync.bind(
        authenticationStateSchema
      ),
      empty
    })
  )
);

store.subscribe(() => {
  save({ key: LOCAL_STORAGE_KEY, value: store.get() });
});
watch({
  key: LOCAL_STORAGE_KEY,
  validate: authenticationStateSchema.validateSync.bind(
    authenticationStateSchema
  ),
  listener: store.set
});

const NONCE_DURATION = 15 * 60 * 1000;

export const authenticationStore = {
  get: store.get,
  set: store.set,
  subscribe: store.subscribe,
  getCurrentSession() {
    const data = store.get();
    return data.currentSession;
  },
  getUserSessionByFiscalCode(fiscal_code: string): UserSession | undefined {
    const data = store.get();
    return data.userSessionByFiscalCode[fiscal_code];
  },
  getAdminSessionByName(name: string): AdminSession | undefined {
    const data = store.get();
    return data.adminSessionByName[name];
  },
  setUserNonceByState(state: string, nonce: string) {
    const data = store.get();
    store.set({
      ...data,
      userNonceByState: {
        ...data.userNonceByState,
        [state]: { nonce, exp: Date.now() + NONCE_DURATION }
      }
    });
  },
  getUserNonceByState(state: string): string | undefined {
    const data = store.get();
    return data.userNonceByState[state]?.nonce;
  },
  deleteUserNonceByState(state: string) {
    const data = store.get();
    const { [state]: deleted, ...userNonceByState } = data.userNonceByState;
    store.set({ ...data, userNonceByState });
  },
  setAdminNonceByState(state: string, nonce: string) {
    const data = store.get();
    store.set({
      ...data,
      adminNonceByState: {
        ...data.adminNonceByState,
        [state]: { nonce, exp: Date.now() + NONCE_DURATION }
      }
    });
  },
  getAdminNonceByState(state: string): string | undefined {
    const data = store.get();
    return data.adminNonceByState[state]?.nonce;
  },
  deleteAdminNonceByState(state: string) {
    const data = store.get();
    const { [state]: deleted, ...adminNonceByState } = data.adminNonceByState;
    store.set({ ...data, adminNonceByState });
  },
  setUserSession(fiscal_code: string, session: UserSession) {
    const data = store.get();
    store.set({
      ...data,
      userSessionByFiscalCode: {
        ...data.userSessionByFiscalCode,
        [fiscal_code]: session
      }
    });
  },
  setAdminSession(name: string, session: AdminSession) {
    const data = store.get();
    store.set({
      ...data,
      adminSessionByName: { ...data.adminSessionByName, [name]: session }
    });
  },
  setCurrentSession(session: CurrentSession) {
    const data = store.get();
    store.set({
      ...data,
      currentSession: session
    });
  },
  deleteSession(session: CurrentSession) {
    const data = store.get();
    if (session?.type === "user") {
      const { [session.userFiscalCode]: deleted, ...userSessionByFiscalCode } =
        data.userSessionByFiscalCode;
      store.set({
        ...data,
        userSessionByFiscalCode
      });
    }
    if (session?.type === "admin") {
      const { [session.name]: deleted, ...adminSessionByName } =
        data.adminSessionByName;
      store.set({
        ...data,
        adminSessionByName
      });
    }
  },
  getMerchantToken(): string {
    const data = store.get();
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
    // returning empty, invalid or expired token here is fine since authentication errors are handled on 401
  },
  getAdminToken(): string {
    const data = store.get();
    if (data.currentSession?.type === "admin") {
      return data.adminSessionByName[data.currentSession.name]?.token ?? "";
    }
    return "";
    // returning empty, invalid or expired token here is fine since authentication errors are handled on 401
  }
};
