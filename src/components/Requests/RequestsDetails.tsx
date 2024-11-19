import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api/backoffice";
import { RootState } from "../../store/store";
import { useTooltip, Severity } from "../../context/tooltip";
import { Agreement, EntityType } from "../../api/generated_backoffice";
import { getEntityTypeLabel } from "../../utils/strings";
import RequestItem from "./RequestsDetailsItem";
import RequestsDocuments from "./RequestsDocuments";
import AssignRequest from "./AssignRequest";

const RequestsDetails = ({
  original,
  updateList,
  setLoading
}: {
  original: Agreement;
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

  const entityType = original.entityType as EntityType;

  const assignedToMe =
    `${user.given_name} ${user.family_name}` ===
    (original as any).assignee?.fullName;

  const approveAgreementApi = async () =>
    await tryCatch(() => Api.Agreement.approveAgreement(original.id), toError)
      .fold(
        () => setLoading(false),
        response => {
          if (response.status === 204) {
            updateList();
            triggerTooltip({
              severity: Severity.SUCCESS,
              text:
                "La richiesta di convenzione è stata validata con successo.",
              title: "Validazione Effettuata"
            });
          } else {
            triggerTooltip({
              severity: Severity.DANGER,
              text: "Errore durante la validazione"
            });
          }
          setLoading(false);
        }
      )
      .run();

  const approveAgreement = () => {
    setLoading(true);
    void approveAgreementApi();
  };

  const rejectAgreementApi = async () =>
    await tryCatch(
      () =>
        Api.Agreement.rejectAgreement(original.id, {
          reasonMessage: rejectMessage
        }),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        () => {
          setLoading(false);
          updateList();
          triggerTooltip({
            severity: Severity.SUCCESS,
            text: "La richiesta di convenzione è stata rifiutata con successo.",
            title: "Rifiuto inviato"
          });
        }
      )
      .run();

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
          label="Tipologia ente"
          value={getEntityTypeLabel(entityType)}
        />
        {entityType === EntityType.Private && (
          <React.Fragment>
            <RequestItem
              label="Numero opportunità proposte"
              value={original.discounts?.length}
            />
            <div className="ml-3">
              {original.discounts?.map((doc: { name: any }, i: number) => (
                <RequestItem
                  key={i}
                  label={`Opportunità #${i + 1}`}
                  value={doc.name}
                />
              ))}
            </div>
          </React.Fragment>
        )}
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
