import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalProps } from "../../types";
import Button from "../Button/Button";

function PublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle} size="md">
      <ModalHeader toggle={onToggle}>Pubblica opportunità</ModalHeader>
      <ModalBody>
        Se pubblichi, l’opportunità diventerà visibile su App IO dai beneficiari
        di Carta Giovani Nazionale.
      </ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="primary"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          isPending={isPending}
          fullwidth
        >
          Sì, pubblica
        </Button>
        <Button color="primary" outline onClick={onToggle} fullwidth>
          No, torna indietro
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PublishModal;
