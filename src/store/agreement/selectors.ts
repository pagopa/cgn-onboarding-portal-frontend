import { AgreementState } from "../../api/generated";
import type { RootState } from "../store";

export const selectAgreement = (state: RootState) => state.agreement.value;

/**
 * States in which the operator can still manage their content
 * (create discounts, edit operator data, edit profile).
 */
const OPERATOR_EDITABLE_STATES: ReadonlyArray<AgreementState> = [
  AgreementState.ApprovedAgreement,
  AgreementState.InactiveAgreement,
  AgreementState.TerminationReminderSentAgreement,
  AgreementState.TerminationInProgressAgreement
];

export const selectCanEditAgreement = (state: RootState): boolean =>
  OPERATOR_EDITABLE_STATES.includes(state.agreement.value.state);
