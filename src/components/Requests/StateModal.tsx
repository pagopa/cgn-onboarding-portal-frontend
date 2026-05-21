import { TextField, MenuItem } from "@mui/material";

const STATE_OPTIONS = [
  { value: "PendingAgreement", label: "Da valutare" },
  { value: "AssignedAgreementMe", label: "In valutazione (da te)" },
  { value: "AssignedAgreementOthers", label: "In valutazione (da altri)" }
] as const;

const StateModal = ({
  states,
  onSubmit
}: {
  states: string | undefined;
  onSubmit(states: string | undefined): void;
}) => (
  <TextField
    select
    size="small"
    label="Stato"
    value={states ?? ""}
    onChange={e => onSubmit(e.target.value || undefined)}
    sx={{ minWidth: 220 }}
  >
    <MenuItem value="">Tutti gli stati</MenuItem>
    {STATE_OPTIONS.map(opt => (
      <MenuItem key={opt.value} value={opt.value}>
        {opt.label}
      </MenuItem>
    ))}
  </TextField>
);

export default StateModal;
