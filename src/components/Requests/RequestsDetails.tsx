import React, { useState, useEffect } from "react";
import { Button, Icon } from "design-react-kit";
import DocumentIcon from "../../assets/icons/document.svg";
import Api from "../../api/backoffice";
import RequestItem from "./RequestsDetailsItem";
import RequestsDocuments from "./RequestsDocuments";
import { useTooltip, Severity } from "../../context/tooltip";

const RequestsDetails = ({ original, updateList, setLoading }) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [checkAllDocs, setCheckAllDocs] = useState(false);
  const { triggerTooltip } = useTooltip();

  const assignAgreementsApi = async () => {
    setLoading(true);
    await Api.Agreement.assignAgreement(original.id)
      .then(() => updateList())
      .catch(() => setLoading(false));
  };

  const approveAgreementApi = async () => {
    setLoading(true);
    await Api.Agreement.approveAgreement(original.id)
      .then(() => {
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata validata con successo.",
          title: "Validazione Effettuata"
        });
      })
      .catch(() => setLoading(false));
  };

  const rejectAgreementApi = async () => {
    setLoading(true);
    await Api.Agreement.rejectAgreement(original.id, {
      reasonMessage: rejectMessage
    })
      .then(() => {
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata rifiutata con successo.",
          title: "Rifiuto inviato"
        });
        updateList();
      })
      .catch(() => setLoading(false));
  };

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
      <RequestsDocuments
        original={original}
        setCheckAllDocs={setCheckAllDocs}
      />
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
            disabled={original.state === "PendingAgreement" || !checkAllDocs}
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
