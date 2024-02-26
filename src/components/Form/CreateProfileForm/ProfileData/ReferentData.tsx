import React from "react";
import { Field, FieldArray, useFormikContext } from "formik";
import { InferType } from "yup";
import FormSection from "../../FormSection";
import InputField from "../../FormField";
import CustomErrorMessage from "../../CustomErrorMessage";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import { EntityType, Referent } from "../../../../api/generated";

const MAX_SECONDARY_REFERENTS = 4;

type Props = {
  index: number | null;
  showAdd: boolean;
  onAdd(): void;
  showRemove: boolean;
  onRemove(): void;
  children?: React.ReactNode;
  entityType: EntityType;
};

/* eslint complexity: ["error", 20000] */
/* eslint sonarjs/cognitive-complexity: ["error", 20000] */

const Referent = ({
  index,
  showAdd,
  onAdd,
  showRemove,
  onRemove,
  children,
  entityType
}: Props) => {
  const referentFieldName =
    index !== null ? `secondaryReferents[${index}]` : "referent";
  const referentFieldId =
    index !== null ? `secondaryReferents[${index}]` : "referent";
  return (
    <FormSection
      title={
        index !== null
          ? `Referente ${index + 2}`
          : "Dati e contatti del referente incaricato"
      }
      description={
        "Indicare il nome della persona responsabile del programma CGN per conto dell'Operatore. La persona indicata sarà destinataria di tutte le comunicazioni relative alla gestione delle agevolazioni e, più in generale, all’attuazione della convenzione." +
        (index === 0
          ? `Puoi indicare fino a ${MAX_SECONDARY_REFERENTS} aggiuntivi`
          : "")
      }
      isVisible={false}
      hasRemove={showRemove}
      onRemove={onRemove}
    >
      <InputField
        htmlFor={`${referentFieldId}.firstName`}
        title="Nome"
        required
      >
        <Field
          id={`${referentFieldId}.firstName`}
          name={`${referentFieldName}.firstName`}
          type="text"
        />
        <CustomErrorMessage name={`${referentFieldName}.firstName`} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.lastName`}
        title="Cognome"
        required
      >
        <Field
          id={`${referentFieldId}.lastName`}
          name={`${referentFieldName}.lastName`}
          type="text"
        />
        <CustomErrorMessage name={`${referentFieldName}.lastName`} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.role`}
        title={(() => {
          switch (entityType) {
            case EntityType.Private:
              return "Ruolo all'interno dell'organizzazione";
            case EntityType.PublicAdministration:
              return "Ruolo all'interno dell'ente";
          }
        })()}
        required
      >
        <Field
          id={`${referentFieldId}.role`}
          name={`${referentFieldName}.role`}
          type="text"
        />
        <CustomErrorMessage name={`${referentFieldName}.role`} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.emailAddress`}
        title="Indirizzo e-mail"
        required
      >
        <Field
          id={`${referentFieldId}.emailAddress`}
          name={`${referentFieldName}.emailAddress`}
          type="email"
        />
        <CustomErrorMessage name={`${referentFieldName}.emailAddress`} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.telephoneNumber`}
        title="Numero di telefono diretto"
        required
      >
        <Field
          maxLength={15}
          id={`${referentFieldId}.telephoneNumber`}
          name={`${referentFieldName}.telephoneNumber`}
          type="tel"
          placeholder="Inserisci il numero di telefono"
        />
        <CustomErrorMessage name={`${referentFieldName}.telephoneNumber`} />
      </InputField>
      {showAdd && (
        <div className="mt-8 cursor-pointer" onClick={onAdd}>
          <PlusCircleIcon className="mr-2" />
          <span className="text-base font-weight-semibold text-blue">
            Aggiungi un referente
          </span>
        </div>
      )}
      {children}
    </FormSection>
  );
};

function ReferentData({
  children,
  entityType
}: {
  entityType: EntityType;
  children?: React.ReactNode;
}) {
  type Values = InferType<typeof ProfileDataValidationSchema>;
  const formikContext = useFormikContext<Values>();
  return (
    <FieldArray
      name="secondaryReferents"
      render={arrayHelpers => {
        const add = () => {
          const newReferent: Referent = {
            firstName: "",
            lastName: "",
            role: "",
            emailAddress: "",
            telephoneNumber: ""
          };
          arrayHelpers.push(newReferent);
        };
        const noSecondaryReferents =
          formikContext.values.secondaryReferents.length === 0;
        return (
          <React.Fragment>
            <Referent
              index={null}
              showAdd={noSecondaryReferents}
              onAdd={add}
              showRemove={false}
              onRemove={() => undefined}
              entityType={entityType}
            >
              {noSecondaryReferents ? children : undefined}
            </Referent>
            {formikContext.values.secondaryReferents.map(
              (referent, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <Referent
                    key={index}
                    index={index}
                    showAdd={isLast && array.length < MAX_SECONDARY_REFERENTS}
                    onAdd={add}
                    showRemove={true}
                    onRemove={() => arrayHelpers.remove(index)}
                    entityType={entityType}
                  >
                    {isLast ? children : undefined}
                  </Referent>
                );
              }
            )}
          </React.Fragment>
        );
      }}
    />
  );
}

export default ReferentData;
