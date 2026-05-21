import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

function PublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onToggle} maxWidth="sm" fullWidth>
      <DialogTitle>Pubblica opportunita</DialogTitle>
      <DialogContent>
        Se pubblichi, l’opportunità diventerà visibile su App IO dai beneficiari
        di Carta Giovani Nazionale.
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
        <AsyncButton
          color="primary"
          variant="contained"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          loading={isPending}
          fullWidth
        >
          Si, pubblica
        </AsyncButton>
        <Button color="primary" variant="outlined" onClick={onToggle} fullWidth>
          No, torna indietro
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PublishModal;
