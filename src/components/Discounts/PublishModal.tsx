import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: any;
  toggle: any;
  publish: any;
};

const PublishModal = ({ isOpen, toggle, publish }: Props) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md">
    <ModalHeader toggle={toggle}>Pubblica agevolazione</ModalHeader>
    <ModalBody>
      Attenzione: hai terminato tutte le integrazioni tecniche per la
      validazione tramite API? Se procedi con la pubblicazione gli utenti
      utilizzeranno un codice generato che non troverà nessun riscontro
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button
        color="primary"
        onClick={() => {
          toggle();
          publish();
        }}
        style={{ width: "100%" }}
      >
        Pubblica
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

export default PublishModal;
