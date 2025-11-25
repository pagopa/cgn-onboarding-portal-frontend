import { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Button } from "design-react-kit";
import { Agreement } from "../../api/generated_backoffice";
import AsyncButton from "../AsyncButton/AsyncButton";

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
        <AsyncButton
          color="primary"
          className="ms-4"
          onClick={checkAssign()}
          isPending={isPending}
        >
          Prendi in carico
        </AsyncButton>
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
          <AsyncButton
            color="primary"
            onClick={() => {
              assignAgreements();
              toggleAssign(false);
            }}
            isPending={isPending}
            fullwidth
          >
            Conferma
          </AsyncButton>
          <Button
            color="primary"
            outline
            tag="button"
            onClick={() => toggleAssign(false)}
            className="w-100"
          >
            Annulla
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AssignRequest;
