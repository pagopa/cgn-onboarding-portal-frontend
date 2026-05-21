import { Chip, Box, Typography } from "@mui/material";
import { format } from "date-fns";
import Hourglass from "../../assets/icons/hourglass.svg?react";
import { AgreementState as AgreementStateType } from "../../api/generated";
import Check from "../../assets/icons/check.svg?react";

type Props = {
  state: AgreementStateType;
  startDate?: string;
};

const DateLabel = ({
  title,
  date
}: {
  title: string;
  date: string | undefined;
}) => {
  const newDate = format(new Date(date ?? ""), "dd/MM/yyyy");
  return (
    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
      <Typography variant="caption" sx={{ color: "#5C6F82", fontWeight: 300 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: "bold", color: "black" }}>
        {newDate}
      </Typography>
    </Box>
  );
};

const AgreementState = ({ state, startDate }: Props) => (
  <Box
    sx={{
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      px: 2
    }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        pt: 3.5,
        fontSize: "1rem",
        fontWeight: 600,
        color: "#01254C",
        textTransform: "uppercase",
        letterSpacing: "0.1em"
      }}
    >
      PagoPA
    </Typography>
    <Box sx={{ my: 2 }}>
      {state === AgreementStateType.ApprovedAgreement && (
        <Chip label="Convenzione attiva" color="primary" size="small" />
      )}
      {state === AgreementStateType.PendingAgreement && (
        <Chip
          label="Richiesta di convenzione inviata"
          size="small"
          sx={{ backgroundColor: "#EA7614", color: "white" }}
        />
      )}
    </Box>
    <Box sx={{ p: 1.5 }}>
      {state === AgreementStateType.ApprovedAgreement && <Check />}
      {state === AgreementStateType.PendingAgreement && <Hourglass />}
    </Box>
    {state === AgreementStateType.ApprovedAgreement && (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          pb: 5,
          flexWrap: "wrap",
          width: "100%"
        }}
      >
        <DateLabel title="Data di inizio" date={startDate} />
      </Box>
    )}
    {state === AgreementStateType.PendingAgreement && (
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "#5C6F82" }}
      >
        La tua richiesta è in attesa di approvazione.
        <br />
        Il referente riceverà una e-mail appena sarà approvata.
      </Typography>
    )}
  </Box>
);

export default AgreementState;
