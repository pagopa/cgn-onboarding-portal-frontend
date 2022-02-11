import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import Api from "../../../api";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../CreateProfileForm/DiscountData/StaticCode";
import { RootState } from "../../../store/store";
import FormSection from "../FormSection";
import FormField from "../FormField";
import { CreateDiscount } from "../../../api/generated";
import { DASHBOARD } from "../../../navigation/routes";
import { discountDataValidationSchema } from "../ValidationSchemas";
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";
import Bucket from "../CreateProfileForm/DiscountData/Bucket";
import { Severity, useTooltip } from "../../../context/tooltip";
import chainAxios from "../../../utils/chainAxios";
import EnrollToEyca from "../CreateProfileForm/DiscountData/EnrollToEyca";
import DiscountUrl from "../CreateProfileForm/DiscountData/DiscountUrl";

const emptyInitialValues = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  productCategories: [],
  condition: "",
  staticCode: "",
  enrollToEyca: false
};

const CreateDiscountForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione dell'agevolazione, controllare i dati e riprovare"
    });
  };

  const checkStaticCode =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "Static";

  const checkLanding =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    profile?.salesChannel?.discountCodeType === "Bucket";

  const createDiscount = async (
    agreementId: string,
    discount: CreateDiscount
  ) =>
    await tryCatch(
      () => Api.Discount.createDiscount(agreementId, discount),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(throwErrorTooltip, () => history.push(DASHBOARD))
      .run();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        profile => {
          setProfile({
            ...profile,
            hasDifferentFullName: !!profile.name
          });
          setLoading(false);
        }
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getProfile(agreement.id);
  }, []);

  return (
    <Formik
      initialValues={emptyInitialValues}
      validationSchema={() =>
        discountDataValidationSchema(checkStaticCode, checkLanding, checkBucket)
      }
      onSubmit={values => {
        const newValues = {
          ...values,
          description: values.description
            ? values.description.replace(/(\r\n|\n|\r)/gm, " ").trim()
            : "",
          condition: values.condition
            ? values.condition.replace(/(\r\n|\n|\r)/gm, " ").trim()
            : "",
          startDate: format(new Date(values.startDate), "yyyy-MM-dd"),
          endDate: format(new Date(values.endDate), "yyyy-MM-dd")
        };
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
              description="Seleziona la o le categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione"
              isVisible
              required
            >
              <ProductCategories />
            </FormField>
            <FormField
              htmlFor="discountConditions"
              isTitleHeading
              title="Condizioni dell’agevolazione"
              description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
              isVisible
            >
              <DiscountConditions />
            </FormField>
            {!checkLanding && (
              <FormField
                htmlFor="discountUrl"
                title="Link all’agevolazione"
                description="Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all’agevolazione"
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
                description="Inserire il codice relativo all’agevolazione che l’utente dovrà inserire sul vostro portale online"
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
                description="Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’agevolazione"
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
            {profile?.salesChannel?.channelType === "OnlineChannel" && (
              <EnrollToEyca
                isEycaSupported={checkStaticCode}
                discountOption={
                  checkLanding
                    ? "Landing Page"
                    : checkBucket
                    ? "Lista di codici statici"
                    : "API"
                }
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
