import { Lens } from "@hookform/lenses";
import { useWatch } from "react-hook-form";
import { EntityType } from "../../../../api/generated";
import InputField from "../../FormField";
import FormSection from "../../FormSection";
import ToggleField from "../../ToggleField";
import { ProfileFormValues } from "../../operatorDataUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

type Props = {
  entityType: EntityType | undefined;
  fullName: string;
  taxCodeOrVat: string;
  formLens: Lens<ProfileFormValues>;
};

const ProfileInfo = ({
  formLens,
  entityType,
  fullName,
  taxCodeOrVat
}: Props) => {
  const hasDifferentName = useWatch(
    formLens.focus("hasDifferentName").interop()
  );
  return (
    <FormSection hasIntroduction isVisible={false} title="Dati dell’operatore">
      <InputField
        htmlFor="fullName"
        title="Denominazione e ragione sociale Operatore"
        description="Inserisci il nome completo dell'Operatore. Sarà visibile in app e nella lista dei partner."
        required
      >
        <input
          id="fullName"
          name="fullName"
          value={fullName}
          type="text"
          disabled
          className="form-control"
        />
      </InputField>
      {entityType === EntityType.Private && (
        <div className="mt-6">
          <ToggleField
            htmlFor="hasDifferentName"
            text="Vuoi visualizzare un nome diverso dentro l’app?"
          >
            <Field
              id="hasDifferentName"
              formLens={formLens.focus("hasDifferentName")}
              type="checkbox"
              className="mb-0"
            />
          </ToggleField>
        </div>
      )}
      {hasDifferentName && (
        <InputField
          htmlFor="profileName"
          title="Nome operatore visualizzato"
          description={
            <>
              Può essere una semplificazione del nome dell&apos;Operatore più
              riconoscibile dall&apos;utente (es. PagoPA vs PagoPA SPA) <br />
              Il nome dell&apos;operatore deve rispettare l&apos;uso delle
              maiuscole previste del proprio brand name (es. PagoPA vs PAGOPA)
            </>
          }
          isVisible
          required
        >
          <div className="row">
            <div className="col-6">
              <p className="text-sm fw-normal text-black mb-0">Italiano 🇮🇹</p>
              <Field
                id="name"
                formLens={formLens.focus("name")}
                type="text"
                className="form-control"
              />
              <FormErrorMessage formLens={formLens.focus("name")} />
            </div>
            <div className="col-6">
              <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
              <Field
                id="name_en"
                formLens={formLens.focus("name_en")}
                type="text"
                className="form-control"
              />
              <FormErrorMessage formLens={formLens.focus("name_en")} />
            </div>
          </div>
        </InputField>
      )}
      <InputField htmlFor="taxCodeOrVat" title="Partita IVA" required>
        <input
          id="taxCodeOrVat"
          name="taxCodeOrVat"
          value={taxCodeOrVat}
          type="text"
          disabled
          className="form-control"
        />
      </InputField>
      <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
        <Field
          id="pecAddress"
          formLens={formLens.focus("pecAddress")}
          type="email"
          placeholder="Inserisci l'indirizzo PEC dell'ente"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("pecAddress")} />
      </InputField>
      <InputField htmlFor="legalOffice" title="Sede legale" required>
        <Field
          id="legalOffice"
          formLens={formLens.focus("legalOffice")}
          type="text"
          placeholder="Inserisci la sede legale dell'ente"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("legalOffice")} />
      </InputField>
      <InputField
        htmlFor="telephoneNumber"
        title="Numero di telefono ente"
        required
      >
        <Field
          maxLength={15}
          id="telephoneNumber"
          formLens={formLens.focus("telephoneNumber")}
          type="text"
          placeholder="Inserisci il numero di telefono dell'ente"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("telephoneNumber")} />
      </InputField>
      <InputField
        htmlFor="legalRepresentativeFullName"
        title="Nome e cognome del Legale rappresentante"
        required
      >
        <Field
          id="legalRepresentativeFullName"
          formLens={formLens.focus("legalRepresentativeFullName")}
          type="text"
          placeholder="Inserisci il nome e cognome del Legale rappresentante dell'ente"
          className="form-control"
        />
        <FormErrorMessage
          formLens={formLens.focus("legalRepresentativeFullName")}
        />
      </InputField>
      <InputField
        htmlFor="legalRepresentativeTaxCode"
        title="Codice fiscale del Legale rappresentante"
        required
      >
        <Field
          minLength={4}
          maxLength={20}
          id="legalRepresentativeTaxCode"
          formLens={formLens.focus("legalRepresentativeTaxCode")}
          type="text"
          placeholder="Inserisci il Codice fiscale del Legale rappresentante dell'ente"
          className="form-control"
        />
        <FormErrorMessage
          formLens={formLens.focus("legalRepresentativeTaxCode")}
        />
      </InputField>
    </FormSection>
  );
};

export default ProfileInfo;
