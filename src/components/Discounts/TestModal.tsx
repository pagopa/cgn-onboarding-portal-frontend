import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "design-react-kit";
import { ModalProps } from "../../types";
import AsyncButton from "../AsyncButton/AsyncButton";

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
      <AsyncButton
        color="primary"
        onClick={() => {
          onToggle();
          actionRequest();
        }}
        fullwidth
        isPending={isPending}
      >
        Conferma richiesta
      </AsyncButton>
      <Button
        color="primary"
        tag="button"
        outline
        onClick={onToggle}
        className="w-100"
      >
        Annulla
      </Button>
    </ModalFooter>
  </Modal>
);

export default TestModal;
