import { useState } from "react";
import { Button, Icon } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const StateModal = ({
  states,
  onSubmit
}: {
  states: string | undefined;
  onSubmit(states: string | undefined): void;
}) => {
  const [isOpenStateModal, setOpenStateModal] = useState(false);
  const [statesField, setFieldStates] = useState<string | undefined>(states);
  const toggleStateModal = () => {
    setOpenStateModal(!isOpenStateModal);
  };

  const getStatesLabel = (states?: string): string => {
    switch (states) {
      case "PendingAgreement":
        return "Da valutare";
      case "AssignedAgreementMe":
        return "In valutazione (da te)";
      case "AssignedAgreementOthers":
        return "In valutazione (da altri)";
      default:
        return "Stato";
    }
  };

  return (
    <>
      <div
        className="chip chip-lg m-1 cursor-pointer"
        onClick={toggleStateModal}
      >
        <span className="chip-label">{getStatesLabel(states)}</span>
        {states && (
          <button
            onClick={e => {
              e.stopPropagation();
              onSubmit(undefined);
            }}
          >
            <Icon color="" icon="it-close" size="" />
          </button>
        )}
      </div>
      <Modal isOpen={isOpenStateModal} toggle={toggleStateModal}>
        <ModalHeader toggle={toggleStateModal}>Filtra per stato</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mt-2">
            <div className="form-check">
              <input
                name="states"
                type="radio"
                id="PendingAgreement"
                value="PendingAgreement"
                onChange={() => setFieldStates("PendingAgreement")}
                checked={statesField === "PendingAgreement"}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="PendingAgreement"
              >
                <span className="text-sm">
                  {getStatesLabel("PendingAgreement")}
                </span>
              </label>
            </div>
            <div className="form-check">
              <input
                name="states"
                type="radio"
                value="AssignedAgreementMe"
                id="AssignedAgreementMe"
                onChange={() => setFieldStates("AssignedAgreementMe")}
                checked={statesField === "AssignedAgreementMe"}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="AssignedAgreementMe"
              >
                <span className="text-sm">
                  {getStatesLabel("AssignedAgreementMe")}
                </span>
              </label>
            </div>
            <div className="form-check">
              <input
                name="states"
                type="radio"
                id="AssignedAgreementOthers"
                value="AssignedAgreementOthers"
                onChange={() => setFieldStates("AssignedAgreementOthers")}
                checked={statesField === "AssignedAgreementOthers"}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="AssignedAgreementOthers"
              >
                <span className="text-sm">
                  {getStatesLabel("AssignedAgreementOthers")}
                </span>
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              onSubmit(statesField);
              toggleStateModal();
            }}
          >
            Ok
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default StateModal;
