import { AxiosResponse } from "axios";
import { format } from "date-fns";
import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Api from "../../../api";
import { Discount, ProductCategory } from "../../../api/generated";
import { Severity, useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
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
import LandingPage from "../CreateProfileForm/DiscountData/LandingPage";
import Bucket from "../CreateProfileForm/DiscountData/Bucket";
import { Severity, useTooltip } from "../../../context/tooltip";
import EnrollToEyca from "../CreateProfileForm/DiscountData/EnrollToEyca";
import DiscountUrl from "../CreateProfileForm/DiscountData/DiscountUrl";

const emptyInitialValues = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  discount: "",
  productCategories: [],
  condition: "",
  staticCode: "",
  enrollToEyca: false
};

const chainAxios = (response: AxiosResponse) =>
  TE.fromPredicate(
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
    void pipe(
      TE.tryCatch(
        () =>
          Api.Discount.updateDiscount(agreementId, discountId, updatedDiscount),
        toError
      ),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(e => throwErrorTooltip(e.message)),
      TE.map(() => history.push(DASHBOARD))
    )();
  };

  const getDiscount = (agreementId: string) =>
    pipe(
      TE.tryCatch(
        () => Api.Discount.getDiscountById(agreementId, discountId),
        toError
      ),
      TE.map(response => response.data),
      TE.mapLeft(() => setLoading(false)),
      TE.map((discount: Discount) => {
        setInitialValues({
          ...discount,
          discountUrl: pipe(
            O.fromNullable(discount.discountUrl),
            O.toUndefined
          ),
          startDate: new Date(discount.startDate),
          endDate: new Date(discount.endDate),
          landingPageReferrer: pipe(
            O.fromNullable(discount.landingPageReferrer),
            O.toUndefined
          ),
          landingPageUrl: pipe(
            O.fromNullable(discount.landingPageUrl),
            O.toUndefined
          ),
          discount: pipe(O.fromNullable(discount.discount), O.toUndefined),
          staticCode: pipe(O.fromNullable(discount.staticCode), O.toUndefined),
          lastBucketCodeLoadUid: pipe(
            O.fromNullable(discount.lastBucketCodeLoadUid),
            O.toUndefined
          ),
          lastBucketCodeLoadFileName: pipe(
            O.fromNullable(discount.lastBucketCodeLoadFileName),
            O.toUndefined
          )
        });
        setLoading(false);
      })
    )();

  const getProfile = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Profile.getProfile(agreementId), toError),
      TE.map(response => response.data),
      TE.mapLeft(() => setLoading(false)),
      TE.map(profile => {
        setProfile({
          ...profile,
          hasDifferentFullName: !!profile.name
        });
        setLoading(false);
      })
    )();

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
          const newValues = {
            ...values,
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
