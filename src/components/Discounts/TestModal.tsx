import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ModalProps } from "../../types";
import Button from "../Button/Button";

const TestModal = ({
  isOpen,
  onToggle,
  actionRequest,
  isPending
}: ModalProps) => (
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
        fullwidth
        isPending={isPending}
      >
        Conferma richiesta
      </Button>
      <Button color="primary" outline onClick={onToggle} fullwidth>
        Annulla
      </Button>
    </ModalFooter>
  </Modal>
);

export default TestModal;
