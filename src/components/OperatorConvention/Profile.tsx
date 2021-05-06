import React from "react";
import Item from "./Item";

const Profile = ({ details }: { details: any }) => {
  return (
    <div>
      <h5 className="mb-7 font-weight-bold">Dati relativi all’operatore</h5>
      <Item label="Ragione sociale operatore" value={details.fullName} />
      <Item label="Codice Fiscale / Partita IVA" value={details.taxCodeOrVat} />
      <Item label="Indirizzo PEC" value={details.pecAddress} />
      <Item label="Sede legale" value={details.legalOffice} />
      <Item label="Numero di telefono" value={details.telephoneNumber} />
      <Item
        label="Nome e cognome del legale rappresentante"
        value={details.legalRepresentativeFullName}
      />
      <Item
        label="Codice fiscale del Legale rappresentante"
        value={details.legalRepresentativeTaxCode}
      />
    </div>
  );
};

export default Profile;
