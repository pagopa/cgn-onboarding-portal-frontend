import { format } from "date-fns";
import { Button } from "design-react-kit";
import {
  ApprovedAgreementProfile,
  ApprovedAgreementState,
  BothChannels
} from "../../api/generated_backoffice";
import { BadgePill } from "../BadgePill";
import { agreementBadgePill } from "../../utils/badges";
import Item from "./Item";

type OperatorDataProps = {
  profile: ApprovedAgreementProfile;
  state: ApprovedAgreementState;
};

const OperatorData = ({ profile, state }: OperatorDataProps) => {
  const salesChannel = profile.salesChannel as BothChannels;
  const showStateDate =
    state === ApprovedAgreementState.Inactive ||
    state === ApprovedAgreementState.TerminationInProgress;
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
          <Button color="danger" outline onClick={() => undefined}>
            Segnala in recesso
          </Button>
        </div>
      )}
    </div>
  );
};

export default OperatorData;
