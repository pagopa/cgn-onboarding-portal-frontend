import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: any;
  toggle: any;
  suspend: any;
};

const SuspendModal = ({ isOpen, toggle, suspend }: Props) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md">
    <ModalHeader toggle={toggle}>Sospendi agevolazione</ModalHeader>
    <ModalBody>
      Sei sicuro di voler sospendere questa agevolazione? Se non hai altre
      agevolazioni pubblicate in questo momento, non sarai più visibile nella
      lista degli operatori aderenti all&lsquo;iniziativa.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button
        color="danger"
        onClick={() => {
          toggle();
          suspend();
        }}
        style={{ width: "100%" }}
      >
        Sospendi
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

export default SuspendModal;
