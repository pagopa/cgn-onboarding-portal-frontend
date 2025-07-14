import { Field, FieldArray, Form, Formik } from "formik";
import { Button, Icon } from "design-react-kit";
import { useHistory } from "react-router-dom";
import PlusCircleIcon from "../../assets/icons/plus-circle.svg?react";
import { ADMIN_PANEL_ACCESSI } from "../../navigation/routes";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  OrganizationWithReferents,
  EntityType
} from "../../api/generated_backoffice";
import { zodSchemaToFormikValidationSchema } from "../../utils/zodFormikAdapter";
import FormSection from "./FormSection";
import InputField from "./FormField";
import CustomErrorMessage from "./CustomErrorMessage";
import { activationValidationSchema } from "./ValidationSchemas";

type Props = {
  initialValues: OrganizationWithReferents;
  onSubmit: (values: OrganizationWithReferents) => void;
  isSubmitting: boolean;
  enableReinitialize: boolean;
  canChangeEntityType: boolean;
};

const ActivationForm = (props: Props) => {
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={props.enableReinitialize}
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      validationSchema={zodSchemaToFormikValidationSchema(
        () => activationValidationSchema
      )}
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
              description={"Inserire il nome completo dell'operatore"}
              required
            >
              <Field
                id="organizationName"
                name="organizationName"
                type="text"
                className="form-control"
              />
              <CustomErrorMessage name="organizationName" />
            </InputField>
            <InputField
              htmlFor="entityType"
              title="Tipologia di ente"
              required
              description="La scelta non potrà essere modificata in seguito"
            >
              <div className="form-check">
                <Field
                  id="entityTypePrivato"
                  name="entityType"
                  type="radio"
                  value={EntityType.Private}
                  readOnly={!props.canChangeEntityType}
                  disabled={!props.canChangeEntityType}
                />
                <label
                  className="text-sm fw-normal text-black form-label"
                  htmlFor="entityTypePrivato"
                >
                  <span className="text-sm">Privato</span>
                </label>
              </div>
              <div className="form-check">
                <Field
                  id="entityTypePubblico"
                  name="entityType"
                  type="radio"
                  value={EntityType.PublicAdministration}
                  readOnly={!props.canChangeEntityType}
                  disabled={!props.canChangeEntityType}
                />
                <label
                  className="text-sm fw-normal text-black form-label"
                  htmlFor="entityTypePubblico"
                >
                  <span className="text-sm">Pubblico</span>
                </label>
              </div>
              <CustomErrorMessage name="entityType" />
            </InputField>
            <InputField
              htmlFor="organizationFiscalCode"
              title="Partita IVA"
              required
              // NICE_TO_HAVE: aggiungere validazione della partita iva (può essere nazionale o estera, non può essere codice fiscale)
            >
              <Field
                id="organizationFiscalCode"
                name="organizationFiscalCode"
                type="text"
                className="form-control"
              />
              <CustomErrorMessage name="organizationFiscalCode" />
            </InputField>
            <InputField htmlFor="pec" title="Indirizzo PEC" required>
              <Field id="pec" name="pec" type="text" className="form-control" />
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
              render={({ push, remove }) => (
                <>
                  {values.referents.map((_, i) => (
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
                              className="form-control"
                            />
                          </div>
                          {i !== 0 && (
                            <Button
                              className="me-4"
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
                    <PlusCircleIcon className="me-2" />
                    <span className="text-base fw-semibold text-blue">
                      Aggiungi
                    </span>
                  </div>
                </>
              )}
            />
            <div className="d-flex mt-10 gap-4 flex-wrap">
              <Button
                className="px-14"
                outline
                color="primary"
                tag="button"
                onClick={() => history.push(ADMIN_PANEL_ACCESSI)}
              >
                Indietro
              </Button>
              <Button
                type="submit"
                className="px-14"
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
