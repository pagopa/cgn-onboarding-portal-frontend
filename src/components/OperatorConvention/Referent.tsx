import { ApprovedAgreementReferent } from "../../api/generated_backoffice";
import Item from "./Item";

const Referent = ({ referent }: { referent: ApprovedAgreementReferent }) => (
  <div>
    <h5 className="mb-7 fw-bold">Dati del referente incaricato</h5>
    <Item label="Nome" value={referent.firstName} />
    <Item label="Cognome" value={referent.lastName} />
    <Item label="Ruolo all’interno dell’ente" value={referent.role} />
    <Item label="Indirizzo e-mail" value={referent.emailAddress} />
    <Item label="Numero di telefono diretto" value={referent.telephoneNumber} />
  </div>
);

export default Referent;
