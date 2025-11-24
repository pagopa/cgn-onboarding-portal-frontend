import { useState } from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Agreement } from "../../api/generated_backoffice";
import SmallSpinner from "../SmallSpinner/SmallSpinner";

type Props = {
  assignedToMe: boolean;
  original: Agreement;
  assignAgreements(): void;
  isPending: boolean;
};

const AssignRequest = ({
  assignedToMe,
  original,
  assignAgreements,
  isPending
}: Props) => {
  const [isOpen, toggleAssign] = useState(false);

  const checkAssign = () =>
    original.state === "PendingAgreement"
      ? () => assignAgreements()
      : () => toggleAssign(true);

  return (
    <>
      {!assignedToMe && (
        <Button
          color="primary"
          tag="button"
          className="ms-4"
          onClick={checkAssign()}
        >
          <div className="d-flex align-items-center">
            {isPending && <SmallSpinner />}
            Prendi in carico
          </div>
        </Button>
      )}
      <Modal isOpen={isOpen} toggle={() => toggleAssign(false)} size="md">
        <ModalHeader toggle={() => toggleAssign(false)}>
          Prendi in carico
        </ModalHeader>
        <ModalBody>
          Qualcun altro ha già preso in carico questa richiesta. Vuoi
          continuare?
        </ModalBody>
        <ModalFooter className="d-flex flex-column">
          <Button
            color="primary"
            onClick={() => {
              assignAgreements();
              toggleAssign(false);
            }}
            style={{ width: "100%" }}
          >
            Conferma
          </Button>
          <Button
            color="primary"
            outline
            onClick={() => toggleAssign(false)}
            style={{ width: "100%" }}
          >
            Annulla
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AssignRequest;
