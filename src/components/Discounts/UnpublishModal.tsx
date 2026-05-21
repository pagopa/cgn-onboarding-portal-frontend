import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

function UnpublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onToggle} maxWidth="sm" fullWidth>
      <DialogTitle>Sospendi opportunità</DialogTitle>
      <DialogContent>
        Sei sicuro di voler riportare in bozza questa opportunità? Se non hai
        altre opportunità pubblicate in questo momento, non sarai più visibile
        nella lista degli operatori aderenti all&lsquo;iniziativa.
      </DialogContent>
      <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
        <AsyncButton
          variant="contained"
          color="error"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          fullWidth
          loading={isPending}
        >
          Torna in bozza
        </AsyncButton>
        <Button variant="outlined" color="primary" onClick={onToggle} fullWidth>
          Annulla
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnpublishModal;
