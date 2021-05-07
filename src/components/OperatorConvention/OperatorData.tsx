import React from "react";
import {
  ApprovedAgreementProfile,
  BothChannels
} from "../../api/generated_backoffice";
import Item from "./Item";

const OperatorData = ({ profile }: { profile: ApprovedAgreementProfile }) => {
  const salesChannel = profile.salesChannel as BothChannels;
  return (
    <div>
      <h5 className="mb-7 font-weight-bold">Descrizione operatore</h5>
      <Item label="Nome Operatore visualizzato" value={profile.fullName} />
      <Item label="Descrizione dell'operatore" value={profile.description} />
      <Item label="Sito web" value={salesChannel.websiteUrl || "-"} />
      {salesChannel.addresses?.map((address, i) => {
        const textAddress = `${address.city}, ${address.street} ${address.district}, ${address.zipCode}`;
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
            <img src={profile.imageUrl} alt="Immagine operatore" />
          ) : (
            <span>Nessuna immagine</span>
          )}
        </div>
      </div>
      <Item label="Data ultima modifica" value={profile.lastUpateDate} />
    </div>
  );
};

export default OperatorData;
