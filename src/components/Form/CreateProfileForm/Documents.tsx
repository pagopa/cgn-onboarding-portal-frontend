import React from "react";
import { Button, Icon } from "design-react-kit";
import FormContainer from "../FormContainer";
import DocumentIcon from "../../../assets/icons/document.svg";

type Props = {
  handleComplete: any;
  handleBack: any;
};

const Documents = ({ handleComplete, handleBack }: Props) => (
  <FormContainer className="mb-20">
    <div className="bg-white px-28 py-16">
      <p className="text-base font-weight-normal text-black">
        Per terminare la richiesta di convenzione scarica e firma digitalmente i
        documenti, poi ricaricali sul portale.
        <br /> I documenti sono precompilati con i dati che hai inserito finora,
        se vuoi effettuare delle modifiche, torna indietro
        <br /> nella compilazione prima di procedere.
      </p>
      <div className="border-bottom py-8">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <DocumentIcon className="mr-4" />
            <a href="#">Convenzione</a>
          </div>
          <Button color="primary" icon size="sm" tag="button">
            <Icon
              color="white"
              icon="it-upload"
              padding={false}
              size="xs"
              className="mr-2"
            />
            Carica
          </Button>
        </div>
      </div>
      <div className="border-bottom py-8">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row align-items-center">
            <DocumentIcon className="mr-4" />
            <a href="#">Allegato 1 - Manifestazione di interesse</a>
          </div>
          <Button color="primary" icon size="sm" tag="button">
            <Icon
              color="white"
              icon="it-upload"
              padding={false}
              size="xs"
              className="mr-2"
            />
            carica
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <Button
          className="px-14 mr-4"
          color="primary"
          outline
          tag="button"
          onClick={handleBack}
        >
          Indietro
        </Button>
        <Button
          className="px-14"
          color="primary"
          tag="button"
          onClick={handleComplete}
        >
          Richiedi approvazione
        </Button>
      </div>
    </div>
  </FormContainer>
);

export default Documents;
