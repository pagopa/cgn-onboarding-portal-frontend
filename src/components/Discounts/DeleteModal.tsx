import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import { DiscountModalProps } from "../../types/discounts";

export function DeleteModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: DiscountModalProps) {
  return (
    <Modal isOpen={isOpen} toggle={onToggle}>
      <ModalHeader toggle={onToggle}>Elimina opportunità</ModalHeader>
      <ModalBody>Sei sicuro di voler eliminare questa opportunità?</ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="primary"
          onClick={() => {
            actionRequest();
            onToggle();
          }}
          disabled={isPending}
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center justify-content-center">
            {isPending && <SmallSpinner />}
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
