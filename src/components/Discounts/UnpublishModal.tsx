import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "design-react-kit";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

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
        <AsyncButton
          color="danger"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          fullwidth
          isPending={isPending}
        >
          Torna in bozza
        </AsyncButton>
        <Button
          color="primary"
          tag="button"
          outline
          onClick={onToggle}
          className="w-100"
        >
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UnpublishModal;
