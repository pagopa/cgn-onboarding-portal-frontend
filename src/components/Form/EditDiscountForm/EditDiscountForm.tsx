import { AxiosResponse } from "axios";
import { format } from "date-fns";
import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/lib/Either";
import { fromNullable } from "fp-ts/lib/Option";
import { fromPredicate, tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Api from "../../../api";
import { Discount, ProductCategory } from "../../../api/generated";
import { Severity, useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import {
  withNormalizedSpaces,
  clearIfReferenceIsBlank
} from "../../../utils/strings";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
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
import { MAX_CATEGORIES_SELECTED } from "../../../utils/constants";

const emptyInitialValues = {
  name: "",
  name_en: "",
  name_de: "-",
  description: "",
  description_en: "",
  description_de: "-",
  startDate: "",
  endDate: "",
  discount: "",
  productCategories: [],
  condition: "",
  condition_en: "",
  condition_de: "-",
  staticCode: ""
};

const chainAxios = (response: AxiosResponse) =>
  fromPredicate(
    (_: AxiosResponse) => _.status === 200 || _.status === 204,
    (r: AxiosResponse) =>
      r.status === 409
        ? new Error("Upload codici ancora in corso")
        : new Error(
            "Errore durante la modifica dell'agevolazione, controllare i dati e riprovare"
          )
  )(response);

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditDiscountForm = () => {
  const { discountId } = useParams<any>();
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [initialValues, setInitialValues] = useState<any>(emptyInitialValues);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();
  const { triggerTooltip } = useTooltip();

  const throwErrorTooltip = (e: string) => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: e
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

  const updateDiscount = async (agreementId: string, discount: Discount) => {
    const {
      id,
      agreementId: agId,
      state,
      creationDate,
      ...updatedDiscount
    } = discount;
    await tryCatch(
      () =>
        Api.Discount.updateDiscount(agreementId, discountId, updatedDiscount),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        e => throwErrorTooltip(e.message),
        () => history.push(DASHBOARD)
      )
      .run();
  };

  const getDiscount = async (agreementId: string) =>
    await tryCatch(
      () => Api.Discount.getDiscountById(agreementId, discountId),
      toError
    )
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        (discount: Discount) => {
          const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
            discount.description
          );
          const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(
            discount.condition
          );
          setInitialValues({
            ...discount,
            name: withNormalizedSpaces(discount.name),
            name_en: withNormalizedSpaces(discount.name_en),
            name_de: "-",
            description: cleanedIfDescriptionIsBlank(discount.description),
            description_en: cleanedIfDescriptionIsBlank(
              discount.description_en
            ),
            description_de: "-",
            condition: cleanedIfConditionIsBlank(discount.condition),
            condition_en: cleanedIfConditionIsBlank(discount.condition_en),
            condition_de: "-",
            discountUrl: fromNullable(discount.discountUrl).toUndefined(),
            startDate: new Date(discount.startDate),
            endDate: new Date(discount.endDate),
            landingPageReferrer: fromNullable(
              discount.landingPageReferrer
            ).toUndefined(),
            landingPageUrl: fromNullable(discount.landingPageUrl).toUndefined(),
            discount: fromNullable(discount.discount).toUndefined(),
            staticCode: fromNullable(discount.staticCode).toUndefined(),
            lastBucketCodeLoadUid: fromNullable(
              discount.lastBucketCodeLoadUid
            ).toUndefined(),
            lastBucketCodeLoadFileName: fromNullable(
              discount.lastBucketCodeLoadFileName
            ).toUndefined()
          });
          setLoading(false);
        }
      )
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
    void getDiscount(agreement.id);
    void getProfile(agreement.id);
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={() =>
          discountDataValidationSchema(
            checkStaticCode,
            checkLanding,
            checkBucket
          )
        }
        onSubmit={values => {
          const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
            values.description
          );
          const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(
            values.condition
          );
          const newValues = {
            ...values,
            name: withNormalizedSpaces(values.name),
            name_en: withNormalizedSpaces(values.name_en),
            name_de: "-",
            description: cleanedIfDescriptionIsBlank(values.description),
            description_en: cleanedIfDescriptionIsBlank(values.description_en),
            description_de: cleanedIfDescriptionIsBlank(values.description_de),
            condition: cleanedIfConditionIsBlank(values.condition),
            condition_en: cleanedIfConditionIsBlank(values.condition_en),
            condition_de: cleanedIfConditionIsBlank(values.condition_de),
            productCategories: values.productCategories.filter((pc: any) =>
              Object.values(ProductCategory).includes(pc)
            ),
            startDate: format(new Date(values.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(values.endDate), "yyyy-MM-dd")
          };
          void updateDiscount(agreement.id, newValues);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form autoComplete="off">
            <FormSection hasIntroduction>
              <DiscountInfo formValues={values} setFieldValue={setFieldValue} />
              <FormField
                htmlFor="productCategories"
                isTitleHeading
                title="Categorie merceologiche"
                description={`Seleziona al massimo ${MAX_CATEGORIES_SELECTED} categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione`}
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
                  title="Indirizzo della landing page"
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
                  formValues={values}
                  setFieldValue={setFieldValue}
                />
              )}
              {initialValues.state !== "draft" && (
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
                  >
                    Salva
                  </Button>
                </div>
              )}
              {initialValues.state === "draft" && (
                <div className="mt-10">
                  <Button
                    className="px-14 mr-4"
                    color="secondary"
                    tag="button"
                    onClick={() => history.push(DASHBOARD)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="px-14 mr-4"
                    color="primary"
                    outline
                    tag="button"
                  >
                    Salva
                  </Button>
                </div>
              )}
            </FormSection>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EditDiscountForm;
