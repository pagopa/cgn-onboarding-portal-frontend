import { useState } from "react";
import { Button, Icon } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import AsyncButton from "../../../AsyncButton/AsyncButton";

type Props = {
  onDelete: () => void;
  isPending: boolean;
};

const DeleteDocument = ({ onDelete, isPending }: Props) => {
  const [isOpen, toggle] = useState(false);
  return (
    <>
      <span
        className="d-flex flex-row align-items-center cursor-pointer"
        onClick={() => toggle(true)}
      >
        <Icon icon="it-delete" size="sm" color="danger" />
        <span className="text-sm text-danger">Elimina</span>
      </span>
      <Modal isOpen={isOpen} toggle={() => toggle(false)} size="md">
        <ModalHeader toggle={() => toggle(false)}>
          Elimina documento
        </ModalHeader>
        <ModalBody>Sei sicuro di voler eliminare questo documento?</ModalBody>
        <ModalFooter className="d-flex flex-column">
          <AsyncButton
            color="primary"
            onClick={() => {
              onDelete();
              toggle(false);
            }}
            isPending={isPending}
            fullwidth
          >
            Elimina
          </AsyncButton>
          <Button
            color="primary"
            outline
            onClick={() => toggle(false)}
            style={{ width: "100%" }}
          >
            Annulla
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DeleteDocument;
