import { Button } from "design-react-kit";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../api/backoffice";
import { Severity, useTooltip } from "../../context/tooltip";
import { RootState } from "../../store/store";
import AssignRequest from "./AssignRequest";
import RequestItem from "./RequestsDetailsItem";
import RequestsDocuments from "./RequestsDocuments";

const RequestsDetails = ({
  original,
  updateList,
  setLoading
}: {
  original: any;
  updateList: () => void;
  setLoading: (state: boolean) => void;
}) => {
  const { data: user }: { data: any } = useSelector(
    (state: RootState) => state.user
  );
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [checkAllDocs, setCheckAllDocs] = useState(false);
  const { triggerTooltip } = useTooltip();

  const assignedToMe =
    `${user.given_name} ${user.family_name}` === original.assignee?.fullName;

  const approveAgreementApi = () =>
    pipe(
      TE.tryCatch(() => Api.Agreement.approveAgreement(original.id), toError),
      TE.map(response => {
        if (response.status === 204) {
          updateList();
          triggerTooltip({
            severity: Severity.SUCCESS,
            text: "La richiesta di convenzione è stata validata con successo.",
            title: "Validazione Effettuata"
          });
        } else {
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Errore durante la validazione"
          });
        }
        setLoading(false);
      }),
      TE.mapLeft(_ => setLoading(false))
    )();

  const approveAgreement = () => {
    setLoading(true);
    void approveAgreementApi();
  };

  const rejectAgreementApi = async () =>
    pipe(
      TE.tryCatch(
        () =>
          Api.Agreement.rejectAgreement(original.id, {
            reasonMessage: rejectMessage
          }),
        toError
      ),
      TE.map(_ => {
        setLoading(false);
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata rifiutata con successo.",
          title: "Rifiuto inviato"
        });
      }),
      TE.mapLeft(_ => setLoading(false))
    )();

  const rejectAgreement = () => {
    setLoading(true);
    void rejectAgreementApi();
  };

  return (
    <section className="px-6 py-4 bg-white">
      <h1 className="h5 font-weight-bold text-dark-blue mb-5">Dettagli</h1>
      <div className="container">
        <RequestItem
          label="Ragione sociale operatore"
          value={original.profile?.fullName}
        />
        <RequestItem
          label="Numero agevolazioni proposte"
          value={original.discounts?.length}
        />
        <div className="ml-3">
          {original.discounts?.map((doc: { name: any }, i: number) => (
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
          value={`${original.profile?.referent.firstName} ${original.profile?.referent.lastName}`}
        />
        <RequestItem
          label="Indirizzo e-mail"
          value={original.profile?.referent.emailAddress}
        />
        <RequestItem
          label="Numero di telefono diretto"
          value={original.profile?.referent.telephoneNumber}
        />
      </div>
      <RequestsDocuments
        original={original}
        assignedToMe={assignedToMe}
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
            onClick={rejectAgreement}
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
            disabled={!assignedToMe}
          >
            Rifiuta
          </Button>
          <Button
            color="primary"
            tag="button"
            className="ml-4"
            onClick={approveAgreement}
            disabled={
              !assignedToMe ||
              original.state === "PendingAgreement" ||
              !checkAllDocs
            }
          >
            Approva
          </Button>
          <AssignRequest
            original={original}
            assignedToMe={assignedToMe}
            updateList={updateList}
            setLoading={setLoading}
          />
        </div>
      )}
    </section>
  );
};

export default RequestsDetails;
