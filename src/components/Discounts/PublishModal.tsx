import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "design-react-kit";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

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
        <AsyncButton
          color="primary"
          onClick={() => {
            onToggle();
            actionRequest();
          }}
          isPending={isPending}
          fullwidth
        >
          Sì, pubblica
        </AsyncButton>
        <Button
          color="primary"
          tag="button"
          outline
          onClick={onToggle}
          className="w-100"
        >
          No, torna indietro
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PublishModal;
