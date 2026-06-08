import { AgreementState } from "../../api/generated_backoffice";
import { StateBadge } from "../StateBadge";

const RequestStateBadge = (state: AgreementState) => {
  switch (state) {
    case "PendingAgreement":
      return <StateBadge color="warning">Da valutare</StateBadge>;
    case "AssignedAgreement":
      return <StateBadge color="primary">In valutazione</StateBadge>;
    case "RejectedAgreement":
      return <StateBadge color="secondary">Respinta</StateBadge>;
  }
};

export default RequestStateBadge;
