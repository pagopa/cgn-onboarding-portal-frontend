import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Button, Icon } from "design-react-kit";
import {
  ApprovedAgreementProfile,
  ApprovedAgreementState,
  ApprovedAgreementDetail,
  AgreementTerminationAction,
  BothChannels
} from "../../api/generated_backoffice";
import { remoteData } from "../../api/common";
import { Severity, useTooltip } from "../../context/tooltip";
import { BadgePill } from "../BadgePill";
import { agreementBadgePill } from "../../utils/badges";
import ConfirmModal from "../ConfirmModal";
import Item from "./Item";

type OperatorDataProps = {
  profile: ApprovedAgreementProfile;
  state: ApprovedAgreementState;
  partnerName: string;
  agreementId: string;
  reloadDetails: () => void;
  agreementStateSince?: ApprovedAgreementDetail["agreementStateSince"];
};

type TerminationModalConfig = {
  title: string;
  body: string;
  successText: string;
  successTitle: string;
};

const {
  StartTerminationInProgress,
  CompleteTermination,
  CancelTerminationInProgress
} = AgreementTerminationAction;

const OperatorData = ({
  profile,
  state,
  partnerName,
  agreementId,
  reloadDetails,
  agreementStateSince
}: OperatorDataProps) => {
  const [openModal, setOpenModal] = useState<AgreementTerminationAction | null>(
    null
  );
  const { triggerTooltip } = useTooltip();

  const {
    name,
    description,
    salesChannel: rawSalesChannel,
    imageUrl,
    lastUpateDate
  } = profile;
  const salesChannel = rawSalesChannel as BothChannels;

  const isInactive = state === ApprovedAgreementState.Inactive;
  const isTerminationInProgress =
    state === ApprovedAgreementState.TerminationInProgress;
  const isInactiveOrTermination = isInactive || isTerminationInProgress;
  const showSinceDate = isInactiveOrTermination && !!agreementStateSince;

  const terminationModalConfig = useMemo<
    Record<AgreementTerminationAction, TerminationModalConfig>
  >(
    () => ({
      [StartTerminationInProgress]: {
        title: `Vuoi segnalare ${partnerName} come in recesso?`,
        body: "Il partner potrà continuare ad accedere al portale operatori e tutte le sue opportunità attive rimarranno visibili su IO. Potrai annullare l'operazione in un secondo momento.",
        successText: "Hai segnalato il partner come in recesso",
        successTitle: "Fatto!"
      },
      [CompleteTermination]: {
        title: `Vuoi terminare la convenzione per ${partnerName}?`,
        body: "Il partner non potrà più accedere al portale operatori e tutte le opportunità saranno rimosse da IO. Potrai annullare l'operazione in un secondo momento.",
        successText: "Hai terminato la convenzione del partner.",
        successTitle: "Fatto!"
      },
      [CancelTerminationInProgress]: {
        title: `Vuoi annullare il recesso per ${partnerName}?`,
        body: "L'ente potrà continuare a usare il portale e tutte le sue opportunità attive torneranno visibili su IO.",
        successText: "L'ente può continuare ad usare il portale.",
        successTitle: "Recesso annullato"
      }
    }),
    [partnerName]
  );
  const modalConfig = openModal ? terminationModalConfig[openModal] : null;

  const terminationMutation =
    remoteData.Backoffice.Agreement.manageAgreementTermination.useMutation();

  const mutateTermination = (action: AgreementTerminationAction) => {
    const { successText, successTitle } = terminationModalConfig[action];
    terminationMutation.mutate(
      { agreementId, terminationCommand: { action } },
      {
        onSuccess() {
          setOpenModal(null);
          reloadDetails();
          triggerTooltip({
            severity: Severity.SUCCESS,
            text: successText,
            title: successTitle
          });
        },
        onError() {
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Si è verificato un errore.",
            title: "Errore"
          });
        }
      }
    );
  };

  const renderTerminationActions = () => {
    if (isInactive) {
      return (
        <div className="mt-12">
          <Button
            color="danger"
            outline
            onClick={() => setOpenModal(StartTerminationInProgress)}
          >
            Segnala in recesso
          </Button>
        </div>
      );
    }
    if (isTerminationInProgress) {
      return (
        <div className="mt-12 d-flex gap-6">
          <Button
            color="danger"
            outline
            onClick={() => setOpenModal(CompleteTermination)}
          >
            Termina convenzione
          </Button>
          <Button
            color="primary"
            outline
            onClick={() => setOpenModal(CancelTerminationInProgress)}
          >
            <Icon
              icon="it-restore"
              size="sm"
              color="primary"
              padding={false}
              className="me-2"
            />
            Annulla recesso
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h5 className="mb-7 fw-bold">Profilo</h5>
      {name && <Item label="Nome operatore visualizzato" value={name} />}
      <Item label="Descrizione dell'operatore" value={description} />
      <Item label="Sito web" value={salesChannel.websiteUrl || "-"} />
      {salesChannel.addresses?.map((address, i: number) => {
        const textAddress = `${address}`;
        return (
          <Item
            key={i}
            label={`Indirizzo ${i > 0 ? i + 1 : ""}`}
            value={textAddress}
          />
        );
      })}
      <div className="row mb-5">
        <div className="col-4 text-gray">Immagine operatore</div>
        <div className="col-8">
          {imageUrl ? (
            <img
              width="300"
              height="300"
              src={`${import.meta.env.CGN_IMAGE_BASE_URL}/${imageUrl}`}
              alt="Immagine operatore"
            />
          ) : (
            <span>Nessuna immagine</span>
          )}
        </div>
      </div>
      <Item
        label="Data ultima modifica"
        value={format(new Date(lastUpateDate), "dd/MM/yyyy")}
      />
      <Item
        label="Stato"
        value={
          <div className="d-flex align-items-center gap-2">
            <BadgePill {...agreementBadgePill[state]} />
            {showSinceDate && (
              <span>
                dal {format(new Date(agreementStateSince), "dd/MM/yyyy")}
              </span>
            )}
          </div>
        }
      />
      {renderTerminationActions()}
      <ConfirmModal
        isOpen={openModal !== null}
        onClose={() => setOpenModal(null)}
        title={modalConfig?.title ?? ""}
        body={modalConfig?.body ?? ""}
        onConfirm={() => mutateTermination(openModal!)}
        isPending={terminationMutation.isPending}
      />
    </div>
  );
};

export default OperatorData;
