import { Fragment } from "react";
import { Lens } from "@hookform/lenses";
import { useFieldArray } from "@hookform/lenses/rhf";
import { useWatch } from "react-hook-form";
import FormSection from "../../FormSection";
import InputField from "../../FormField";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import type { Referent } from "../../../../api/generated";
import {
  emptyReferentFormValues,
  ProfileFormValues,
  ReferentFormValues
} from "../../operatorDataUtils";
import {
  Field,
  FormErrorMessage
} from "../../../../utils/react-hook-form-helpers";

const MAX_SECONDARY_REFERENTS = 4;

type ReferentData = {
  firstName: string;
  lastName: string;
  role: string;
  emailAddress: string;
  telephoneNumber: string;
};

type Props = {
  formLens: Lens<ReferentFormValues>;
  index?: number;
  showAdd: boolean;
  onAdd(): void;
  showRemove: boolean;
  onRemove(): void;
  children?: React.ReactNode;
};

const Referent = ({
  formLens,
  index,
  showAdd,
  onAdd,
  showRemove,
  onRemove,
  children
}: Props) => {
  const referentFieldId =
    index !== undefined ? `secondaryReferents[${index}]` : "referent";
  return (
    <FormSection
      title={
        index !== undefined ? `Referente ${index + 2}` : "Dati del referente"
      }
      description={
        index === undefined
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
          formLens={formLens.focus("firstName")}
          placeholder="Inserisci il nome del referente"
          type="text"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("firstName")} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.lastName`}
        title="Cognome"
        required
      >
        <Field
          id={`${referentFieldId}.lastName`}
          formLens={formLens.focus("lastName")}
          placeholder="Inserisci il cognome del referente"
          type="text"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("lastName")} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.role`}
        title="Ruolo all'interno dell'ente"
        required
      >
        <Field
          id={`${referentFieldId}.role`}
          formLens={formLens.focus("role")}
          type="text"
          className="form-control"
          placeholder="Inserisci il ruolo del referente"
        />
        <FormErrorMessage formLens={formLens.focus("role")} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.emailAddress`}
        title="Indirizzo e-mail"
        required
      >
        <Field
          id={`${referentFieldId}.emailAddress`}
          formLens={formLens.focus("emailAddress")}
          type="email"
          className="form-control"
          placeholder="Inserisci la e-mail del referente"
        />
        <FormErrorMessage formLens={formLens.focus("emailAddress")} />
      </InputField>
      <InputField
        htmlFor={`${referentFieldId}.telephoneNumber`}
        title="Numero di telefono diretto"
        required
      >
        <Field
          maxLength={15}
          id={`${referentFieldId}.telephoneNumber`}
          formLens={formLens.focus("telephoneNumber")}
          type="tel"
          placeholder="Inserisci il numero di telefono del referente"
          className="form-control"
        />
        <FormErrorMessage formLens={formLens.focus("telephoneNumber")} />
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

function ReferentData({
  formLens,
  children
}: {
  formLens: Lens<ProfileFormValues>;
  children?: React.ReactNode;
}) {
  const secondaryReferentsArray = useFieldArray(
    formLens.focus("secondaryReferents").interop()
  );
  const secondaryReferents = useWatch(
    formLens.focus("secondaryReferents").interop()
  );
  const add = () => secondaryReferentsArray.append(emptyReferentFormValues);
  const noSecondaryReferents = secondaryReferents.length === 0;
  return (
    <Fragment>
      <Referent
        formLens={formLens.focus("referent")}
        showAdd={noSecondaryReferents}
        onAdd={add}
        showRemove={false}
        onRemove={() => undefined}
      >
        {noSecondaryReferents ? children : undefined}
      </Referent>
      {formLens
        .focus("secondaryReferents")
        .map(secondaryReferentsArray.fields, (_, itemLens, index, array) => {
          const isLast = index === array.length - 1;
          return (
            <Referent
              key={index}
              index={index}
              formLens={itemLens}
              showAdd={isLast && array.length < MAX_SECONDARY_REFERENTS}
              onAdd={add}
              showRemove={true}
              onRemove={() => secondaryReferentsArray.remove(index)}
            >
              {isLast ? children : undefined}
            </Referent>
          );
        })}
    </Fragment>
  );
}

export default ReferentData;
