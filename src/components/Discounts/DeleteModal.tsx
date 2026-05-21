import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import AsyncButton from "../AsyncButton/AsyncButton";
import { ModalProps } from "../../types";

export function DeleteModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onToggle} maxWidth="sm" fullWidth>
      <DialogTitle>Elimina opportunità</DialogTitle>
      <DialogContent>
        Sei sicuro di voler eliminare questa opportunità?
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
        <AsyncButton
          variant="contained"
          color="primary"
          onClick={() => {
            actionRequest();
            onToggle();
          }}
          fullWidth
          loading={isPending}
        >
          Elimina
        </AsyncButton>
        <Button variant="outlined" color="primary" onClick={onToggle} fullWidth>
          Annulla
        </Button>
      </DialogActions>
    </Dialog>
  );
}
