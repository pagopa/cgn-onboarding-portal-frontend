import React from "react";
import {
  ApprovedAgreementProfile,
  EntityType
} from "../../api/generated_backoffice";
import Item from "./Item";

const Profile = ({ profile }: { profile: ApprovedAgreementProfile }) => (
  <div>
    <h5 className="mb-7 font-weight-bold">Dati dell'ente</h5>
    <Item label="Ragione sociale operatore" value={profile.fullName} />
    <Item
      label="Tipologia ente"
      value={(() => {
        switch (profile.entityType) {
          case EntityType.PublicAdministration:
            return "Pubblico";
          case EntityType.Private:
            return "Privato";
          default:
            return "";
        }
      })()}
    />
    <Item label="Partita IVA" value={profile.taxCodeOrVat} />
    <Item label="Indirizzo PEC" value={profile.pecAddress} />
    <Item label="Sede legale" value={profile.legalOffice} />
    <Item label="Numero di telefono ente" value={profile.telephoneNumber} />
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
