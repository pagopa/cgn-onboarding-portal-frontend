import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SmallSpinner from "../SmallSpinner/SmallSpinner";
import { DiscountModalProps } from "../../types/discounts";

const TestModal = ({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: DiscountModalProps) => (
  <Modal isOpen={isOpen} toggle={onToggle} size="md">
    <ModalHeader toggle={onToggle}>Richiedi test</ModalHeader>
    <ModalBody>
      Se confermi, dichiari di avere concluso le implementazioni tecniche
      necessarie e il team di CGN procederà con un test funzionale secondo la
      modalità di riconoscimento che avete scelto.
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
          Conferma richiesta
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

export default TestModal;
