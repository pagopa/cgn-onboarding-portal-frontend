import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

const TestModal = ({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) => (
  <Dialog open={isOpen} onClose={onToggle} maxWidth="sm" fullWidth>
    <DialogTitle>Richiedi test</DialogTitle>
    <DialogContent>
      Se confermi, dichiari di avere concluso le implementazioni tecniche
      necessarie e il team di CGN procederà con un test funzionale secondo la
      modalità di riconoscimento che avete scelto.
    </DialogContent>
    <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
      <AsyncButton
        variant="contained"
        color="primary"
        onClick={() => {
          onToggle();
          actionRequest();
        }}
        fullWidth
        loading={isPending}
      >
        Conferma richiesta
      </AsyncButton>
      <Button variant="outlined" color="primary" onClick={onToggle} fullWidth>
        Annulla
      </Button>
    </DialogActions>
  </Dialog>
);

export default TestModal;
