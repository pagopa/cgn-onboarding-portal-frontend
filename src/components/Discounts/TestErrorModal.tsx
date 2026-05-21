import { Dialog, DialogTitle, DialogContent } from "@mui/material";

export function TestErrorModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose(): void;
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Hai terminato tutti i codici sconto della lista</DialogTitle>
      <DialogContent sx={{ mb: 2 }}>
        Per procedere con il test carica una nuova lista di codici
      </DialogContent>
    </Dialog>
  );
}
