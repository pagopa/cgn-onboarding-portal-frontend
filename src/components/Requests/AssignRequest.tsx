import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Agreement } from "../../api/generated_backoffice";
import AsyncButton from "../AsyncButton/AsyncButton";

type Props = {
  assignedToMe: boolean;
  original: Agreement;
  assignAgreements(): void;
  isPending: boolean;
};

const AssignRequest = ({
  assignedToMe,
  original,
  assignAgreements,
  isPending
}: Props) => {
  const [isOpen, toggleAssign] = useState(false);

  const checkAssign = () =>
    original.state === "PendingAgreement"
      ? () => assignAgreements()
      : () => toggleAssign(true);

  return (
    <>
      {!assignedToMe && (
        <AsyncButton
          color="primary"
          onClick={checkAssign()}
          loading={isPending}
        >
          Prendi in carico
        </AsyncButton>
      )}
      <Dialog
        open={isOpen}
        onClose={() => toggleAssign(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Prendi in carico</DialogTitle>
        <DialogContent>
          Qualcun altro ha già preso in carico questa richiesta. Vuoi
          continuare?
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", gap: 1 }}>
          <AsyncButton
            color="primary"
            onClick={() => {
              assignAgreements();
              toggleAssign(false);
            }}
            loading={isPending}
            fullWidth
          >
            Conferma
          </AsyncButton>
          <Button
            color="primary"
            variant="outlined"
            type="button"
            onClick={() => toggleAssign(false)}
            fullWidth
          >
            Annulla
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignRequest;
