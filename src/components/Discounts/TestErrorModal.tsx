import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export function TestErrorModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose(): void;
}) {
  return (
    <Modal isOpen={isOpen} toggle={onClose} size="md">
      <ModalHeader toggle={onClose}>
        Hai terminato tutti i codici sconto della lista
      </ModalHeader>
      <ModalBody className="mb-4">
        Per procedere con il test carica una nuova lista di codici
      </ModalBody>
    </Modal>
  );
}
