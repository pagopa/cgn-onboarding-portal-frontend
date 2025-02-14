import React, { useEffect, useState } from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { remoteData } from "../../api/common";

const AssignRequest = ({
  assignedToMe,
  original,
  updateList,
  setLoading
}: {
  assignedToMe: boolean;
  original: any;
  updateList: () => void;
  setLoading: (l: boolean) => void;
}) => {
  const [isOpen, toggleAssign] = useState(false);

  const assignAgreementsMutation = remoteData.Backoffice.Agreement.assignAgreement.useMutation(
    {
      onSuccess() {
        updateList();
      }
    }
  );

  const assignAgreements = () => {
    assignAgreementsMutation.mutate({ agreementId: original.id });
  };

  useEffect(() => {
    setLoading(assignAgreementsMutation.isLoading);
  }, [assignAgreementsMutation.isLoading, setLoading]);

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
          className="ml-4"
          onClick={checkAssign()}
        >
          Prendi in carico
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
