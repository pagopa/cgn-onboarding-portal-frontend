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
  [OrganizationStatus.Approved]: { label: "Approvato", color: "warning" },
  [OrganizationStatus.Rejected]: { label: "Respinto", color: "danger" },
  [OrganizationStatus.Active]: { label: "Attivo", color: "success" },
  [OrganizationStatus.Inactive]: { label: "Inattivo", color: "warning" },
  [OrganizationStatus.TerminationReminderSent]: {
    label: "Richiamo",
    color: "warning"
  },
  [OrganizationStatus.TerminationInProgress]: {
    label: "In Recesso",
    color: "danger"
  },
  [OrganizationStatus.Terminated]: { label: "Cessato", color: "secondary" }
};

export const agreementBadgePill: Record<
  ApprovedAgreementState,
  { label: string; color: BadgeColor }
> = {
  [ApprovedAgreementState.Approved]: { label: "Approvato", color: "warning" },
  [ApprovedAgreementState.Active]: { label: "Attivo", color: "success" },
  [ApprovedAgreementState.Inactive]: { label: "Inattivo", color: "warning" },
  [ApprovedAgreementState.TerminationReminderSent]: {
    label: "Richiamo",
    color: "warning"
  },
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
  [DiscountState.Suspended]: { label: "Sospeso", color: "warning" },
  [DiscountState.TestPending]: { label: "Test", color: "warning" },
  [DiscountState.TestPassed]: { label: "Test superato", color: "success" },
  [DiscountState.TestFailed]: { label: "Test fallito", color: "danger" },
  [DiscountState.Published]: { label: "Pubblicato", color: "primary" },
  [DiscountState.Expired]: { label: "Scaduto", color: "secondary" }
};

export const requestBadgePill: Record<
  AgreementState,
  { label: string; color: BadgeColor }
> = {
  DraftAgreement: { label: "In Bozza", color: "primary" },
  PendingAgreement: { label: "Da valutare", color: "warning" },
  AssignedAgreement: { label: "In valutazione", color: "warning" },
  ApprovedAgreement: { label: "Approvato", color: "success" },
  RejectedAgreement: { label: "Respinto", color: "secondary" }
};
