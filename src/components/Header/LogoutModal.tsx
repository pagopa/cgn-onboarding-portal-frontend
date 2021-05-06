import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { logout } from "../../utils/cookie";

type Props = {
  isOpen: any;
  toggle: any;
};

const LogoutModal = ({ isOpen, toggle }: Props) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md">
    <ModalHeader toggle={toggle}>Sei sicuro di voler uscire?</ModalHeader>
    <ModalBody>
      Salviamo i dati a ogni cambio di pagina. Per non perdere i dati inseriti
      in questa pagina, completa la compilazione e premi continua. Al tuo
      prossimo accesso atterrerai nel primo passaggio ancora da compilare.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button color="primary" onClick={logout} style={{ width: "100%" }}>
        Esci
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

export default LogoutModal;
