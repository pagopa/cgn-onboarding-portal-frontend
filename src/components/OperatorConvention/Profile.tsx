import React from "react";
import { ApprovedAgreementProfile } from "../../api/generated_backoffice";
import Item from "./Item";

const Profile = ({ profile }: { profile: ApprovedAgreementProfile }) => (
    <div>
      <h5 className="mb-7 font-weight-bold">Dati relativi all’operatore</h5>
      <Item label="Ragione sociale operatore" value={profile.fullName} />
      <Item label="Codice Fiscale / Partita IVA" value={profile.taxCodeOrVat} />
      <Item label="Indirizzo PEC" value={profile.pecAddress} />
      <Item label="Sede legale" value={profile.legalOffice} />
      <Item label="Numero di telefono" value={profile.telephoneNumber} />
      <Item
        label="Nome e cognome del legale rappresentante"
        value={profile.legalRepresentativeFullName}
      />
      <Item
        label="Codice fiscale del Legale rappresentante"
        value={profile.legalRepresentativeTaxCode}
      />
    </div>
  );

export default Profile;
