import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  onDelete: () => void;
};

function DeleteModal({ isOpen, toggle, onDelete }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Rimuovi operatore</ModalHeader>
      <ModalBody>
        Sei sicuro di voler rimuovere questo operatore? In questo modo
        l&lsquo;operatore non potrà più accedere al portale operatori e se ha
        opportunità pubblicate in questo momento non sarà più in grado di
        modificarle.
      </ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="danger"
          onClick={() => {
            toggle();
            onDelete();
          }}
          style={{ width: "100%" }}
        >
          Rimuovi
        </Button>{" "}
        <Button
          color="primary"
          outline
          onClick={toggle}
          style={{ width: "100%" }}
        >
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteModal;
