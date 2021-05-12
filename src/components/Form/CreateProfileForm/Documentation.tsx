import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "design-react-kit";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FormContainer from "../FormContainer";
import DocumentIcon from "../../../assets/icons/document.svg";
import { DASHBOARD } from "../../../navigation/routes";

type Props = {
  isCompleted: boolean;
  handleNext: any;
  handleSuccess: any;
};

const Documentation = ({ isCompleted, handleNext, handleSuccess }: Props) => {
  const [isDocumentationRead, setIsDocumentationRead] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  function handleClick(e: any) {
    e.preventDefault();
    setIsDocumentationRead(true);
  }

  return (
    <FormContainer className="mb-10">
      <div className="bg-white px-28 py-16">
        <h1 className="h4 font-weight-bold text-dark-blue">
          Benvenuto sul Portale Operatori di Carta Giovani Nazionale
        </h1>
        <p className="mt-10 text-base font-weight-normal text-black">
          Prima di iniziare, prendi visione della Documentazione Tecnica.
          <br /> Contiene tutte le informazioni circa il processo di Convenzione
          e le
          <br /> istruzioni tecniche che descrivono le implementazioni
          necessarie per aderire.
        </p>
        <div className="mt-4 d-flex flex-row align-items-center">
          <DocumentIcon className="mr-5" />
          <a className="font-weight-semibold" href="#" onClick={handleClick}>
            Documentazione Tecnica
          </a>
        </div>
        <p className="mt-8 text-sm font-weight-normal text-gray">
          Cliccando su Continua, dichiari di aver letto e compreso l’
          <a className="font-weight-semibold" href="#" onClick={toggle}>
            informativa sulla privacy
          </a>{" "}
          relativa all’iniziativa.
        </p>
        <div className="mt-10">
          <Link to={DASHBOARD} className="btn btn-outline-primary mr-2 px-14">
            Annulla
          </Link>
          <Button
            className="px-14"
            color="primary"
            tag="button"
            onClick={() => {
              handleSuccess(0);
              handleNext();
            }}
            disabled={!isDocumentationRead}
          >
            Continua
          </Button>
        </div>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} className="mx-auto">
            Elimina agevolazione
          </ModalHeader>
          <ModalBody>
            Sei sicuro di voler eliminare questa agevolazione?
          </ModalBody>
          <ModalFooter className="d-flex flex-column">
            <Button color="primary" onClick={toggle} style={{ width: "100%" }}>
              Elimina
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
      </div>
    </FormContainer>
  );
};

export default Documentation;
