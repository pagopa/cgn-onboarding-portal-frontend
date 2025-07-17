import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import z from "zod/v4";
import FormSection from "../FormSection";
import InputField from "../FormField";
import {
  loggedHelpValidationSchema,
  notLoggedHelpValidationSchema
} from "../ValidationSchemas";
import { RootState } from "../../../store/store";
import { HelpRequestCategoryEnum } from "../../../api/generated";
import { remoteData } from "../../../api/common";
import InputFieldMultiple from "../InputFieldMultiple";
import { Severity, useTooltip } from "../../../context/tooltip";
import { useAuthentication } from "../../../authentication/AuthenticationContext";
import {
  Field,
  FormErrorMessage,
  useStandardForm
} from "../../../utils/react-hook-form-helpers";
import FormButtons from "./HelpFormButtons";
import ReCAPTCHAFormComponent from "./ReCAPTCHAFormComponent";

const loggedInitialValues: z.input<typeof loggedHelpValidationSchema> = {
  category: "",
  topic: "",
  message: ""
};

const notLoggedInitialValues: z.input<typeof notLoggedHelpValidationSchema> = {
  category: "",
  topic: "",
  message: "",
  referentFirstName: "",
  referentLastName: "",
  legalName: "",
  emailAddress: "",
  confirmEmailAddress: "",
  recaptchaToken: ""
};

const topics = () => [
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
      "Aggiungere un'opportunità",
      "Modificare un'opportunità",
      "Eliminare un'opportunità",
      "Stati dell'opportunità",
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
  const authentication = useAuthentication();
  const isLogged = authentication.currentSession.type !== "none";
  const { triggerTooltip } = useTooltip();

  const onErrorTooltip = () =>
    triggerTooltip({
      severity: Severity.DANGER,
      text: "C'è stato un errore durante la sottomissione del form"
    });

  const createLoggedHelpMutation =
    remoteData.Index.Help.sendHelpRequest.useMutation({
      onSuccess() {
        history.goBack();
      },
      onError: onErrorTooltip
    });

  const createNotLoggedHelpMutation =
    remoteData.Public.Help.sendHelpRequest.useMutation({
      onSuccess() {
        history.goBack();
      },
      onError: onErrorTooltip
    });

  const hasTopicDropdown = (category: string): boolean =>
    category === HelpRequestCategoryEnum.DataFilling ||
    category === HelpRequestCategoryEnum.Discounts ||
    category === HelpRequestCategoryEnum.Documents;

  const loggedForm = useStandardForm({
    defaultValues: loggedInitialValues,
    zodSchemaFactory: () => loggedHelpValidationSchema
  });

  const notLoggedForm = useStandardForm({
    defaultValues: notLoggedInitialValues,
    zodSchemaFactory: () => notLoggedHelpValidationSchema
  });

  const form = isLogged ? loggedForm : notLoggedForm;

  return (
    <form
      autoComplete="off"
      onSubmit={
        isLogged
          ? loggedForm.handleSubmit(async values => {
              await createLoggedHelpMutation.mutateAsync({
                agreementId: agreement.id,
                helpRequest: values
              });
            })
          : notLoggedForm.handleSubmit(async values => {
              await createNotLoggedHelpMutation.mutateAsync({
                helpRequest: values
              });
            })
      }
    >
      {!isLogged && (
        <ReCAPTCHAFormComponent
          formLens={notLoggedForm.lens.focus("recaptchaToken")}
        />
      )}
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
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.DataFilling}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="DataFilling"
              >
                Compilazione dati
              </label>
            </div>
            <div className="form-check">
              <Field
                id="Discounts"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.Discounts}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="Discounts"
              >
                Opportunità
              </label>
            </div>
            <div className="form-check">
              <Field
                id="Documents"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.Documents}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="Documents"
              >
                Documenti
              </label>
            </div>
            <div className="form-check">
              <Field
                id="TechnicalProblem"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.TechnicalProblem}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="TechnicalProblem"
              >
                Problema tecnico
              </label>
            </div>
            <div className="form-check">
              <Field
                id="CgnOwnerReporting"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.CgnOwnerReporting}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="CgnOwnerReporting"
              >
                Segnalazione titolare di CGN
              </label>
            </div>
            <div className="form-check">
              <Field
                id="Suggestions"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.Suggestions}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="Suggestions"
              >
                Suggerimenti
              </label>
            </div>
            <div className="form-check">
              <Field
                id="Other"
                type="radio"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("category")
                    : notLoggedForm.lens.focus("category")
                }
                value={HelpRequestCategoryEnum.Other}
              />
              <label
                className="text-sm fw-normal text-black form-label"
                htmlFor="Other"
              >
                Altro
              </label>
            </div>
            <FormErrorMessage
              formLens={
                isLogged
                  ? loggedForm.lens.focus("category")
                  : notLoggedForm.lens.focus("category")
              }
            />
          </div>
        </InputField>
        {hasTopicDropdown(form.getValues().category) && (
          <InputField
            title="Argomento"
            htmlFor="argomento"
            description="Seleziona l’argomento per cui hai bisogno di aiuto"
          >
            <div className="select-wrapper">
              <Field
                element="select"
                formLens={
                  isLogged
                    ? loggedForm.lens.focus("topic")
                    : notLoggedForm.lens.focus("topic")
                }
              >
                {topics()
                  .find(topic => topic.key === form.getValues().category)
                  ?.items.map(item => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
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
            element="textarea"
            id="message"
            formLens={
              isLogged
                ? loggedForm.lens.focus("message")
                : notLoggedForm.lens.focus("message")
            }
            maxLength={200}
            rows={4}
            className="form-control"
          />
          <FormErrorMessage
            formLens={
              isLogged
                ? loggedForm.lens.focus("message")
                : notLoggedForm.lens.focus("message")
            }
          />
        </InputField>
        {isLogged && <FormButtons />}
      </FormSection>
      {!isLogged && (
        <FormSection
          title="I tuoi contatti"
          description="Inserisci i tuoi dati, ci serviranno per ricontattarti e offrirti la nostra assistenza"
          isVisible={false}
        >
          <div className="mt-6 row">
            <div className="col-5">
              <InputFieldMultiple
                htmlFor="referentFirstName"
                title="Nome"
                required
              >
                <Field
                  id="referentFirstName"
                  formLens={notLoggedForm.lens.focus("referentFirstName")}
                  type="text"
                  placeholder="Inserisci il nome"
                  className="form-control"
                />
                <FormErrorMessage
                  formLens={notLoggedForm.lens.focus("referentFirstName")}
                />
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
                  formLens={notLoggedForm.lens.focus("referentLastName")}
                  type="text"
                  placeholder="Inserisci il cognome"
                  className="form-control"
                />
                <FormErrorMessage
                  formLens={notLoggedForm.lens.focus("referentLastName")}
                />
              </InputFieldMultiple>
            </div>
          </div>
          <div className="mt-6 row">
            <InputFieldMultiple
              htmlFor="legalName"
              title="Denominazione e ragione sociale operatore"
              required
            >
              <Field
                id="legalName"
                formLens={notLoggedForm.lens.focus("legalName")}
                type="text"
                placeholder="Inserisci la denominazione e ragione sociale Operatore"
                className="form-control"
              />
              <FormErrorMessage
                formLens={notLoggedForm.lens.focus("legalName")}
              />
            </InputFieldMultiple>
          </div>
          <div className="mt-6 row">
            <div className="col-5">
              <InputFieldMultiple
                htmlFor="emailAddress"
                title="Indirizzo e-mail"
                required
              >
                <Field
                  id="emailAddress"
                  formLens={notLoggedForm.lens.focus("emailAddress")}
                  type="text"
                  placeholder="Inserisci un'indirizzo e-mail"
                  className="form-control"
                />
                <FormErrorMessage
                  formLens={notLoggedForm.lens.focus("emailAddress")}
                />
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
                  formLens={notLoggedForm.lens.focus("confirmEmailAddress")}
                  type="text"
                  placeholder="Conferma l'indirizzo e-mail"
                  className="form-control"
                />
                <FormErrorMessage
                  formLens={notLoggedForm.lens.focus("confirmEmailAddress")}
                />
              </InputFieldMultiple>
            </div>
          </div>
          <FormButtons />
          <p className="mt-4 text-gray">
            Form protetto tramite reCAPTCHA e Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> e{" "}
            <a href="https://policies.google.com/terms">Termini di servizio</a>{" "}
            applicati.
          </p>
        </FormSection>
      )}
    </form>
  );
};
export default HelpForm;
