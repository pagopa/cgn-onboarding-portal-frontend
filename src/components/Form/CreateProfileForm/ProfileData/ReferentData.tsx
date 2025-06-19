import { Field, FieldArray, useFormikContext } from "formik";
import { Fragment } from "react";
import { z } from "zod";
import FormSection from "../../FormSection";
import InputField from "../../FormField";
import CustomErrorMessage from "../../CustomErrorMessage";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import type { Referent } from "../../../../api/generated";

const MAX_SECONDARY_REFERENTS = 4;

const ProfileDataValidationSchema = z.object({
  referent: z.object({
    firstName: z.string().min(1, "Il nome è obbligatorio"),
    lastName: z.string().min(1, "Il cognome è obbligatorio"),
    role: z.string().min(1, "Il ruolo è obbligatorio"),
    emailAddress: z.string().email("Email non valida"),
    telephoneNumber: z.string().min(1, "Il numero di telefono è obbligatorio")
  }),
  secondaryReferents: z
    .array(
      z.object({
        firstName: z.string().min(1, "Il nome è obbligatorio"),
        lastName: z.string().min(1, "Il cognome è obbligatorio"),
        role: z.string().min(1, "Il ruolo è obbligatorio"),
        emailAddress: z.string().email("Email non valida"),
        telephoneNumber: z
          .string()
          .min(1, "Il numero di telefono è obbligatorio")
      })
    )
    .max(MAX_SECONDARY_REFERENTS)
});

type ProfileData = z.infer<typeof ProfileDataValidationSchema>;

type Props = {
  index: number | null;
  showAdd: boolean;
  onAdd(): void;
  showRemove: boolean;
  onRemove(): void;
  children?: React.ReactNode;
};

const Referent = ({
  index,
  showAdd,
  onAdd,
  showRemove,
  onRemove,
  children
}: Props) => {
  const referentFieldName =
    index !== null ? `secondaryReferents[${index}]` : "referent";
  const referentFieldId =
    index !== null ? `secondaryReferents[${index}]` : "referent";
  return (
    <FormSection
      title={index !== null ? `Referente ${index + 2}` : "Dati del referente"}
      description={
        index === null
          ? `Indica il nome della persona che sarà referente primario di Carta Giovani Nazionale per il tuo operatore. Riceverà tutte le comunicazioni che riguardano il programma e la gestione delle opportunità.`
          : `Indica il nome di un’altra persona che sarà referente di Carta Giovani Nazionale per il tuo operatore. Riceverà tutte le comunicazioni che riguardano il programma e la gestione delle opportunità. Puoi indicarne fino a ${MAX_SECONDARY_REFERENTS} aggiuntivi.`
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
          placeholder="Inserisci il nome del referente"
          type="text"
          className="form-control"
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
          placeholder="Inserisci il cognome del referente"
          type="text"
          className="form-control"
        />
        <CustomErrorMessage name={`${referentFieldName}.lastName`} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.role`}
        title="Ruolo all'interno dell'ente"
        required
      >
        <Field
          id={`${referentFieldId}.role`}
          name={`${referentFieldName}.role`}
          type="text"
          className="form-control"
          placeholder="Inserisci il ruolo del referente"
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
          className="form-control"
          placeholder="Inserisci la e-mail del referente"
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
          placeholder="Inserisci il numero di telefono del referente"
          className="form-control"
        />
        <CustomErrorMessage name={`${referentFieldName}.telephoneNumber`} />
      </InputField>
      {showAdd && (
        <div className="mt-8 cursor-pointer" onClick={onAdd}>
          <PlusCircleIcon className="me-2" />
          <span className="text-base fw-semibold text-blue">
            Aggiungi un referente
          </span>
        </div>
      )}
      {children}
    </FormSection>
  );
};

function ReferentData({ children }: { children?: React.ReactNode }) {
  const formikContext = useFormikContext<ProfileData>();
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
          <Fragment>
            <Referent
              index={null}
              showAdd={noSecondaryReferents}
              onAdd={add}
              showRemove={false}
              onRemove={() => undefined}
            >
              {noSecondaryReferents ? children : undefined}
            </Referent>
            {formikContext.values.secondaryReferents.map((_, index, array) => {
              const isLast = index === array.length - 1;
              return (
                <Referent
                  key={index}
                  index={index}
                  showAdd={isLast && array.length < MAX_SECONDARY_REFERENTS}
                  onAdd={add}
                  showRemove={true}
                  onRemove={() => arrayHelpers.remove(index)}
                >
                  {isLast ? children : undefined}
                </Referent>
              );
            })}
          </Fragment>
        );
      }}
    />
  );
}

export default ReferentData;
