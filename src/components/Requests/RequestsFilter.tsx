import { Box, Typography, TextField } from "@mui/material";
import DateModal from "../DateModal";
import StateModal from "./StateModal";
import { RequestsFilterFormValues } from "./Requests";

function RequestsFilter({
  values,
  onChange,
  onReset,
  hasActiveFitlers
}: {
  values: RequestsFilterFormValues;
  onChange(
    update:
      | RequestsFilterFormValues
      | ((values: RequestsFilterFormValues) => void)
  ): void;
  onReset(): void;
  hasActiveFitlers: boolean;
}) {
  return (
    <Box component="form">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#01254C" }}
          >
            {hasActiveFitlers
              ? "Risultati della ricerca"
              : "Richieste di convenzione"}
          </Typography>
          {hasActiveFitlers && (
            <Typography
              variant="caption"
              sx={{
                color: "#0073E6",
                fontWeight: 500,
                cursor: "pointer",
                ml: 1
              }}
              onClick={() => {
                onReset();
              }}
            >
              Esci
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexGrow: 1,
            flexWrap: "wrap"
          }}
        >
          <DateModal
            label="Data"
            title="Filtra per data"
            from={values.requestDateFrom}
            to={values.requestDateTo}
            onSubmit={(requestDateFrom, requestDateTo) => {
              onChange(values => ({
                ...values,
                requestDateFrom,
                requestDateTo
              }));
            }}
          />

          <StateModal
            states={values.states}
            onSubmit={states => {
              onChange(values => ({
                ...values,
                states
              }));
            }}
          />

          <TextField
            id="profileFullName"
            name="profileFullName"
            type="text"
            placeholder="Cerca Richiesta"
            value={values.profileFullName || ""}
            onChange={event => {
              const profileFullName = event.currentTarget.value;
              onChange(values => ({
                ...values,
                profileFullName
              }));
            }}
            size="small"
            sx={{ maxWidth: "275px" }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default RequestsFilter;
