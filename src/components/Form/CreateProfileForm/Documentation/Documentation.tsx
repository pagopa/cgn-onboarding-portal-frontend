import { useEffect, useState } from "react";
import { Button } from "design-react-kit";
import FormContainer from "../../FormContainer";
import DocumentIcon from "../../../../assets/icons/document.svg?react";

const Documentation = ({
  handleNext,
  isCompleted
}: {
  handleNext: () => void;
  isCompleted: boolean;
}) => {
  const [isDocumentationRead, setIsDocumentationRead] = useState(isCompleted);

  const handleClick = () => {
    setIsDocumentationRead(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <FormContainer className="mb-10">
      <div className="bg-white px-28 py-16">
        <h1 className="h4 font-weight-bold text-dark-blue">
          Ti diamo il benvenuto sul Portale Operatori
        </h1>
        <p className="mt-10 text-base fw-normal text-black">
          Prima di iniziare, consulta la documentazione tecnica.
          <br />
          Contiene tutte le informazioni sulla Convenzione e le istruzioni
          tecniche utili per richiedere l’adesione.
        </p>
        <div className="mt-4 d-flex flex-row align-items-center">
          <DocumentIcon className="me-5" />
          <a
            className="fw-semibold"
            href="https://docs.pagopa.it/carta-giovani-nazionale"
            target="_blank"
            onClick={handleClick}
            rel="noreferrer"
          >
            Documentazione Tecnica
          </a>
        </div>
        <p className="mt-8 text-sm fw-normal text-gray">
          Premendo su Continua, dichiari di aver letto e compreso l’
          <a
            className="fw-semibold cursor-pointer"
            href="https://io.italia.it/carta-giovani-nazionale/informativa-operatori"
            target="_blank"
            rel="noreferrer"
          >
            informativa sulla privacy
          </a>{" "}
          relativa all’iniziativa.
        </p>
        <div className="mt-10">
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
