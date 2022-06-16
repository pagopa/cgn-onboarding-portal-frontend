/* eslint-disable sonarjs/cognitive-complexity */
import { AxiosResponse } from "axios";
import { format } from "date-fns";
import { Button } from "design-react-kit";
import { FieldArray, Form, Formik } from "formik";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Api from "../../../../api";
import {
  CreateDiscount,
  Discount,
  Discounts,
  ProductCategory
} from "../../../../api/generated";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountConditions from "../../CreateProfileForm/DiscountData/DiscountConditions";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../../CreateProfileForm/DiscountData/ProductCategories";
import StaticCode from "../../CreateProfileForm/DiscountData/StaticCode";
import FormContainer from "../../FormContainer";
import FormField from "../../FormField";
import FormSection from "../../FormSection";
import { discountsListDataValidationSchema } from "../../ValidationSchemas";
import Bucket from "./Bucket";
import DiscountUrl from "./DiscountUrl";
import EnrollToEyca from "./EnrollToEyca";
import LandingPage from "./LandingPage";

const emptyInitialValues = {
  discounts: [
    {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      discount: "",
      discountUrl: "",
      productCategories: [],
      condition: "",
      staticCode: "",
      enrollToEyca: false
    }
  ]
};

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
  onUpdate: () => void;
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

const DiscountData = ({
  handleBack,
  handleNext,
  onUpdate,
  isCompleted
}: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();
  const [initialValues, setInitialValues] = useState<any>(emptyInitialValues);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione dell'agevolazione, controllare i dati e riprovare"
    });
  };

  const editThrowErrorTooltip = (e: string) => {
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

  const createDiscount = (agreementId: string, discount: CreateDiscount) =>
    pipe(
      TE.tryCatch(
        () => Api.Discount.createDiscount(agreementId, discount),
        toError
      ),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(throwErrorTooltip),
      TE.map(() => handleNext())
    )();

  const updateDiscount = async (agreementId: string, discount: Discount) => {
    const {
      id,
      agreementId: agId,
      state,
      creationDate,
      ...updatedDiscount
    } = discount;
    await pipe(
      TE.tryCatch(
        () =>
          Api.Discount.updateDiscount(
            agreementId,
            discount.id,
            updatedDiscount
          ),
        toError
      ),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(e => editThrowErrorTooltip(e.message)),
      TE.map(() => handleNext())
    )();
  };

  const getDiscounts = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Discount.getDiscounts(agreementId), toError),
      TE.chain(chainAxios),
      TE.map(response => response.data),
      TE.mapLeft(() => setLoading(false)),
      TE.map((discounts: Discounts) => {
        setInitialValues({
          discounts: discounts.items.map((discount: Discount) => ({
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
            staticCode: pipe(
              O.fromNullable(discount.staticCode),
              O.toUndefined
            ),
            lastBucketCodeLoadUid: pipe(
              O.fromNullable(discount.lastBucketCodeLoadUid),
              O.toUndefined
            ),
            lastBucketCodeLoadFileName: pipe(
              O.fromNullable(discount.lastBucketCodeLoadFileName),
              O.toUndefined
            )
          }))
        });
        setLoading(false);
      })
    )();

  const deleteDiscount = (agreementId: string, discountId: string) =>
    TE.tryCatch(
      () => Api.Discount.deleteDiscount(agreementId, discountId),
      toError
    )();

  const getProfile = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Profile.getProfile(agreementId), toError),
      TE.chain(chainAxios),
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
    if (isCompleted) {
      setLoading(true);
      void getDiscounts(agreement.id);
    } else {
      setLoading(false);
    }
    void getProfile(agreement.id);
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={discountsListDataValidationSchema(
        checkStaticCode,
        checkLanding,
        checkBucket
      )}
      onSubmit={values => {
        const newValues: { discounts: ReadonlyArray<Discount> } = {
          discounts: values.discounts.map((discount: CreateDiscount) => ({
            ...discount,
            description: discount.description
              ? discount.description.replace(/(\r\n|\n|\r)/gm, " ").trim()
              : "",
            condition: discount.condition
              ? discount.condition.replace(/(\r\n|\n|\r)/gm, " ").trim()
              : "",
            productCategories: discount.productCategories.filter((pc: any) =>
              Object.values(ProductCategory).includes(pc)
            ),
            startDate: format(new Date(discount.startDate), "yyyy-MM-dd"),
            endDate: format(new Date(discount.endDate), "yyyy-MM-dd")
          }))
        };
        newValues.discounts.forEach((discount: Discount) => {
          if (isCompleted && discount.id) {
            void updateDiscount(agreement.id, discount).then(() => onUpdate());
          } else {
            void createDiscount(agreement.id, discount);
          }
        });
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form autoComplete="off">
          <FieldArray
            name="discounts"
            render={arrayHelpers => (
              <>
                {values.discounts.map((discount: any, index: number) => (
                  <FormContainer
                    key={index}
                    className={index <= 1 ? "mb-20" : ""}
                  >
                    <FormSection
                      hasIntroduction
                      hasClose={index >= 1}
                      handleClose={() => {
                        if (index >= 1) {
                          if (isCompleted) {
                            void deleteDiscount(agreement.id, discount.id);
                          }
                          arrayHelpers.remove(index);
                        }
                      }}
                    >
                      <DiscountInfo
                        formValues={values}
                        setFieldValue={setFieldValue}
                        index={index}
                      />
                      <FormField
                        htmlFor="productCategories"
                        isTitleHeading
                        title="Categorie merceologiche"
                        description="Seleziona la o le categorie merceologiche a cui appatengono i beni/servizi oggetto dell’agevolazione"
                        isVisible
                        required
                      >
                        <ProductCategories index={index} />
                      </FormField>
                      <FormField
                        htmlFor="discountConditions"
                        isTitleHeading
                        title="Condizioni dell’agevolazione"
                        description="Descrivere eventuali limitazioni relative all’agevolazione (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
                        isVisible
                      >
                        <DiscountConditions index={index} />
                      </FormField>
                      {!checkLanding && (
                        <FormField
                          htmlFor="discountUrl"
                          title="Link all’agevolazione"
                          description="Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all’agevolazione"
                          isTitleHeading
                          isVisible
                        >
                          <DiscountUrl index={index} />
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
                          <StaticCode index={index} />
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
                          <LandingPage index={index} />
                        </FormField>
                      )}
                      {checkBucket && (
                        <Bucket
                          agreementId={agreement.id}
                          label={"Seleziona un file dal computer"}
                          index={index}
                          formValues={values}
                          setFieldValue={setFieldValue}
                        />
                      )}
                      {profile?.salesChannel?.channelType ===
                        "OnlineChannel" && (
                        <EnrollToEyca
                          isEycaSupported={checkStaticCode}
                          discountOption={
                            checkLanding
                              ? "Landing Page"
                              : checkBucket
                              ? "Lista di codici statici"
                              : "API"
                          }
                          index={index}
                          formValues={values}
                          setFieldValue={setFieldValue}
                        />
                      )}
                      {values.discounts.length - 1 === index && (
                        <>
                          <div
                            className="mt-8 cursor-pointer"
                            onClick={() =>
                              arrayHelpers.push({
                                name: "",
                                description: "",
                                startDate: "",
                                endDate: "",
                                discount: "",
                                productCategories: [],
                                condition: "",
                                staticCode: ""
                              })
                            }
                          >
                            <PlusCircleIcon className="mr-2" />
                            <span className="text-base font-weight-semibold text-blue">
                              Aggiungi un&apos;altra agevolazione
                            </span>
                          </div>
                          <div className="mt-10">
                            <Button
                              className="px-14 mr-4"
                              outline
                              color="primary"
                              tag="button"
                              onClick={handleBack}
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
                              Continua
                            </Button>
                          </div>
                        </>
                      )}
                    </FormSection>
                  </FormContainer>
                ))}
              </>
            )}
          />
        </Form>
      )}
    </Formik>
  );
};

export default DiscountData;
