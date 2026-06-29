import { useMemo, useState } from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { BadgePill } from "../BadgePill";

const stateOptions = [
  "PendingAgreement",
  "AssignedAgreement",
  "DraftAgreement",
  "RejectedAgreement"
] as const;

const stateLabels: Record<string, string> = {
  DraftAgreement: "In Bozza",
  PendingAgreement: "Da valutare",
  AssignedAgreement: "In valutazione",
  ApprovedAgreement: "Approvato",
  RejectedAgreement: "Respinto"
};

const getStatesLabel = (states?: string): string =>
  (states && stateLabels[states]) || "Stato";

type StateModalProps = {
  states: string | undefined;
  onSubmit(states: string | undefined): void;
};

const StateModal = ({ states, onSubmit }: StateModalProps) => {
  const [isOpenStateModal, setOpenStateModal] = useState(false);
  const [statesField, setStatesField] = useState<string | undefined>(states);
  const toggleStateModal = () => {
    setOpenStateModal(!isOpenStateModal);
  };

  const stateRadios = useMemo(
    () =>
      stateOptions.map(value => (
        <div key={value} className="form-check">
          <input
            name="states"
            type="radio"
            id={value}
            value={value}
            onChange={() => setStatesField(value)}
            checked={statesField === value}
          />
          <label
            className="text-sm fw-normal text-black form-label"
            htmlFor={value}
          >
            <span className="text-sm">{getStatesLabel(value)}</span>
          </label>
        </div>
      )),
    [statesField]
  );

  return (
    <>
      <BadgePill
        color="secondary"
        label={getStatesLabel(states)}
        active={!!states}
        onClick={toggleStateModal}
        onClear={() => onSubmit(undefined)}
      />
      <Modal isOpen={isOpenStateModal} toggle={toggleStateModal}>
        <ModalHeader toggle={toggleStateModal}>Filtra per stato</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-column mt-2">{stateRadios}</div>
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
