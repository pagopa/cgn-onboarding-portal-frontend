import type { RootState } from "../store";

export const selectAgreement = (state: RootState) => state.agreement.value;
