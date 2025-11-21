import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";

type Props = {
  isOpen: boolean;
  toggle(): void;
  unpublish(): void;
  isLoading: boolean;
};

function UnpublishModal({ isOpen, toggle, unpublish, isLoading }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Sospendi opportunità</ModalHeader>
      <ModalBody>
        Sei sicuro di voler riportare in bozza questa opportunità? Se non hai
        altre opportunità pubblicate in questo momento, non sarai più visibile
        nella lista degli operatori aderenti all&lsquo;iniziativa.
      </ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="danger"
          onClick={() => {
            toggle();
            unpublish();
          }}
          style={{ width: "100%" }}
        >
          <div className="d-flex align-items-center justify-content-center">
            {isLoading && <SmallSpinner />}
            Torna in bozza
          </div>
        </Button>{" "}
        <Button
          color="primary"
          outline
          onClick={toggle}
          style={{ width: "100%" }}
        >
          Annulla
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UnpublishModal;
