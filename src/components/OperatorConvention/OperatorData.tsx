import { useState } from "react";
import { format } from "date-fns";
import { Button } from "design-react-kit";
import {
  ApprovedAgreementProfile,
  ApprovedAgreementState,
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
};

const OperatorData = ({
  profile,
  state,
  partnerName,
  agreementId,
  reloadDetails
}: OperatorDataProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { triggerTooltip } = useTooltip();

  const terminationMutation =
    remoteData.Backoffice.Agreement.manageAgreementTermination.useMutation({
      onSuccess() {
        setModalOpen(false);
        reloadDetails();
        triggerTooltip({
          severity: Severity.SUCCESS,
          text: "La segnalazione di recesso è stata effettuata con successo.",
          title: "Recesso segnalato"
        });
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Si è verificato un errore durante la segnalazione di recesso.",
          title: "Errore"
        });
      }
    });

  const startTermination = () => {
    terminationMutation.mutate({
      agreementId,
      terminationCommand: {
        action: AgreementTerminationAction.StartTerminationInProgress
      }
    });
  };
  const salesChannel = profile.salesChannel as BothChannels;
  const showStateDate = state === ApprovedAgreementState.Inactive;
  return (
    <div>
      <h5 className="mb-7 fw-bold">Profilo</h5>
      {profile.name && (
        <Item label="Nome operatore visualizzato" value={profile.name} />
      )}
      <Item label="Descrizione dell'operatore" value={profile.description} />
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
          {profile.imageUrl ? (
            <img
              width="300"
              height="300"
              src={`${import.meta.env.CGN_IMAGE_BASE_URL}/${profile.imageUrl}`}
              alt="Immagine operatore"
            />
          ) : (
            <span>Nessuna immagine</span>
          )}
        </div>
      </div>
      <Item
        label="Data ultima modifica"
        value={format(new Date(profile.lastUpateDate), "dd/MM/yyyy")}
      />
      <Item
        label="Stato"
        value={
          <div className="d-flex align-items-center gap-2">
            <BadgePill {...agreementBadgePill[state]} />
            {showStateDate && <span>dal {"{gg-mm-aaaa}"}</span>}
          </div>
        }
      />
      {state === ApprovedAgreementState.Inactive && (
        <div className="mt-12">
          <Button color="danger" outline onClick={() => setModalOpen(true)}>
            Segnala in recesso
          </Button>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title={`Vuoi segnalare ${partnerName} come in recesso?`}
        body="Il partner potrà continuare ad accedere al portale operatori e tutte le sue opportunità attive rimarranno visibili su IO. Potrai annullare l'operazione in un secondo momento."
        onConfirm={startTermination}
        isPending={terminationMutation.isPending}
      />
    </div>
  );
};

export default OperatorData;
