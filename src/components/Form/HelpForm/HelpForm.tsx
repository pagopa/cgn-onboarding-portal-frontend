import React from "react";
import { Field, Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
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
import NotLoggedHelpApi from "../../../api/public";
import { HelpRequest as NotLoggedHelpRequest } from "../../../api/generated_public";
import CustomErrorMessage from "../CustomErrorMessage";
import FormButtons from "./HelpFormButtons";

const initialValues = {
  category: "",
  topic: "",
  message: "",
  referentFirstName: "",
  referentLastName: "",
  legalName: "",
  emailAddress: "",
  confirmEmailAddress: ""
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
  }
];

const HelpForm = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const history = useHistory();
  const token = getCookie();

  const createLoggedHelp = async (agreementId: string, help: HelpRequest) =>
    await tryCatch(() => Api.Help.sendHelpRequest(agreementId, help), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();

  const createNotLoggedHelp = async (help: NotLoggedHelpRequest) =>
    await tryCatch(
      () => NotLoggedHelpApi.NotLoggedHelp.sendHelpRequest(help),
      toError
    )
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
        token ? loggedHelpValidationSchema : notLoggedHelpValidationSchema
      }
      onSubmit={(values: any) => {
        if (token) {
          void createLoggedHelp(agreement.id, values);
        } else {
          void createNotLoggedHelp(values);
        }
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
                  <Field className="select" name="topic" as="select">
                    <>
                      {topics
                        .find(topic => topic.key === values.category)
                        ?.items.map(item => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
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
            {token && <FormButtons isValid={isValid} dirty={dirty} />}
          </FormSection>
          {!token && (
            <FormSection
              title="I tuoi contatti"
              description="Inserisci i tuoi dati, ci serviranno per ricontattarti e offrirti la nostra assistenza"
              isVisible={false}
            >
              <div className="mt-10 row">
                <div className="col-5">
                  <InputFieldMultiple
                    htmlFor="referentFirstName"
                    title="Nome"
                    required
                  >
                    <Field
                      id="referentFirstName"
                      name="referentFirstName"
                      type="text"
                      placeholder="Inserisci il nome"
                    />
                    <CustomErrorMessage name="referentFirstName" />
                  </InputFieldMultiple>
                </div>
                <div className="col-5 offset-1">
                  <InputFieldMultiple
                    htmlFor="referentLastName"
                    title="Cognome"
                    required
                  >
                    <Field
                      id="referentLastName"
                      name="referentLastName"
                      type="text"
                      placeholder="Inserisci il cognome"
                    />
                    <CustomErrorMessage name="referentLastName" />
                  </InputFieldMultiple>
                </div>
              </div>
              <div className="mt-10 row">
                <InputFieldMultiple
                  htmlFor="legalName"
                  title="Denominazione e ragione sociale operatore"
                  required
                >
                  <Field
                    id="legalName"
                    name="legalName"
                    type="text"
                    placeholder="Inserisci la denominazione e ragione sociale Operatore"
                  />
                  <CustomErrorMessage name="legalName" />
                </InputFieldMultiple>
              </div>
              <div className="mt-10 row">
                <div className="col-5">
                  <InputFieldMultiple
                    htmlFor="emailAddress"
                    title="Indirizzo e-mail"
                    required
                  >
                    <Field
                      id="emailAddress"
                      name="emailAddress"
                      type="text"
                      placeholder="Inserisci un'indirizzo e-mail"
                    />
                    <CustomErrorMessage name="emailAddress" />
                  </InputFieldMultiple>
                </div>
                <div className="col-5 offset-1">
                  <InputFieldMultiple
                    htmlFor="confirmEmailAddress"
                    title="Conferma indirizzo e-mail"
                    required
                  >
                    <Field
                      id="confirmEmailAddress"
                      name="confirmEmailAddress"
                      type="text"
                      placeholder="Conferma l'indirizzo e-mail"
                    />
                    <CustomErrorMessage name="confirmEmailAddress" />
                  </InputFieldMultiple>
                </div>
              </div>
              <FormButtons isValid={isValid} dirty={dirty} />
              <p className="mt-4 text-gray">
                Form protetto tramite reCAPTCHA e Google{" "}
                <a href="#">Privacy Policy</a> e{" "}
                <a href="#">Termini di servizio</a> applicati.
              </p>
            </FormSection>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default HelpForm;
function createNotLoggedHelp(
  id: string,
  values: {
    category: string;
    topic: string;
    message: string;
    referentFirstName: string;
    referentLastName: string;
    legalName: string;
    emailAddress: string;
    confirmEmailAddress: string;
  }
) {
  throw new Error("Function not implemented.");
}
