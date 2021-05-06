import React from "react";
import { ApprovedAgreementProfile } from "../../api/generated_backoffice";
import Item from "./Item";

const OperatorData = ({ profile }: { profile: ApprovedAgreementProfile }) => (
    <div>
      <h5 className="mb-7 font-weight-bold">Descrizione operatore</h5>
      <Item label="Nome Operatore visualizzato" value={profile.fullName} />
      <Item label="Descrizione dell'operatore" value={profile.description} />
      {/* TODO salse channel type */}
      <Item label="Sito web" value={profile.salesChannel.channelType} />
      <Item label="Indirizzo" value={profile.salesChannel.channelType} />
      <div className="row mb-5">
        <div className="col-4 text-gray">Immagine operatore</div>
        <div className="col-8">
          <img src={profile.imageUrl} alt="Immagine operatore" />
        </div>
      </div>
      <Item label="Data ultima modifica" value={profile.lastUpateDate} />
    </div>
  );

export default OperatorData;
