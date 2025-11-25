import { Fragment, useState } from "react";
import { Button } from "design-react-kit";
import { remoteData } from "../../api/common";
import { useTooltip, Severity } from "../../context/tooltip";
import { AgreementState, EntityType } from "../../api/generated_backoffice";
import { getEntityTypeLabel } from "../../utils/strings";
import { useAuthentication } from "../../authentication/AuthenticationContext";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import { NormalizedBackofficeAgreement } from "../../api/dtoTypeFixes";
import AsyncButton from "../AsyncButton/AsyncButton";
import RequestItem from "./RequestsDetailsItem";
import RequestsDocuments from "./RequestsDocuments";
import AssignRequest from "./AssignRequest";

type RejectButtonsProps = {
  rejectMessage: string;
  setRejectMessage: (value: string) => void;
  setRejectMode: (value: boolean) => void;
  rejectAgreement: () => void;
  isPending: boolean;
};

type ActionButtonsProps = {
  assignedToMe: boolean;
  original: NormalizedBackofficeAgreement;
  checkAllDocs: boolean;
  approveIsPending: boolean;
  assignIsPending: boolean;
  assignAgreements: () => void;
  approveAgreement: () => void;
  setRejectMode: (value: boolean) => void;
};

type Props = {
  original: NormalizedBackofficeAgreement;
  updateList: () => void;
};

function RejectButtons({
  rejectMessage,
  setRejectMessage,
  setRejectMode,
  rejectAgreement,
  isPending
}: RejectButtonsProps) {
  return (
    <div className="mt-10">
      <h6 className="text-gray">Aggiungi una nota</h6>
      <p>
        Inserisci una nota di spiegazione riguardo al motivo per cui l’esercente
        non può essere convenzionato in questo momento. La nota sarà visibile
        all’operatore.
      </p>
      <div className="mb-12">
        <textarea
          id="rejectMessage"
          value={rejectMessage}
          onChange={e => setRejectMessage(e.target.value)}
          rows={5}
          maxLength={250}
          placeholder="Inserisci una descrizione"
          className="form-control"
        />
      </div>
      <Button
        color="primary"
        outline
        tag="button"
        className="ms-4"
        onClick={() => {
          setRejectMode(false);
          setRejectMessage("");
        }}
      >
        Annulla
      </Button>
      <AsyncButton
        color="primary"
        className="ms-4"
        onClick={rejectAgreement}
        disabled={!rejectMessage.length}
        isPending={isPending}
      >
        Invia rifiuto
      </AsyncButton>
    </div>
  );
}

function ActionButtons({
  assignedToMe,
  original,
  checkAllDocs,
  approveIsPending,
  assignIsPending,
  approveAgreement,
  assignAgreements,
  setRejectMode
}: ActionButtonsProps) {
  return (
    <div className="mt-10">
      <Button
        color="primary"
        outline
        tag="button"
        className="ms-4"
        onClick={() => setRejectMode(true)}
        disabled={!assignedToMe}
      >
        <div className="d-flex align-items-center">Rifiuta</div>
      </Button>
      <AsyncButton
        color="primary"
        className="ms-4"
        onClick={approveAgreement}
        disabled={
          !assignedToMe ||
          original.state === "PendingAgreement" ||
          !checkAllDocs
        }
        isPending={approveIsPending}
      >
        Approva
      </AsyncButton>
      <AssignRequest
        isPending={assignIsPending}
        original={original}
        assignedToMe={assignedToMe}
        assignAgreements={assignAgreements}
      />
    </div>
  );
}

const RequestsDetails = ({ original, updateList }: Props) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");
  const [checkAllDocs, setCheckAllDocs] = useState(false);
  const { triggerTooltip } = useTooltip();

  const authentication = useAuthentication();
  const user = authentication.currentAdminSession;

  const entityType = original.entityType as EntityType;

  const assignedToMe =
    `${user?.first_name} ${user?.last_name}` ===
    (original.state === AgreementState.AssignedAgreement
      ? original.assignee.fullName
      : undefined);

  const approveAgreementMutation =
    remoteData.Backoffice.Agreement.approveAgreement.useMutation({
      onSuccess() {
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata validata con successo.",
          title: "Validazione Effettuata"
        });
      },
      onError() {
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
        updateList();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La richiesta di convenzione è stata rifiutata con successo.",
          title: "Rifiuto inviato"
        });
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

  const assignAgreementsMutation =
    remoteData.Backoffice.Agreement.assignAgreement.useMutation({
      onSuccess() {
        updateList();
      }
    });
  const assignAgreements = () => {
    assignAgreementsMutation.mutate({ agreementId: original.id });
  };

  const isPending =
    approveAgreementMutation.isPending ||
    rejectAgreementMutation.isPending ||
    assignAgreementsMutation.isPending;

  if (isPending) {
    return (
      <section className="px-6 py-4 bg-white">
        <h1 className="h5 fw-bold text-dark-blue mb-5">Dettagli</h1>
        <div className="container">
          <CenteredLoading />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-4 bg-white">
      <h1 className="h5 fw-bold text-dark-blue mb-5">Dettagli</h1>
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
          <Fragment>
            <RequestItem
              label="Numero opportunità proposte"
              value={original.discounts?.length}
            />
            <div className="ms-3">
              {original.discounts?.map((doc, i: number) => (
                <RequestItem
                  key={i}
                  label={`Opportunità #${i + 1}`}
                  value={doc.name}
                />
              ))}
            </div>
          </Fragment>
        )}
      </div>
      <h1 className="h5 fw-bold text-dark-blue mb-5">
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
        <RejectButtons
          rejectMessage={rejectMessage}
          setRejectMessage={setRejectMessage}
          setRejectMode={setRejectMode}
          rejectAgreement={rejectAgreement}
          isPending={isPending}
        />
      ) : (
        <ActionButtons
          assignedToMe={assignedToMe}
          original={original}
          checkAllDocs={checkAllDocs}
          approveIsPending={approveAgreementMutation.isPending}
          assignIsPending={assignAgreementsMutation.isPending}
          approveAgreement={approveAgreement}
          assignAgreements={assignAgreements}
          setRejectMode={setRejectMode}
        />
      )}
    </section>
  );
};

export default RequestsDetails;
