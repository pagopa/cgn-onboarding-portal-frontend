import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "design-react-kit";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

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
        <AsyncButton
          color="danger"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          fullwidth
          isPending={isPending}
        >
          Rimuovi
        </AsyncButton>
        <Button
          tag="button"
          color="primary"
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

export default DeleteModal;
