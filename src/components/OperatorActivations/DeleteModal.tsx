import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

function DeleteModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onToggle} maxWidth="sm" fullWidth>
      <DialogTitle>Rimuovi operatore</DialogTitle>
      <DialogContent>
        Sei sicuro di voler rimuovere questo operatore? In questo modo
        l&lsquo;operatore non potra piu accedere al portale operatori e se ha
        opportunita pubblicate in questo momento non sara piu in grado di
        modificarle.
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
        <AsyncButton
          color="error"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          fullWidth
          loading={isPending}
          variant="contained"
        >
          Rimuovi
        </AsyncButton>
        <Button color="primary" variant="outlined" onClick={onToggle} fullWidth>
          Annulla
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteModal;
