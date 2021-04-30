import React from "react";
import { Badge } from "design-react-kit";

const RequestStateBadge = (state: string) => {
  switch (state) {
    case "PendingAgreement":
      return (
        <Badge
          className="font-weight-normal"
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
          className="font-weight-normal"
          pill
          tag="span"
          style={{
            backgroundColor: "#EA7614",
            color: "white"
          }}
        >
          In valutazione
        </Badge>
      );
    case "ApprovedAgreement":
      return (
        <Badge className="font-weight-normal" color="success" pill tag="span">
          Approvato
        </Badge>
      );
    case "RejectedAgreement":
      return (
        <Badge className="font-weight-normal" color="danger" pill tag="span">
          Respinto
        </Badge>
      );
  }
};

export default RequestStateBadge;
