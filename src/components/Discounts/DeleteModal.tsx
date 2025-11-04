import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";

export function DeleteModal({
  isOpen,
  onToggle,
  onDelete,
  isLoading
}: {
  isOpen: boolean;
  onToggle(): void;
  onDelete(): void;
  isLoading: boolean;
}) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <ModalHeader toggle={onToggle}>Elimina opportunità</ModalHeader>
      <ModalBody>Sei sicuro di voler eliminare questa opportunità?</ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="primary"
          onClick={() => {
            onDelete();
            onToggle();
          }}
          disabled={isLoading}
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center">
            {isLoading && <SmallSpinner />}
            Elimina
          </div>
        </Button>{" "}
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
