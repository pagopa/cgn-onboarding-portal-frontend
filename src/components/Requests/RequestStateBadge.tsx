import { Badge } from "design-react-kit";
import { AgreementState } from "../../api/generated_backoffice";

const RequestStateBadge = (state: AgreementState) => {
  switch (state) {
    case "PendingAgreement":
      return (
        <Badge
          className="fw-normal"
          color="#FFFFFF"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#0073E6",
            border: "1px solid #0073E6"
          }}
          pill
          tag="span"
        >
          Da valutare
        </Badge>
      );
    case "AssignedAgreement":
      return (
        <Badge
          className="fw-normal"
          pill
          tag="span"
          color="#EA7614"
          style={{
            backgroundColor: "#EA7614",
            color: "white"
          }}
        >
          In valutazione
        </Badge>
      );
  }
};

export default RequestStateBadge;
