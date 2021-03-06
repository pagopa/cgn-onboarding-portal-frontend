import { Field, FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import { Button, Icon } from "design-react-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import PlusCircleIcon from "../../assets/icons/plus-circle.svg";
import { ADMIN_PANEL_ACCESSI } from "../../navigation/routes";
import CenteredLoading from "../CenteredLoading";
import FormSection from "./FormSection";
import InputField from "./FormField";
import CustomErrorMessage from "./CustomErrorMessage";
import { activationValidationSchema } from "./ValidationSchemas";

type Props = {
  initialValues: any;
  onSubmit: (values: any) => void;
  isSubmitting: boolean;
  enableReinitialize: boolean;
};

const ActivationForm = (props: Props) => {
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={props.enableReinitialize}
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={activationValidationSchema}
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
              "Indicare il codice fiscale della persona o delle persone che devono accedere al portale per conto dell???operatore"
            }
            isVisible={false}
          >
            <FieldArray
              name="referents"
              render={({ push, remove }: FieldArrayRenderProps) => (
                <>
                  {values.referents.map((_: string, i: number) => (
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
                disabled={props.isSubmitting}
                tag="button"
              >
                {props.isSubmitting ? <CenteredLoading /> : "Salva"}
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};

export default ActivationForm;
