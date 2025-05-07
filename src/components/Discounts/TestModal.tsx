import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

type Props = {
  isOpen: any;
  toggle: any;
  testRequest: any;
};

const TestModal = ({ isOpen, toggle, testRequest }: Props) => (
  <Modal isOpen={isOpen} toggle={toggle} size="md">
    <ModalHeader toggle={toggle}>Richiedi test</ModalHeader>
    <ModalBody>
      Se confermi, dichiari di avere concluso le implementazioni tecniche
      necessarie e il team di CGN procederà con un test funzionale secondo la
      modalità di riconoscimento che avete scelto.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button
        color="primary"
        onClick={() => {
          toggle();
          testRequest();
        }}
        style={{ width: "100%" }}
      >
        Conferma richiesta
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

export default TestModal;
