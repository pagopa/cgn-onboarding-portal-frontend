import { Field, useFormikContext } from "formik";
import { z } from "zod";
import { EntityType } from "../../../../api/generated";
import CustomErrorMessage from "../../CustomErrorMessage";
import InputField from "../../FormField";
import FormSection from "../../FormSection";
import ToggleField from "../../ToggleField";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";

type Props = {
  entityType: EntityType | undefined;
};

const ProfileInfo = ({ entityType }: Props) => {
  type Values = z.infer<typeof ProfileDataValidationSchema>;
  const formikContext = useFormikContext<Values>();
  return (
    <FormSection hasIntroduction isVisible={false} title="Dati dell’operatore">
      <InputField
        htmlFor="fullName"
        title="Denominazione e ragione sociale Operatore"
        description="Inserisci il nome completo dell'Operatore. Sarà visibile in app e nella lista dei partner."
        required
      >
        <Field
          id="fullName"
          name="fullName"
          type="text"
          disabled
          className="form-control"
        />
        <CustomErrorMessage name="fullName" />
      </InputField>
      {entityType === EntityType.Private && (
        <div className="mt-6">
          <ToggleField
            htmlFor="hasDifferentFullName"
            text="Vuoi visualizzare un nome diverso dentro l’app?"
          >
            <Field
              id="hasDifferentFullName"
              name="hasDifferentFullName"
              type="checkbox"
              className="mb-0"
            />
          </ToggleField>
        </div>
      )}
      {formikContext.values.hasDifferentName && (
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
                name="name"
                type="text"
                className="form-control"
              />
              <CustomErrorMessage name="name" />
            </div>
            <div className="col-6">
              <p className="text-sm fw-normal text-black mb-0">Inglese 🇬🇧</p>
              <Field
                id="name_en"
                name="name_en"
                type="text"
                className="form-control"
              />
              <CustomErrorMessage name="name_en" />
            </div>
          </div>
        </InputField>
      )}
      <InputField
        htmlFor="taxCodeOrVat"
        title="Partita IVA"
        required
        // NICE_TO_HAVE: aggiungere validazione della partita iva (può essere nazionale o estera, non può essere codice fiscale)
      >
        <Field
          id="taxCodeOrVat"
          name="taxCodeOrVat"
          type="text"
          disabled
          className="form-control"
        />
        <CustomErrorMessage name="taxCodeOrVat" />
      </InputField>
      <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
        <Field
          id="pecAddress"
          name="pecAddress"
          type="email"
          placeholder="Inserisci l'indirizzo PEC dell'ente"
          className="form-control"
        />
        <CustomErrorMessage name="pecAddress" />
      </InputField>
      <InputField htmlFor="legalOffice" title="Sede legale" required>
        <Field
          id="legalOffice"
          name="legalOffice"
          type="text"
          placeholder="Inserisci la sede legale dell'ente"
          className="form-control"
        />
        <CustomErrorMessage name="legalOffice" />
      </InputField>
      <InputField
        htmlFor="telephoneNumber"
        title="Numero di telefono ente"
        required
      >
        <Field
          maxLength={15}
          id="telephoneNumber"
          name="telephoneNumber"
          type="text"
          placeholder="Inserisci il numero di telefono dell'ente"
          className="form-control"
        />
        <CustomErrorMessage name="telephoneNumber" />
      </InputField>
      <InputField
        htmlFor="legalRepresentativeFullName"
        title="Nome e cognome del Legale rappresentante"
        required
      >
        <Field
          id="legalRepresentativeFullName"
          name="legalRepresentativeFullName"
          type="text"
          placeholder="Inserisci il nome e cognome del Legale rappresentante dell'ente"
          className="form-control"
        />
        <CustomErrorMessage name="legalRepresentativeFullName" />
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
          name="legalRepresentativeTaxCode"
          type="text"
          placeholder="Inserisci il Codice fiscale del Legale rappresentante dell'ente"
          className="form-control"
        />
        <CustomErrorMessage name="legalRepresentativeTaxCode" />
      </InputField>
    </FormSection>
  );
};

export default ProfileInfo;
