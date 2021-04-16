import React from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "design-react-kit";
import { Link } from "react-router-dom";
import FormSection from "../FormSection";
import InputFieldMultiple from "../InputFieldMultiple";
import { DASHBOARD, ROOT } from "../../../navigation/routes";
import InputField from "../InputField";

const initialValues = {
  category: [""],
  subject: "",
  message: "",
  contactFirstName: "",
  contactLastName: "",
  emailAddress: "",
  confirmEmailAddress: ""
};

const validationSchema = Yup.object().shape({
  category: Yup.string()
    .oneOf([
      "Accesso",
      "Compilazione dati",
      "Agevolazioni",
      "Documenti",
      "Problema Tecnico",
      "Segnalazione Titolare di CGN",
      "Suggerimenti",
      "Altro"
    ])
    .required("Campo obbligatorio"),
  subject: Yup.string()
    .oneOf([
      "Aggiungere un’agevolazione",
      "Modificare un’agevolazione",
      "Eliminare un’agevolazione",
      "Stati dell’agevolazione"
    ])
    .required("Campo obbligatorio"),
  message: Yup.string()
    .min(1)
    .max(200)
    .required("Campo obbligatorio"),
  contactFirstName: Yup.string().required("Campo obbligatorio"),
  contactLastName: Yup.string().required("Campo obbligatorio"),
  emailAddress: Yup.string()
    .email("Email non valida")
    .required("Campo obbligatorio"),
  confirmEmailAddress: Yup.string()
    .required("Campo obbligatorio")
    .oneOf([Yup.ref("emailAddress"), null], "Le email devono coincidere")
});

const HelpForm = () => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false);
      }, 400);
    }}
  >
    {({ errors, touched, isValid }) => (
      <Form>
        <FormSection
          description="Come possiamo aiutarti? Compila il modulo e invialo online, sarai ricontattato al più presto"
          required
        >
          <InputField
            htmlFor="category"
            title="Categoria"
            description="Seleziona una delle opzioni possibili"
          >
            <div className="d-flex flex-column">
              <div className="form-check">
                <Field
                  id="Compilazione dati"
                  type="radio"
                  name="category"
                  value="Compilazione dati"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Compilazione dati"
                >
                  Compilazione dati
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="Agevolazioni"
                  type="radio"
                  name="category"
                  value="Agevolazioni"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Agevolazioni"
                >
                  Agevolazioni
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="Documenti"
                  type="radio"
                  name="category"
                  value="Documenti"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Documenti"
                >
                  Documenti
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="Problema tecnico"
                  type="radio"
                  name="category"
                  value="Problema tecnico"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Problema tecnico"
                >
                  Problema tecnico
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="Segnalazione titolare di CGN"
                  type="radio"
                  name="category"
                  value="Segnalazione titolare di CGN"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Segnalazione titolare di CGN"
                >
                  Segnalazione titolare di CGN
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="Suggerimenti"
                  type="radio"
                  name="category"
                  value="Suggerimenti"
                />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Suggerimenti"
                >
                  Suggerimenti
                </label>
              </div>
              <div className="form-check">
                <Field id="Altro" type="radio" name="category" value="Altro" />
                <label
                  className="text-sm font-weight-normal text-black"
                  htmlFor="Altro"
                >
                  Altro
                </label>
              </div>
            </div>
          </InputField>
          <InputField
            title="Argomento"
            htmlFor="argomento"
            description="Seleziona l’argomento per cui hai bisogno di aiuto
"
          >
            <div>
              <Field name="color" as="select">
                <option value="red">Aggiungere un&apos;agevolazione</option>
                <option value="green">Modificare un&apos;agevolazione</option>
                <option value="blue">Eliminare un&apos;agevolazione</option>
                <option value="blue">Stati dell&apos;agevolazione</option>
              </Field>
            </div>
          </InputField>
          <InputField
            title="Scrivi messaggio"
            htmlFor="messaggio"
            description="Max 200 caratteri"
          >
            <Field id="name" name="name" as="textarea" rows="4" />
          </InputField>
        </FormSection>
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
                {errors.contactFirstName && touched.contactFirstName ? (
                  <div>{errors.contactFirstName}</div>
                ) : null}
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
                {errors.contactLastName && touched.contactLastName ? (
                  <div>{errors.contactLastName}</div>
                ) : null}
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
                {errors.emailAddress && touched.emailAddress ? (
                  <div>{errors.emailAddress}</div>
                ) : null}
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
                {errors.confirmEmailAddress && touched.confirmEmailAddress ? (
                  <div>{errors.confirmEmailAddress}</div>
                ) : null}
              </InputFieldMultiple>
            </div>
          </div>
          <div className="mt-10">
            <Link
              to={DASHBOARD}
              className="px-14 mr-14 btn btn-outline-primary"
            >
              Annulla
            </Link>
            <Button
              className="px-14 mr-4"
              color="primary"
              tag="submit"
              disabled={!isValid}
            >
              Invia
            </Button>
          </div>
        </FormSection>
      </Form>
    )}
  </Formik>
);

export default HelpForm;
