import { ReactNode } from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AsyncButton from "../AsyncButton/AsyncButton";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  body: ReactNode;
  onConfirm: () => void;
  isPending?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
};

const ConfirmModal = ({
  isOpen,
  onClose,
  title,
  body,
  onConfirm,
  isPending = false,
  confirmLabel = "Sì, continua",
  cancelLabel = "No, torna indietro"
}: ConfirmModalProps) => (
  <Modal isOpen={isOpen} toggle={onClose}>
    <ModalHeader toggle={onClose}>{title}</ModalHeader>
    <ModalBody>{body}</ModalBody>
    <ModalFooter>
      <Button color="primary" outline onClick={onClose}>
        {cancelLabel}
      </Button>
      <AsyncButton color="primary" onClick={onConfirm} isPending={isPending}>
        {confirmLabel}
      </AsyncButton>
    </ModalFooter>
  </Modal>
);

export default ConfirmModal;
