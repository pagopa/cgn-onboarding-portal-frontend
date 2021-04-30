import React, { useState, useEffect } from "react";
import { Button, Icon } from "design-react-kit";
import DocumentIcon from "../../assets/icons/document.svg";
import Api from "../../api/backoffice";
import RequestItem from "./RequestsDetailsItem";
import { useTooltip, Severity } from "../../context/tooltip";

const RequestsDetails = ({ original, updateList }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const { triggerTooltip } = useTooltip();

  const assignAgreementsApi = async () => {
    await Api.Agreement.assignAgreement(original.id);
    updateList();
  };

  const approveAgreementApi = async () => {
    await Api.Agreement.approveAgreement(original.id);
    triggerTooltip({
      severity: Severity.SUCCESS,
      text: "La richiesta di convenzione è stata validata con successo.",
      title: "Validazione Effettuata"
    });
    updateList();
  };

  const rejectAgreementApi = async () => {
    await Api.Agreement.rejectAgreement(original.id, {
      reasonMessage: rejectMessage
    });
    triggerTooltip({
      severity: Severity.SUCCESS,
      text: "La richiesta di convenzione è stata rifiutata con successo.",
      title: "Rifiuto inviato"
    });
    updateList();
  };

  const getDocumentsApi = async () => {
    const response = await Api.Document.getDocuments(original.id);
    setDocuments(response.data);
  };

  const uploadDocumentApi = async (documentType: string) => {
    await Api.Document.uploadDocument(original.id, documentType);
  };

  const deleteDocumentApi = async (documentType: string) => {
    await Api.Document.deleteDocument(original.id, documentType);
  };

  useEffect(() => {
    getDocumentsApi();
    triggerTooltip({
      severity: Severity.SUCCESS,
      text: "La richiesta di convenzione è stata validata con successo.",
      title: "Validazione Effettuata"
    });
  }, []);

  return (
    <section className="px-6 py-4 bg-white">
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">Dettagli</h1>
      <div className="container">
        <RequestItem
          label="Ragione sociale operatore"
          value={original.profile.fullName}
        />
        <RequestItem
          label="Numero agevolazioni proposte"
          value={original.discounts.length}
        />
        <div className="ml-3">
          {original.discounts.map((doc: { name: any }, i: number) => (
            <RequestItem
              key={i}
              label={`Agevolazione #${i + 1}`}
              value={doc.name}
            />
          ))}
        </div>
      </div>
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">
        Dati del referente incaricato
      </h1>
      <div className="container">
        <RequestItem
          label="Nome e cognome"
          value={`${original.profile.referent.firstName} ${original.profile.referent.lastName}`}
        />
        <RequestItem
          label="Indirizzo e-mail"
          value={original.profile.referent.emailAddress}
        />
        <RequestItem
          label="Numero di telefono"
          value={original.profile.referent.telephoneNumber}
        />
      </div>
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">Documenti</h1>
      {original.documents.map((doc, i) => (
        <div key={i} className="border-bottom py-5">
          <div className="d-flex flex-row justify-content-between align-items-center">
            <div>
              <div className="mb-3 text-gray">
                {doc.documentType === "Agreement"
                  ? "Convenzione"
                  : `Allegato ${i + 1}`}
              </div>
              <div className="d-flex flex-row align-items-center">
                <DocumentIcon className="mr-4" />
                <a href={doc.documentUrl} target="_blank">
                  {doc.documentUrl.split("/").pop()}
                </a>
              </div>
            </div>
            {// TODO file non caricato
            true ? (
              <Button
                color="primary"
                icon
                size="sm"
                tag="button"
                disabled={original.state === "PendingAgreement"}
                onClick={() => uploadDocumentApi(doc.documentType)}
              >
                <Icon
                  color="white"
                  icon="it-upload"
                  padding={false}
                  size="xs"
                  className="mr-2"
                />
                Carica controfirmato
              </Button>
            ) : (
              <Button
                color="primary"
                outline
                icon
                size="sm"
                tag="button"
                onClick={() => deleteDocumentApi(doc.documentType)}
              >
                <Icon
                  color="white"
                  icon="it-delete"
                  padding={false}
                  size="xs"
                  className="mr-2"
                />
                Elimina
              </Button>
            )}
          </div>
        </div>
      ))}
      {rejectMode ? (
        <div className="mt-10">
          <h6 className="text-gray">Aggiungi una nota</h6>
          <p>
            Inserisci una nota di spiegazione riguardo al motivo per cui
            l’esercente non può essere convenzionato in questo momento. La nota
            sarà visibile all’operatore.
          </p>
          <div className="form-group">
            <textarea
              id="rejectMessage"
              value={rejectMessage}
              onChange={e => setRejectMessage(e.target.value)}
              rows={5}
              maxLength={250}
              placeholder="Inserisci una descrizione"
            />
          </div>
          <Button
            color="primary"
            outline
            tag="button"
            className="ml-4"
            onClick={() => {
              setRejectMode(false);
              setRejectMessage("");
            }}
          >
            Annulla
          </Button>
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={rejectAgreementApi}
            disabled={!rejectMessage.length}
          >
            Invia rifiuto
          </Button>
        </div>
      ) : (
        <div className="mt-10">
          <Button
            color="primary"
            outline
            tag="button"
            className="ml-4"
            onClick={() => setRejectMode(true)}
            disabled={original.state === "PendingAgreement"}
          >
            Rifiuta
          </Button>
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={approveAgreementApi}
            disabled={original.state === "PendingAgreement"}
          >
            Approva
          </Button>
          {original.state !== "AssignedAgreement" && (
            <Button
              color="primary"
              tag="button"
              className="ml-4"
              onClick={assignAgreementsApi}
            >
              Prendi in carica
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export default RequestsDetails;
