import React from "react";
import { format } from "date-fns";
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
      {profile.name && (
        <Item label="Nome Operatore visualizzato" value={profile.name} />
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
              src={`${process.env.BASE_IMAGE_PATH}/${profile.imageUrl}`}
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
    </div>
  );
};

export default OperatorData;
