import { DiscountState } from "../api/generated";
import {
  AgreementState,
  ApprovedAgreementState,
  OrganizationStatus
} from "../api/generated_backoffice";
import { BadgeColor } from "../components/BadgePill";

export const organizationStatusBadge: Record<
  OrganizationStatus,
  { label: string; color: BadgeColor }
> = {
  [OrganizationStatus.Draft]: { label: "In Bozza", color: "primary" },
  [OrganizationStatus.Pending]: { label: "Da valutare", color: "warning" },
  [OrganizationStatus.Approved]: { label: "Approvata", color: "warning" },
  [OrganizationStatus.Rejected]: { label: "Rifiutata", color: "danger" },
  [OrganizationStatus.Active]: { label: "Attivo", color: "success" },
  [OrganizationStatus.Inactive]: { label: "Inattiva", color: "warning" },
  [OrganizationStatus.TerminationInProgress]: {
    label: "In Recesso",
    color: "danger"
  },
  [OrganizationStatus.Terminated]: { label: "Cessata", color: "secondary" }
};

export const agreementBadgePill: Record<
  ApprovedAgreementState,
  { label: string; color: BadgeColor }
> = {
  [ApprovedAgreementState.Approved]: { label: "Approvato", color: "warning" },
  [ApprovedAgreementState.Active]: { label: "Attivo", color: "success" },
  [ApprovedAgreementState.Inactive]: { label: "Inattivo", color: "warning" },
  [ApprovedAgreementState.TerminationInProgress]: {
    label: "In recesso",
    color: "danger"
  },
  [ApprovedAgreementState.Terminated]: { label: "Cessato", color: "secondary" }
};

export const discountBadgePill: Record<
  DiscountState,
  { label: string; color: BadgeColor }
> = {
  [DiscountState.Draft]: { label: "Bozza", color: "secondary" },
  [DiscountState.Suspended]: { label: "Sospesa", color: "warning" },
  [DiscountState.TestPending]: { label: "Test", color: "warning" },
  [DiscountState.TestPassed]: { label: "Test superato", color: "success" },
  [DiscountState.TestFailed]: { label: "Test fallito", color: "danger" },
  [DiscountState.Published]: { label: "Pubblicata", color: "primary" },
  [DiscountState.Expired]: { label: "Scaduta", color: "secondary" }
};

export const requestBadgePill: Record<
  AgreementState,
  { label: string; color: BadgeColor }
> = {
  PendingAgreement: { label: "Da valutare", color: "warning" },
  AssignedAgreement: { label: "In valutazione", color: "primary" },
  ApprovedAgreement: { label: "Approvata", color: "success" },
  RejectedAgreement: { label: "Respinta", color: "secondary" }
};
