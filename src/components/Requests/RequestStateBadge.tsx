import { AgreementState } from "../../api/generated_backoffice";

const StateChip = ({
  label,
  backgroundColor
}: {
  label: string;
  backgroundColor: string;
}) => (
  <div className="chip chip-sm" style={{ backgroundColor }}>
    <span className="chip-label">{label}</span>
  </div>
);

const RequestStateBadge = (state: AgreementState) => {
  switch (state) {
    case "PendingAgreement":
      return <StateChip label="Da valutare" backgroundColor="#995C00" />;
    case "AssignedAgreement":
      return <StateChip label="In valutazione" backgroundColor="#EA7614" />;
    case "RejectedAgreement":
      return <StateChip label="Respinta" backgroundColor="#5C6F82" />;
  }
};

export default RequestStateBadge;
