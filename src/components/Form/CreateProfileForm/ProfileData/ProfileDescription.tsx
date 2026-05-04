import { Lens } from "@hookform/lenses";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";
import FormSection from "../../FormSection";
import { ProfileFormValues } from "../../operatorDataUtils";

const ProfileDescription = ({
  formLens
}: {
  formLens: Lens<ProfileFormValues>;
}) => (
  <FormSection
    title="Descrizione dell'operatore"
    required
    isVisible
    description={
      <>
        Descrivi in modo chiaro e semplice i servizi offerti agli utenti di
        Carta Giovani (obbligatoria in italiano e in inglese - max 300
        caratteri).
        <br />
        Usa parole chiave pertinenti: questo testo viene indicizzato nella
        funzione “Ricerca” dell’app IO e influisce direttamente sulla visibilità
        della tua offerta e sull’esperienza degli utenti.
      </>
    }
  >
    <div className="row">
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
        <Field
          element="textarea"
          id="description"
          formLens={formLens.focus("description")}
          placeholder="Inserisci una descrizione"
          maxLength={300}
          rows={4}
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("description")} />
      </div>
      <div className="col-6">
        <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
        <Field
          element="textarea"
          id="description_en"
          formLens={formLens.focus("description_en")}
          placeholder="Type in the description"
          maxLength={300}
          rows={4}
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("description_en")} />
      </div>
    </div>
  </FormSection>
);

export default ProfileDescription;
