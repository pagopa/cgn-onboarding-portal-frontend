import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import Hourglass from "../../../../assets/icons/hourglass.svg?react";
import { DASHBOARD } from "../../../../navigation/routes";

const RequestApproval = () => (
  <Box component="section" sx={{ backgroundColor: "white", p: 4, mt: 2 }}>
    <div>
      <h1>Richiesta di convenzione inviata</h1>
      <Hourglass />
      <div>
        La tua richiesta è in attesa di approvazione.
        <br />
        Il referente riceverà una e-mail appena sarà approvata.
      </div>
      <Link to={DASHBOARD}>
        <Button
          sx={{ px: 7, mr: 2 }}
          color="primary"
          variant="outlined"
          type="button"
        >
          Esci
        </Button>
      </Link>
    </div>
  </Box>
);
export default RequestApproval;
