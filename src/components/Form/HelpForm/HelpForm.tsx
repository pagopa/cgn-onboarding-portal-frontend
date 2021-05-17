import React from "react";
import { Field, Form, Formik } from "formik";
import { Button } from "design-react-kit";
import { Link, useHistory } from "react-router-dom";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { useSelector } from "react-redux";
import FormSection from "../FormSection";
import { DASHBOARD } from "../../../navigation/routes";
import InputField from "../FormField";
import {
  loggedHelpValidationSchema,
  notLoggedHelpValidationSchema
} from "../ValidationSchemas";
import { RootState } from "../../../store/store";
import { HelpRequest } from "../../../api/generated";
import Api from "../../../api";
import { HelpRequestCategoryEnum } from "../../../api/generated";
import { getCookie } from "../../../utils/cookie";
import InputFieldMultiple from "../InputFieldMultiple";

const initialValues = {
  category: "",
  topic: "",
  message: ""
};

const topics = [
  {
    key: "DataFilling",
    items: [
      "Dati relativi all'operatore",
      "Dati del referente",
      "Descrizione operatore"
    ]
  },
  {
    key: "Discounts",
    items: [
      "Aggiungere un’agevolazione",
    "Modificare un’agevolazione",
    "Eliminare un’agevolazione",
    "Stati dell’agevolazione",
    "Codice statico"
    ]
  },
  {
    key: "Documents",
    items: [
      "Compilare e firmare i documenti",
    "Caricare un documento",
    "Rinnovare un documento"
    ]
  },
];

const HelpForm = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const history = useHistory();
  const token = getCookie();

  const createHelp = async (agreementId: string, help: HelpRequest) =>
    await tryCatch(() => Api.Help.sendHelpRequest(agreementId, help), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();

  const hasTopicDropdown = (category: string): boolean => {
    const newCategory = category as HelpRequestCategoryEnum;
    return (
      category === HelpRequestCategoryEnum.DataFilling ||
      category === HelpRequestCategoryEnum.Discounts ||
      category === HelpRequestCategoryEnum.Documents
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        agreement ? loggedHelpValidationSchema : notLoggedHelpValidationSchema
      }
      onSubmit={values => {
        void createHelp(agreement.id, values);
      }}
    >
      {({ values, isValid, dirty }) => (
        <Form autoComplete="off">
          <FormSection
            description="Come possiamo aiutarti? Compila il modulo e invialo online, sarai ricontattato al più presto"
            required
          >
            <InputField
              htmlFor="category"
              title="Categoria"
              description="Seleziona una delle opzioni possibili"
              required
            >
              <div className="d-flex flex-column">
                <div className="form-check">
                  <Field
                    id="DataFilling"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.DataFilling}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="DataFilling"
                  >
                    Compilazione dati
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="Discounts"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.Discounts}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="Discounts"
                  >
                    Agevolazioni
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="Documents"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.Documents}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="Documents"
                  >
                    Documenti
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="TechnicalProblem"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.TechnicalProblem}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="TechnicalProblem"
                  >
                    Problema tecnico
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="CgnOwnerReporting"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.CgnOwnerReporting}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="CgnOwnerReporting"
                  >
                    Segnalazione titolare di CGN
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="Suggestions"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.Suggestions}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="Suggestions"
                  >
                    Suggerimenti
                  </label>
                </div>
                <div className="form-check">
                  <Field
                    id="Other"
                    type="radio"
                    name="category"
                    value={HelpRequestCategoryEnum.Other}
                  />
                  <label
                    className="text-sm font-weight-normal text-black"
                    htmlFor="Other"
                  >
                    Altro
                  </label>
                </div>
              </div>
            </InputField>
            {hasTopicDropdown(values.category) && (
              <InputField
                title="Argomento"
                htmlFor="argomento"
                description="Seleziona l’argomento per cui hai bisogno di aiuto"
              >
                <div>
                  <Field name="topic" as="select">
                    <>
                      {topics.find(topic => topic.key === values.category)?.items.map(item => <option key={item} value={item}>{item}</option>)}
                    </>
                  </Field>
                </div>
              </InputField>
            )}
            <InputField
              title="Scrivi messaggio"
              htmlFor="message"
              description="Max 200 caratteri"
              required
            >
              <Field
                id="message"
                name="message"
                as="textarea"
                maxLength={200}
                rows="4"
              />
            </InputField>
            {!token && (
              <FormSection
              title="I tuoi contatti"
              description="Inserisci i tuoi dati, ci serviranno per ricontattarti e offrirti la nostra assistenza"
              isVisible={false}
            >
              <div className="mt-10 row">
                <div className="col-5">
                  <InputFieldMultiple htmlFor="contactFirstName" title="Nome">
                    <Field
                      id="contactFirstName"
                      name="contactFirstName"
                      type="text"
                      placeholder="Inserisci il nome"
                    />
                  </InputFieldMultiple>
                </div>
                <div className="col-5 offset-1">
                  <InputFieldMultiple htmlFor="contactLastName" title="Cognome">
                    <Field
                      id="contactLastName"
                      name="contactLastName"
                      type="text"
                      placeholder="Inserisci il CAP"
                    />
                  </InputFieldMultiple>
                </div>
              </div>
              <div className="mt-10 row">
                <div className="col-5">
                  <InputFieldMultiple
                    htmlFor="emailAddress"
                    title="Indirizzo e-mail"
                  >
                    <Field
                      id="emailAddress"
                      name="emailAddress"
                      type="text"
                      placeholder="Inserisci un'indirizzo e-mail"
                    />
                  </InputFieldMultiple>
                </div>
                <div className="col-5 offset-1">
                  <InputFieldMultiple
                    htmlFor="confirmEmailAddress"
                    title="Conferma indirizzo e-mail"
                  >
                    <Field
                      id="confirmEmailAddress"
                      name="confirmEmailAddress"
                      type="text"
                      placeholder="Conferma l'indirizzo e-mail"
                    />
                  </InputFieldMultiple>
                </div>
              </div>
            </FormSection>
            )}
            <div className="mt-10">
              <Link
                to={DASHBOARD}
                className="px-14 mr-14 btn btn-outline-primary"
              >
                Annulla
              </Link>
              <Button
                type="submit"
                className="px-14 mr-4"
                color="primary"
                disabled={!(isValid && dirty)}
              >
                Invia
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};
export default HelpForm;
