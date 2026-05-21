import { Chip } from "@mui/material";
import { AgreementState } from "../../api/generated_backoffice";

const RequestStateBadge = (state: AgreementState) => {
  switch (state) {
    case "PendingAgreement":
      return (
        <Chip
          label="Da valutare"
          size="small"
          variant="outlined"
          sx={{
            color: "#0073E6",
            borderColor: "#0073E6",
            backgroundColor: "white"
          }}
        />
      );
    case "AssignedAgreement":
      return (
        <Chip
          label="In valutazione"
          size="small"
          sx={{ backgroundColor: "#EA7614", color: "white" }}
        />
      );
  }
};

export default RequestStateBadge;
