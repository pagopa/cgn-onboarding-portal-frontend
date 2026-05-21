import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

type Props = {
  isOpen: boolean;
  toggle(): void;
  logout(): void;
};

const LogoutModal = ({ isOpen, toggle, logout }: Props) => (
  <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
    <DialogTitle>Sei sicuro di voler uscire?</DialogTitle>
    <DialogContent>
      Salviamo i dati a ogni cambio di pagina. Per non perdere i dati inseriti
      in questa pagina, completa la compilazione e premi continua. Al tuo
      prossimo accesso atterrerai nel primo passaggio ancora da compilare.
    </DialogContent>
    <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
      <Button variant="contained" color="primary" onClick={logout} fullWidth>
        Esci
      </Button>
      <Button variant="outlined" color="primary" onClick={toggle} fullWidth>
        Annulla
      </Button>
    </DialogActions>
  </Dialog>
);

export default LogoutModal;
