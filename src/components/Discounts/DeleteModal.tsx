import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AsyncButton from "../Button/Button";
import { ModalProps } from "../../types";

export function DeleteModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <ModalHeader toggle={onToggle}>Elimina opportunità</ModalHeader>
      <ModalBody>Sei sicuro di voler eliminare questa opportunità?</ModalBody>
      <ModalFooter className="d-flex flex-column">
        <AsyncButton
          color="primary"
          onClick={() => {
            actionRequest();
            onToggle();
          }}
          fullwidth
          isPending={isPending}
        >
          Elimina
        </AsyncButton>
        <Button
          color="primary"
          outline
          onClick={onToggle}
          style={{ width: "100%" }}
        >
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}
