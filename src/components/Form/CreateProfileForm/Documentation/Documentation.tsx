import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
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
    <FormContainer>
      <Box sx={{ backgroundColor: "white", p: 4 }}>
        <h1>Ti diamo il benvenuto sul Portale Operatori</h1>
        <p>
          Prima di iniziare, consulta la documentazione tecnica.
          <br />
          Contiene tutte le informazioni sulla Convenzione e le istruzioni
          tecniche utili per richiedere l’adesione.
        </p>
        <div>
          <DocumentIcon />
          <a
            href="https://docs.pagopa.it/carta-giovani-nazionale"
            target="_blank"
            onClick={handleClick}
            rel="noreferrer"
          >
            Documentazione Tecnica
          </a>
        </div>
        <p>
          Premendo su Continua, dichiari di aver letto e compreso l’
          <a
            href="https://io.italia.it/carta-giovani-nazionale/informativa-operatori"
            target="_blank"
            rel="noreferrer"
          >
            informativa sulla privacy
          </a>{" "}
          relativa all’iniziativa.
        </p>
        <div>
          <Button
            sx={{ px: 7 }}
            color="primary"
            type="button"
            variant="contained"
            onClick={handleNext}
            disabled={!isDocumentationRead}
          >
            Continua
          </Button>
        </div>
      </Box>
    </FormContainer>
  );
};

export default Documentation;
