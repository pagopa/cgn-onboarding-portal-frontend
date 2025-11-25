import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalProps } from "../../types";
import Button from "../Button/Button";

function UnpublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} size="md">
      <ModalHeader toggle={onToggle}>Sospendi opportunità</ModalHeader>
      <ModalBody>
        Sei sicuro di voler riportare in bozza questa opportunità? Se non hai
        altre opportunità pubblicate in questo momento, non sarai più visibile
        nella lista degli operatori aderenti all&lsquo;iniziativa.
      </ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="danger"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          fullwidth
          isPending={isPending}
        >
          Torna in bozza
        </Button>
        <Button color="primary" outline onClick={onToggle} fullwidth>
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UnpublishModal;
