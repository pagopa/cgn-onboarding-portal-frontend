import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import { DiscountModalProps } from "../../types/discounts";

function UnpublishModal({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: DiscountModalProps) {
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
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center justify-content-center">
            {isPending && <SmallSpinner />}
            Torna in bozza
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

export default UnpublishModal;
