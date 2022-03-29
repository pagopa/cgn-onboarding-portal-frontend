import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { Form, Formik } from "formik";
import { format } from "date-fns";
import { Button } from "design-react-kit";
import { RootState } from "../../../store/store";
import { Severity, useTooltip } from "../../../context/tooltip";
import { CreateDiscount } from "../../../api/generated";
import Api from "../../../api/backoffice";
import chainAxios from "../../../utils/chainAxios";
import { ADMIN_PANEL_ACCESSI, DASHBOARD } from "../../../navigation/routes";
import { discountDataValidationSchema } from "../ValidationSchemas";
import FormSection from "../FormSection";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import FormField from "../FormField";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import DiscountUrl from "../CreateProfileForm/DiscountData/DiscountUrl";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";
import Bucket from "../CreateProfileForm/DiscountData/Bucket";
import EnrollToEyca from "../CreateProfileForm/DiscountData/EnrollToEyca";
import { OrganizationWithReferents } from "../../../api/generated_backoffice";

const emptyInitialValues: OrganizationWithReferents = {
  keyOrganizationFiscalCode: "",
  organizationFiscalCode: "",
  organizationName: "",
  insertedAt: "",
  pec: "",
  referents: []
};

const CreateActivationForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
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
      .fold(throwErrorTooltip, () => history.push(ADMIN_PANEL_ACCESSI))
      .run();

  return (
    <Formik
      initialValues={emptyInitialValues}
      onSubmit={values => {
        const newValues: OrganizationWithReferents = {
          ...values,
          keyOrganizationFiscalCode: values.organizationFiscalCode
        };
        void createActivation(newValues);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form autoComplete="off">
          <FormSection hasIntroduction>
            <FormField
              htmlFor="discountConditions"
              isTitleHeading
              title="Condizioni dell’agevolazione"
              description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
              isVisible
            >
              <DiscountConditions />
            </FormField>
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
                tag="button"
                aria-disabled={isSubmitting}
              >
                Salva
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};

export default CreateActivationForm;
