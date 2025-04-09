import React, { useEffect, useState } from "react";
import { Button } from "design-react-kit";
import { remoteData } from "../../api/common";
import { useTooltip, Severity } from "../../context/tooltip";
import { Agreement, EntityType } from "../../api/generated_backoffice";
import { getEntityTypeLabel } from "../../utils/strings";
import { useAuthentication } from "../../authentication/authentication";
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
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [checkAllDocs, setCheckAllDocs] = useState(false);
  const { triggerTooltip } = useTooltip();

  const authentication = useAuthentication();
  const user =
    authentication.currentSession?.type === "user"
      ? authentication.userSessionByFiscalCode[
          authentication.currentSession.userFiscalCode
        ]
      : null;

  const entityType = original.entityType as EntityType;

  const assignedToMe =
    `${user?.first_name} ${user?.last_name}` ===
    (original as any).assignee?.fullName;

  const approveAgreementMutation =
    remoteData.Backoffice.Agreement.approveAgreement.useMutation({
      onSuccess() {
        setLoading(false);
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata validata con successo.",
          title: "Validazione Effettuata"
        });
      },
      onError() {
        setLoading(false);
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Errore durante la validazione"
        });
      }
    });
  const approveAgreement = () => {
    approveAgreementMutation.mutate({ agreementId: original.id });
  };

  const rejectAgreementMutation =
    remoteData.Backoffice.Agreement.rejectAgreement.useMutation({
      onSuccess() {
        setLoading(false);
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata rifiutata con successo.",
          title: "Rifiuto inviato"
        });
      },
      onError() {
        setLoading(false);
      }
    });
  const rejectAgreement = () => {
    rejectAgreementMutation.mutate({
      agreementId: original.id,
      refusal: {
        reasonMessage: rejectMessage
      }
    });
  };

  useEffect(() => {
    setLoading(
      approveAgreementMutation.isLoading || rejectAgreementMutation.isLoading
    );
  }, [
    approveAgreementMutation.isLoading,
    rejectAgreementMutation.isLoading,
    setLoading
  ]);

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
