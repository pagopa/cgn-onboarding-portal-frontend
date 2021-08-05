import React from "react";
import { ApprovedAgreementReferent } from "../../api/generated_backoffice";
import Item from "./Item";

const Referent = ({ referent }: { referent: ApprovedAgreementReferent }) => (
    <div>
      <h5 className="mb-7 font-weight-bold">Dati del referente incaricato</h5>
      <Item label="Nome" value={referent.firstName} />
      <Item label="Cognome" value={referent.lastName} />
      <Item label="Ruolo all’interno dell’azienda" value={referent.role} />
      <Item label="Indirizzo e-mail" value={referent.emailAddress} />
      <Item label="Numero di telefono diretto" value={referent.telephoneNumber} />
    </div>
  );

export default Referent;
