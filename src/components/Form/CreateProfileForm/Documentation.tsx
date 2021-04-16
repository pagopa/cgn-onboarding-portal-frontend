import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "design-react-kit";
import FormContainer from "../FormContainer";
import DocumentIcon from "../../../assets/icons/document.svg";
import { DASHBOARD } from "../../../navigation/routes";

const Documentation = ({ handleNext, handleSuccess }: any) => {
  const [isDocumentationRead, setIsDocumentationRead] = useState(false);
  const [isModal, setIsModal] = useState(false);

  function toggleModal() {
    setIsModal(!isModal);
  }

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
          <a className="font-weight-semibold" href="#">
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
    </FormContainer>
  );
};

export default Documentation;
