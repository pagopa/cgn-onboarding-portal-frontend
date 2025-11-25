import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalProps } from "../../types";
import Button from "../Button/Button";

function DeleteModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} size="md">
      <ModalHeader toggle={onToggle}>Rimuovi operatore</ModalHeader>
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
            onToggle();
            actionRequest();
          }}
          fullwidth
          isPending={isPending}
        >
          Rimuovi
        </Button>
        <Button color="primary" outline onClick={onToggle} fullwidth>
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteModal;
