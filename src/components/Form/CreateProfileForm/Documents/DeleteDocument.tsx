import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { useState } from "react";
import AsyncButton from "../../../AsyncButton/AsyncButton";

type Props = {
  onDelete: () => void;
  isPending: boolean;
};

const DeleteDocument = ({ onDelete, isPending }: Props) => {
  const [isOpen, toggle] = useState(false);
  return (
    <>
      <span
        onClick={() => toggle(true)}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <DeleteIcon
          sx={{ fontSize: "18px", color: "#d32f2f", marginRight: "4px" }}
        />
        <span>Elimina</span>
      </span>
      <Dialog open={isOpen} onClose={() => toggle(false)}>
        <DialogTitle>Elimina documento</DialogTitle>
        <DialogContent>
          Sei sicuro di voler eliminare questo documento?
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
          <AsyncButton
            sx={{ fontSize: "inherit" }}
            onClick={() => {
              onDelete();
              toggle(false);
            }}
            loading={isPending}
            fullWidth
          >
            Elimina
          </AsyncButton>
          <Button
            sx={{ fontSize: "inherit" }}
            variant="outlined"
            onClick={() => toggle(false)}
            fullWidth
          >
            Annulla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDocument;
