import { Button } from "design-react-kit";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

type Props = {
  isOpen: boolean;
  onLogout: () => void;
};

const TerminatedModal = ({ isOpen, onLogout }: Props) => (
  <Modal isOpen={isOpen} size="md">
    <ModalHeader>Non hai più accesso al Portale operatori</ModalHeader>
    <ModalBody>
      La procedura di recesso è stata completata. Effettua nuovamente
      l&apos;accesso per continuare.
    </ModalBody>
    <ModalFooter className="d-flex flex-column">
      <Button color="primary" onClick={onLogout} style={{ width: "100%" }}>
        Esci
      </Button>
    </ModalFooter>
  </Modal>
);

export default TerminatedModal;
