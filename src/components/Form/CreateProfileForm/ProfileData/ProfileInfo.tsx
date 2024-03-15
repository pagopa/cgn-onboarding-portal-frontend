import { Field, useFormikContext } from "formik";
import React from "react";
import { InferType } from "yup";
import { EntityType } from "../../../../api/generated";
import CustomErrorMessage from "../../CustomErrorMessage";
import InputField from "../../FormField";
import FormSection from "../../FormSection";
import ToggleField from "../../ToggleField";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";

type Props = {
  entityType: EntityType;
};

const ProfileInfo = ({ entityType }: Props) => {
  type Values = InferType<typeof ProfileDataValidationSchema>;
  const formikContext = useFormikContext<Values>();
  return (
    <FormSection hasIntroduction isVisible={false}>
      <InputField
        htmlFor="fullName"
        title="Denominazione e ragione sociale Operatore"
        description="Inserire il nome completo dell'Operatore"
        required
      >
        <Field id="fullName" name="fullName" type="text" disabled />
        <CustomErrorMessage name="fullName" />
      </InputField>
      {entityType === EntityType.Private && (
        <ToggleField
          small={true}
          htmlFor="hasDifferentFullName"
          text="Vuoi visualizzare un nome diverso dentro l’app?"
        >
          <Field
            id="hasDifferentFullName"
            name="hasDifferentFullName"
            type="checkbox"
          />
        </ToggleField>
      )}
      {formikContext.values.hasDifferentFullName && (
        <InputField
          htmlFor="profileName"
          title="Nome Operatore visualizzato"
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
              <p className="text-sm font-weight-normal text-black mb-0">
                Italiano 🇮🇹
              </p>
              <Field id="name" name="name" type="text" />
              <CustomErrorMessage name="name" />
            </div>
            <div className="col-6">
              <p className="text-sm font-weight-normal text-black mb-0">
                Inglese 🇬🇧
              </p>
              <Field id="name_en" name="name_en" type="text" />
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
        <Field id="taxCodeOrVat" name="taxCodeOrVat" type="text" disabled />
        <CustomErrorMessage name="taxCodeOrVat" />
      </InputField>
      <InputField htmlFor="pecAddress" title="Indirizzo PEC" required>
        <Field
          id="pecAddress"
          name="pecAddress"
          type="email"
          placeholder={(() => {
            switch (entityType) {
              case EntityType.PublicAdministration:
                return "Inserisci l'indirizzo pec dell'ente";
              case EntityType.Private:
                return "Inserisci l'indirizzo pec dell'organizzazione";
            }
          })()}
        />
        <CustomErrorMessage name="pecAddress" />
      </InputField>
      <InputField htmlFor="legalOffice" title="Sede legale" required>
        <Field
          id="legalOffice"
          name="legalOffice"
          type="text"
          placeholder={(() => {
            switch (entityType) {
              case EntityType.PublicAdministration:
                return "Inserisci la sede legale ente";
              case EntityType.Private:
                return "Inserisci la sede legale dell’organizzazione";
            }
          })()}
        />
        <CustomErrorMessage name="legalOffice" />
      </InputField>
      <InputField
        htmlFor="telephoneNumber"
        title="Numero di telefono Operatore"
        required
      >
        <Field
          maxLength={15}
          id="telephoneNumber"
          name="telephoneNumber"
          type="text"
          placeholder={(() => {
            switch (entityType) {
              case EntityType.PublicAdministration:
                return "Inserisci il numero di telefono ente";
              case EntityType.Private:
                return "Inserisci il numero di telefono dell’organizzazione";
            }
          })()}
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
          placeholder={(() => {
            switch (entityType) {
              case EntityType.PublicAdministration:
                return "Inserisci il nome e cognome del Legale rappresentante ente";
              case EntityType.Private:
                return "Inserisci il nome e cognome del Legale rappresentante dell’organizzazione";
            }
          })()}
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
          placeholder={(() => {
            switch (entityType) {
              case EntityType.PublicAdministration:
                return "Inserisci il Codice fiscale del Legale rappresentante ente";
              case EntityType.Private:
                return "Inserisci il Codice fiscale del Legale rappresentante dell’organizzazione";
            }
          })()}
        />
        <CustomErrorMessage name="legalRepresentativeTaxCode" />
      </InputField>
    </FormSection>
  );
};

export default ProfileInfo;
