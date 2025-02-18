import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { CreateDiscount } from "../../../api/generated";
import { Severity, useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import Bucket from "../CreateProfileForm/DiscountData/Bucket";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import DiscountUrl from "../CreateProfileForm/DiscountData/DiscountUrl";
import EnrollToEyca from "../CreateProfileForm/DiscountData/EnrollToEyca";
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import FormField from "../FormField";
import FormSection from "../FormSection";
import { discountDataValidationSchema } from "../ValidationSchemas";
import { MAX_SELECTABLE_CATEGORIES } from "../../../utils/constants";
import {
  discountEmptyInitialValues,
  getDiscountTypeChecks,
  sanitizeDiscountFormValues
} from "../EditDiscountForm/EditDiscountForm";

const CreateDiscountForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const { checkStaticCode, checkLanding, checkBucket } = getDiscountTypeChecks(
    profile
  );

  const createDiscountMutation = remoteData.Index.Discount.createDiscount.useMutation(
    {
      onSuccess() {
        history.push(DASHBOARD);
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text:
            "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
        });
      }
    }
  );

  const createDiscount = async (
    agreementId: string,
    discount: CreateDiscount
  ) => createDiscountMutation.mutate({ agreementId, discount });

  return (
    <Formik
      initialValues={{ ...discountEmptyInitialValues, discount: undefined }}
      validationSchema={() =>
        discountDataValidationSchema(checkStaticCode, checkLanding, checkBucket)
      }
      onSubmit={values => {
        const newValues = sanitizeDiscountFormValues(values);
        void createDiscount(agreement.id, newValues);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form autoComplete="off">
          <FormSection hasIntroduction>
            <DiscountInfo formValues={values} setFieldValue={setFieldValue} />
            <FormField
              htmlFor="productCategories"
              isTitleHeading
              title="Categorie merceologiche"
              description={`Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell'opportunità`}
              isVisible
              required
            >
              <ProductCategories
                selectedCategories={values.productCategories}
              />
            </FormField>
            <FormField
              htmlFor="discountConditions"
              isTitleHeading
              title="Condizioni dell’opportunità"
              description="Descrivere eventuali limitazioni relative all'opportunità (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
              isVisible
            >
              <DiscountConditions />
            </FormField>
            {!checkLanding && (
              <FormField
                htmlFor="discountUrl"
                title="Link all'opportunità"
                description="Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all'opportunità"
                isTitleHeading
                isVisible
              >
                <DiscountUrl />
              </FormField>
            )}
            {checkStaticCode && (
              <FormField
                htmlFor="staticCode"
                isTitleHeading
                title="Codice statico"
                description="Inserire il codice relativo all'opportunità che l’utente dovrà inserire sul vostro portale online"
                isVisible
                required
              >
                <StaticCode />
              </FormField>
            )}
            {checkLanding && (
              <FormField
                htmlFor="landingPage"
                isTitleHeading
                title="Indirizzo della landing page*"
                description="Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’opportunità"
                isVisible
                required
              >
                <LandingPage />
              </FormField>
            )}
            {checkBucket && (
              <Bucket
                agreementId={agreement.id}
                label={"Seleziona un file dal computer"}
                formValues={values}
                setFieldValue={setFieldValue}
              />
            )}
            {(profile?.salesChannel?.channelType === "OnlineChannel" ||
              profile?.salesChannel?.channelType === "BothChannels") && (
              <EnrollToEyca
                isEycaSupported={checkStaticCode}
                discountOption={
                  checkLanding
                    ? "Landing Page"
                    : checkBucket
                    ? "Lista di codici statici"
                    : "API"
                }
                isLandingPage={checkLanding}
                formValues={values}
                setFieldValue={setFieldValue}
              />
            )}
            <div className="mt-10">
              <Button
                className="px-14 mr-4"
                outline
                color="primary"
                tag="button"
                onClick={() => history.push(DASHBOARD)}
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

export default CreateDiscountForm;
