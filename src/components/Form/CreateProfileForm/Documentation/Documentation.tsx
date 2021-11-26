import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "design-react-kit";
import FormContainer from "../../FormContainer";
import DocumentIcon from "../../../../assets/icons/document.svg";
import { DASHBOARD } from "../../../../navigation/routes";

const Documentation = ({
  handleNext,
  isCompleted
}: {
  handleNext: () => void;
  isCompleted: boolean;
}) => {
  const [isDocumentationRead, setIsDocumentationRead] = useState(isCompleted);

  function handleClick() {
    setIsDocumentationRead(true);
    return true;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <a
            className="font-weight-semibold"
            href="https://io.italia.it/carta-giovani-nazionale/guida-operatori"
            target="_blank"
            onClick={handleClick}
            rel="noreferrer"
          >
            Documentazione Tecnica
          </a>
        </div>
        <p className="mt-8 text-sm font-weight-normal text-gray">
          Cliccando su Continua, dichiari di aver letto e compreso l’
          <a
            className="font-weight-semibold cursor-pointer"
            href="https://io.italia.it/carta-giovani-nazionale/informativa-operatori"
            target="_blank"
            rel="noreferrer"
          >
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
            onClick={handleNext}
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
