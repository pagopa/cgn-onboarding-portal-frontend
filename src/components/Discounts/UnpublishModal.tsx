import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: any;
  toggle: any;
  unpublish: any;
};

const UnpublishModal = ({ isOpen, toggle, unpublish }: Props) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md">
    <ModalHeader toggle={toggle}>Sospendi agevolazione</ModalHeader>
    <ModalBody>
      Sei sicuro di voler riportare in bozza questa agevolazione? Se non hai
      altre agevolazioni pubblicate in questo momento, non sarai più visibile
      nella lista degli operatori aderenti all&lsquo;iniziativa.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button
        color="danger"
        onClick={() => {
          toggle();
          unpublish();
        }}
        style={{ width: "100%" }}
      >
        Torna in bozza
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

export default UnpublishModal;
