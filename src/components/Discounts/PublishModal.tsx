import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import { DiscountModalProps } from "../../types/discounts";

function PublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: DiscountModalProps) {
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
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center justify-content-center">
            {isPending && <SmallSpinner />}
            Sì, pubblica
          </div>
        </Button>{" "}
        <Button
          color="primary"
          outline
          onClick={onToggle}
          style={{ width: "100%" }}
        >
          No, torna indietro
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PublishModal;
