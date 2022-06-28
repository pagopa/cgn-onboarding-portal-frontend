import { Button } from "design-react-kit";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Api from "../../api/backoffice";

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

  const assignAgreementsApi = () =>
    pipe(
      TE.tryCatch(() => Api.Agreement.assignAgreement(original.id), toError),
      TE.map(_ => {
        updateList();
        setLoading(false);
      }),
      TE.mapLeft(_ => setLoading(false))
    )();

  const assignAgreements = () => {
    setLoading(true);
    void assignAgreementsApi();
  };

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
