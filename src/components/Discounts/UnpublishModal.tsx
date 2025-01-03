import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { EntityType } from "../../api/generated";

type Props = {
  isOpen: any;
  toggle: any;
  unpublish: any;
};

const UnpublishModal = ({ isOpen, toggle, unpublish }: Props) => {
  const entityType = useSelector(
    (state: RootState) => state.agreement.value.entityType
  );
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Sospendi opportunità</ModalHeader>
      <ModalBody>
        Sei sicuro di voler riportare in bozza questa opportunità? Se non hai
        altre opportunità pubblicate in questo momento, non sarai più visibile
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
};

export default UnpublishModal;
