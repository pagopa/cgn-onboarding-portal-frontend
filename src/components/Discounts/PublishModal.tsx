import React from "react";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Profile } from "../../api/generated";

type Props = {
  isOpen: boolean;
  toggle(): void;
  publish(): void;
  profile?: Profile;
};

function PublishModal({ isOpen, toggle, publish, profile }: Props) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Pubblica opportunità</ModalHeader>
      <ModalBody>
        {profile && profile.salesChannel.channelType !== "OfflineChannel"
          ? "Se pubblichi, l’opportunità diventerà visibile su App IO dai beneficiari di Carta Giovani Nazionale."
          : "Hai informato il personale addetto alle casse o alla relazione col pubblico? Se pubblichi, l’opportunità diventerà visibile su App IO dai beneficiari di Carta Giovani Nazionale."}
      </ModalBody>
      <ModalFooter className="d-flex flex-column">
        <Button
          color="primary"
          onClick={() => {
            toggle();
            publish();
          }}
          style={{ width: "100%" }}
        >
          Sì, pubblica
        </Button>{" "}
        <Button
          color="primary"
          outline
          onClick={toggle}
          style={{ width: "100%" }}
        >
          No, torna indietro
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default PublishModal;
