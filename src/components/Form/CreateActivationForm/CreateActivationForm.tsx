import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Field, FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import { Button, Icon } from "design-react-kit";
import { Severity, useTooltip } from "../../../context/tooltip";
import Api from "../../../api/backoffice";
import chainAxios from "../../../utils/chainAxios";
import { ADMIN_PANEL_ACCESSI } from "../../../navigation/routes";
import FormSection from "../FormSection";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";
import InputField from "../FormField";
import CustomErrorMessage from "../CustomErrorMessage";
import PlusCircleIcon from "../../../assets/icons/plus-circle.svg";
import CenteredLoading from "../../CenteredLoading";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: [""]
};

const CreateActivationForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione dell'operatore, controllare i dati e riprovare"
    });
  };

  const createActivation = async (organization: OrganizationWithReferents) =>
    await tryCatch(
      () => Api.Activations.upsertOrganization(organization),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => {
          setLoading(false);
          throwErrorTooltip();
        },
        () => {
          setLoading(false);
          history.push(ADMIN_PANEL_ACCESSI);
        }
      )
      .run();

  return (
    <Formik
      initialValues={emptyInitialValues}
      onSubmit={values => {
        const newValues: OrganizationWithReferents = {
          ...values,
          keyOrganizationFiscalCode: values.organizationFiscalCode
        };
        setLoading(true);
        void createActivation(newValues);
      }}
    >
      {({ values }) => (
        <Form autoComplete="off">
          <FormSection
            title={"Dati operatore"}
            description={
              "Tutti i campi sono obbligatori. Questi dati non sono visibili in app IO."
            }
            isVisible={false}
          >
            <InputField
              htmlFor="organizationName"
              title="Denominazione e ragione sociale Operatore"
              description={"Inserire il nome completo dell'Operatore"}
              required
            >
              <Field
                id="organizationName"
                name="organizationName"
                type="text"
              />
              <CustomErrorMessage name="organizationName" />
            </InputField>
            <InputField
              htmlFor="organizationFiscalCode"
              title="Codice fiscale / Partita IVA"
              required
            >
              <Field
                id="organizationFiscalCode"
                name="organizationFiscalCode"
                type="text"
              />
              <CustomErrorMessage name="organizationFiscalCode" />
            </InputField>
            <InputField htmlFor="pec" title="Indirizzo PEC" required>
              <Field id="pec" name="pec" type="text" />
              <CustomErrorMessage name="pec" />
            </InputField>
          </FormSection>
          <FormSection
            title={"Utenti abilitati"}
            description={
              "Indicare il codice fiscale della persona o delle persone che devono accedere al portale per conto dell’operatore"
            }
            isVisible={false}
          >
            <FieldArray
              name="referents"
              render={({ push, remove }: FieldArrayRenderProps) => (
                <>
                  {values.referents.map((ref, i) => (
                    <div key={i}>
                      <InputField
                        htmlFor={`referents[${i}]`}
                        title={`Codice fiscale utente ${i + 1}`}
                        required
                      >
                        <div className="d-flex flex-row">
                          <div className="col-10">
                            <Field
                              id={`referents[${i}]`}
                              name={`referents[${i}]`}
                              type="text"
                            />
                          </div>
                          {i !== 0 && (
                            <Button
                              className="mr-4"
                              sm
                              color="link"
                              tag="button"
                              onClick={() => remove(i)}
                            >
                              <Icon icon="it-delete" size="sm" color="danger" />
                            </Button>
                          )}
                        </div>
                        <CustomErrorMessage name={`referents[${i}]`} />
                      </InputField>
                    </div>
                  ))}
                  <div className="mt-8 cursor-pointer" onClick={() => push("")}>
                    <PlusCircleIcon className="mr-2" />
                    <span className="text-base font-weight-semibold text-blue">
                      Aggiungi
                    </span>
                  </div>
                </>
              )}
            />
            <div className="mt-10">
              <Button
                className="px-14 mr-4"
                outline
                color="primary"
                tag="button"
                onClick={() => history.push(ADMIN_PANEL_ACCESSI)}
              >
                Indietro
              </Button>
              <Button
                type="submit"
                className="px-14 mr-4"
                color="primary"
                disabled={loading}
                tag="button"
              >
                {loading ? <CenteredLoading /> : "Salva"}
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};

export default CreateActivationForm;