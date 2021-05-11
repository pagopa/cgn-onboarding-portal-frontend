import React, { useRef, useState, useEffect } from "react";
import { Button, Icon } from "design-react-kit";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import FormContainer from "../FormContainer";
import DocumentIcon from "../../../assets/icons/document.svg";
import Api from "../../../api";
import DocumentSuccess from "../../../assets/icons/document-success.svg";
import { RootState } from "../../../store/store";

type Props = {
  handleBack: () => void;
  handleNext: () => void;
  isCompleted: boolean;
};

const DeleteDocument = ({ onClick }: any) => (
  <span className="d-flex flex-row align-items-center" onClick={onClick}>
    <Icon icon="it-delete" size="sm" color="primary" />
    <span className="text-sm text-blue">Elimina</span>
  </span>
);

const Documents = ({ handleNext, handleBack, isCompleted }: Props) => {
  const [isManifestationUploaded, setIsManifestationUploaded] = useState(false);
  const [isAgreementUploaded, setIsAgreementUploaded] = useState(false);
  const manifestationFile = useRef<any>();
  const agreementFile = useRef<any>();
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const handleManifestationClick = () => {
    manifestationFile.current.click();
  };

  const handleAgreementClick = () => {
    agreementFile.current.click();
  };

  const getTemplates = async (type: string) =>
    await tryCatch(
      () => Api.DocumentTemplate.downloadDocumentTemplate(agreement.id, type),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        response => {
          console.log(response);
          const blob = new Blob([response], { type: "application/pdf" });
          saveAs(blob, type);
        }
      )
      .run();

  const addFiles = async (files: any, type: string) =>
    await tryCatch(
      () => Api.Document.uploadDocument(agreement.id, type, files[0]),
      toError
    )
      .fold(
        () => void 0,
        () => {
          switch (type) {
            case "agreement":
              setIsAgreementUploaded(true);
              break;
            case "manifestation_of_interest":
              setIsManifestationUploaded(true);
              break;
          }
        }
      )
      .run();

  const getFiles = async () =>
    await tryCatch(() => Api.Document.getDocuments(agreement.id), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        response => {
          console.log(response);
        }
      )
      .run();

  const requireApproval = () => {
    void Api.Agreement.requestApproval(agreement.id).then(() => handleNext());
  };

  useEffect(() => {
    void getFiles();
  }, []);

  return (
    <FormContainer className="mb-20">
      <div className="bg-white px-28 py-16">
        <p className="text-base font-weight-normal text-black">
          Per terminare la richiesta di convenzione scarica e firma digitalmente
          i documenti, poi ricaricali sul portale.
          <br /> I documenti sono precompilati con i dati che hai inserito
          finora, se vuoi effettuare delle modifiche, torna indietro
          <br /> nella compilazione prima di procedere.
        </p>
        <div className="border-bottom py-8">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-center">
              {!isAgreementUploaded ? (
                <DocumentIcon className="mr-4" />
              ) : (
                <DocumentSuccess className="mr-4" />
              )}
              <a href="#">Convenzione</a>
            </div>
            <div className="d-flex flex-row">
              <Button
                color="primary"
                icon
                size="sm"
                tag="button"
                className="mr-2"
                onClick={() => getTemplates("agreement")}
              >
                <Icon
                  color="white"
                  icon="it-download"
                  padding={false}
                  size="xs"
                />
                Scarica
              </Button>
              {!isAgreementUploaded && (
                <Button
                  color="primary"
                  icon
                  size="sm"
                  tag="button"
                  onClick={handleAgreementClick}
                >
                  <Icon
                    color="white"
                    icon="it-upload"
                    padding={false}
                    size="xs"
                    className="mr-2"
                  />
                  Carica
                  <input
                    type="file"
                    hidden
                    ref={agreementFile}
                    onChange={() =>
                      addFiles(agreementFile.current.files, "agreement")
                    }
                  />
                </Button>
              )}
            </div>
            {isAgreementUploaded && (
              <DeleteDocument onClick={() => setIsAgreementUploaded(false)} />
            )}
          </div>
        </div>
        <div className="border-bottom py-8">
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-center">
              {!isManifestationUploaded ? (
                <DocumentIcon className="mr-4" />
              ) : (
                <DocumentSuccess className="mr-4" />
              )}
              <a href="#">Allegato 1 - Manifestazione di interesse</a>
            </div>
            <div className="d-flex flex-row">
              <Button
                color="primary"
                icon
                size="sm"
                tag="button"
                className="mr-2"
                onClick={() => getTemplates("manifestation_of_interest")}
              >
                <Icon
                  color="white"
                  icon="it-download"
                  padding={false}
                  size="xs"
                />
                Scarica
              </Button>
              {!isManifestationUploaded && (
                <Button
                  color="primary"
                  icon
                  size="sm"
                  tag="button"
                  onClick={handleManifestationClick}
                >
                  <Icon
                    color="white"
                    icon="it-upload"
                    padding={false}
                    size="xs"
                    className="mr-2"
                  />
                  Carica
                  <input
                    type="file"
                    hidden
                    ref={manifestationFile}
                    onChange={() =>
                      addFiles(
                        manifestationFile.current.files,
                        "manifestation_of_interest"
                      )
                    }
                  />
                </Button>
              )}
            </div>
            {isManifestationUploaded && (
              <DeleteDocument
                onClick={() => setIsManifestationUploaded(false)}
              />
            )}
          </div>
        </div>
        {isAgreementUploaded && isManifestationUploaded && (
          <p className="mt-8 text-gray">
            Invia la tua candidatura per approvazione. <br />
            Invieremo un messaggio all’indirizzo e-mail del referente con
            l’esito.
          </p>
        )}
        <div className="mt-10">
          {!(isAgreementUploaded && isManifestationUploaded) && (
            <Button
              className="px-14 mr-4"
              color="primary"
              outline
              tag="button"
              onClick={handleBack}
            >
              Indietro
            </Button>
          )}
          {isAgreementUploaded && isManifestationUploaded && (
            <Button
              className="px-14"
              color="primary"
              tag="button"
              onClick={requireApproval}
            >
              Richiedi approvazione
            </Button>
          )}
        </div>
      </div>
    </FormContainer>
  );
};

export default Documents;
