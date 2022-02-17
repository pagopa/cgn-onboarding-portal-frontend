/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FieldArray, Form, Formik } from "formik";
import { Button } from "design-react-kit";
import { fromPredicate, tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { format } from "date-fns";
import { AxiosResponse } from "axios";
import { Severity, useTooltip } from "../../../../context/tooltip";
import Api from "../../../../api";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../../CreateProfileForm/DiscountData/ProductCategories";
import DiscountConditions from "../../CreateProfileForm/DiscountData/DiscountConditions";
import StaticCode from "../../CreateProfileForm/DiscountData/StaticCode";
import FormContainer from "../../FormContainer";
import { RootState } from "../../../../store/store";
import FormSection from "../../FormSection";
import FormField from "../../FormField";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import {
  CreateDiscount,
  Discount,
  Discounts,
  ProductCategory
} from "../../../../api/generated";
import { discountsListDataValidationSchema } from "../../ValidationSchemas";
import LandingPage from "./LandingPage";
import Bucket from "./Bucket";
import EnrollToEyca from "./EnrollToEyca";
import DiscountUrl from "./DiscountUrl";

const emptyInitialValues = {
  discounts: [
    {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      discount: "",
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
  fromPredicate(
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
      .fold(throwErrorTooltip, () => handleNext())
      .run();

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
        Api.Discount.updateDiscount(agreementId, discount.id, updatedDiscount),
      toError
    )
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        e => editThrowErrorTooltip(e.message),
        () => handleNext()
      )
      .run();
  };

  const getDiscounts = async (agreementId: string) =>
    await tryCatch(() => Api.Discount.getDiscounts(agreementId), toError)
      .chain(chainAxios)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        (discounts: Discounts) => {
          setInitialValues({
            discounts: discounts.items.map((discount: Discount) => ({
              ...discount,
              discountUrl:
                discount.discountUrl === null
                  ? undefined
                  : discount.discountUrl,
              startDate: new Date(discount.startDate),
              endDate: new Date(discount.endDate),
              landingPageReferrer:
                discount.landingPageReferrer === null
                  ? undefined
                  : discount.landingPageReferrer,
              landingPageUrl:
                discount.landingPageUrl === null
                  ? undefined
                  : discount.landingPageUrl,
              discount:
                discount.discount === null ? undefined : discount.discount,
              staticCode:
                discount.staticCode === null ? undefined : discount.staticCode,
              lastBucketCodeLoadUid:
                discount.lastBucketCodeLoadUid === null
                  ? undefined
                  : discount.lastBucketCodeLoadUid,
              lastBucketCodeLoadFileName:
                discount.lastBucketCodeLoadFileName === null
                  ? undefined
                  : discount.lastBucketCodeLoadFileName
            }))
          });
          setLoading(false);
        }
      )
      .run();

  const deleteDiscount = async (agreementId: string, discountId: string) =>
    await tryCatch(
      () => Api.Discount.deleteDiscount(agreementId, discountId),
      toError
    ).run();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .chain(chainAxios)
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
