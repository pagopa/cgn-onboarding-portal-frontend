/* eslint-disable sonarjs/cognitive-complexity */
import { format } from "date-fns";
import { Button } from "design-react-kit";
import { FieldArray, Form, Formik } from "formik";
import { fromNullable } from "fp-ts/lib/Option";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  CreateDiscount,
  Discount,
  ProductCategory
} from "../../../../api/generated";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../../../utils/strings";
import { MAX_SELECTABLE_CATEGORIES } from "../../../../utils/constants";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountConditions from "../../CreateProfileForm/DiscountData/DiscountConditions";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import ProductCategories from "../../CreateProfileForm/DiscountData/ProductCategories";
import StaticCode from "../../CreateProfileForm/DiscountData/StaticCode";
import FormContainer from "../../FormContainer";
import FormField from "../../FormField";
import FormSection from "../../FormSection";
import { discountsListDataValidationSchema } from "../../ValidationSchemas";
import { remoteData } from "../../../../api/common";
import Bucket from "./Bucket";
import DiscountUrl from "./DiscountUrl";
import EnrollToEyca from "./EnrollToEyca";
import LandingPage from "./LandingPage";

const emptyInitialValues = {
  discounts: [
    {
      name: "",
      name_en: "",
      name_de: "-",
      description: "",
      description_en: "",
      description_de: "-",
      startDate: "",
      endDate: "",
      discount: "",
      discountUrl: "",
      productCategories: [],
      condition: "",
      condition_en: "",
      condition_de: "-",
      staticCode: ""
    }
  ]
};

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
  onUpdate: () => void;
};

const DiscountData = ({
  handleBack,
  handleNext,
  onUpdate,
  isCompleted
}: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const checkStaticCode =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Static";

  const checkLanding =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "LandingPage";

  const checkBucket =
    (profile?.salesChannel?.channelType === "OnlineChannel" ||
      profile?.salesChannel?.channelType === "BothChannels") &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    profile?.salesChannel?.discountCodeType === "Bucket";

  const createDiscountMutation = remoteData.Index.Discount.createDiscount.useMutation(
    {
      onSuccess() {
        handleNext();
      },
      onError(error) {
        if (error.status === 409) {
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Upload codici ancora in corso"
          });
        } else {
          triggerTooltip({
            severity: Severity.DANGER,
            text:
              "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
          });
        }
      }
    }
  );
  const createDiscount = (agreementId: string, discount: CreateDiscount) =>
    createDiscountMutation.mutate({ agreementId, discount });

  const updateDiscountMutation = remoteData.Index.Discount.updateDiscount.useMutation(
    {
      onSuccess() {
        onUpdate();
        handleNext();
      },
      async onError(error) {
        if (error.status === 409) {
          triggerTooltip({
            severity: Severity.DANGER,
            text: "Upload codici ancora in corso"
          });
        } else if (
          error.status === 400 &&
          error.response?.data ===
            "CANNOT_UPDATE_DISCOUNT_BUCKET_WHILE_PROCESSING_IS_RUNNING"
        ) {
          triggerTooltip({
            severity: Severity.DANGER,
            text:
              "È già in corso il caricamento di una lista di codici. Attendi il completamento e riprova."
          });
        } else {
          triggerTooltip({
            severity: Severity.DANGER,
            text:
              "Errore durante la modifica dell'opportunità, controllare i dati e riprovare"
          });
        }
      }
    }
  );

  const updateDiscount = (agreementId: string, discount: Discount) => {
    const {
      id,
      agreementId: agId,
      state,
      creationDate,
      ...updatedDiscount
    } = discount;
    updateDiscountMutation.mutate({
      agreementId,
      discountId: discount.id,
      discount: updatedDiscount
    });
  };

  const discountsQuery = remoteData.Index.Discount.getDiscounts.useQuery(
    {
      agreementId: agreement.id
    },
    {
      enabled: isCompleted
    }
  );

  const initialValues = useMemo(() => {
    if (discountsQuery.data) {
      return {
        discounts: discountsQuery.data.items.map((discount: Discount) => ({
          ...discount,
          name: withNormalizedSpaces(discount.name),
          name_en: withNormalizedSpaces(discount.name_en),
          name_de: "-",
          description: clearIfReferenceIsBlank(discount.description)(
            discount.description
          ),
          description_en: clearIfReferenceIsBlank(discount.description)(
            discount.description_en
          ),
          description_de: "-",
          condition: clearIfReferenceIsBlank(discount.condition)(
            discount.condition
          ),
          condition_en: clearIfReferenceIsBlank(discount.condition)(
            discount.condition_en
          ),
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
        }))
      };
    } else {
      return emptyInitialValues;
    }
  }, [discountsQuery.data]);

  const deleteDiscountMutation = remoteData.Index.Discount.deleteDiscount.useMutation();

  const deleteDiscount = (agreementId: string, discountId: string) => {
    deleteDiscountMutation.mutate({ agreementId, discountId });
  };

  const isLoading = profileQuery.isLoading || discountsQuery.isLoading;

  if (isLoading) {
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
          discounts: values.discounts.map(
            discount =>
              ({
                ...discount,
                name: withNormalizedSpaces(discount.name),
                name_en: withNormalizedSpaces(discount.name_en),
                name_de: "-",
                description: clearIfReferenceIsBlank(discount.description)(
                  discount.description
                ),
                description_en: clearIfReferenceIsBlank(discount.description)(
                  discount.description_en
                ),
                description_de: clearIfReferenceIsBlank(discount.description)(
                  discount.description_de
                ),
                condition: clearIfReferenceIsBlank(discount.condition)(
                  discount.condition
                ),
                condition_en: clearIfReferenceIsBlank(discount.condition)(
                  discount.condition_en
                ),
                condition_de: clearIfReferenceIsBlank(discount.condition)(
                  discount.condition_de
                ),
                productCategories: discount.productCategories.filter(
                  (pc: any) => Object.values(ProductCategory).includes(pc)
                ),
                startDate: format(new Date(discount.startDate), "yyyy-MM-dd"),
                endDate: format(new Date(discount.endDate), "yyyy-MM-dd")
              } as Discount)
          )
        };
        newValues.discounts.forEach((discount: Discount) => {
          if (isCompleted && discount.id) {
            void updateDiscount(agreement.id, discount);
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
                        entityType={agreement.entityType}
                      />
                      <FormField
                        htmlFor="productCategories"
                        isTitleHeading
                        title="Categorie merceologiche"
                        description={`Seleziona al massimo ${MAX_SELECTABLE_CATEGORIES} categorie merceologiche a cui appatengono i beni/servizi oggetto dell'opportunità`}
                        isVisible
                        required
                      >
                        <ProductCategories
                          selectedCategories={discount.productCategories}
                          index={index}
                        />
                      </FormField>
                      <FormField
                        htmlFor="discountConditions"
                        isTitleHeading
                        title="Condizioni dell’opportunità"
                        description="Descrivere eventuali limitazioni relative all’opportunità (es. sconto valido per l’acquisto di un solo abbonamento alla stagione di prosa presso gli sportelli del teatro) - Max 200 caratteri"
                        isVisible
                      >
                        <DiscountConditions index={index} />
                      </FormField>
                      {!checkLanding && (
                        <FormField
                          htmlFor="discountUrl"
                          title="Link all’opportunità"
                          description="Inserire l’URL di destinazione del sito o dell’app da cui i titolari di CGN potranno accedere all’opportunità"
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
                          description="Inserire il codice relativo all’opportunità che l’utente dovrà inserire sul vostro portale online"
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
                          description="Inserire l’URL della landing page da cui i titolari di CGN potranno accedere all’opportunità"
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
                      {(profile?.salesChannel?.channelType ===
                        "OnlineChannel" ||
                        profile?.salesChannel?.channelType ===
                          "BothChannels") && (
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
                                name_en: "",
                                name_de: "-",
                                description: "",
                                description_en: "",
                                description_de: "-",
                                startDate: "",
                                endDate: "",
                                discount: "",
                                discountUrl: "",
                                productCategories: [],
                                condition: "",
                                condition_en: "",
                                condition_de: "-",
                                staticCode: ""
                              })
                            }
                          >
                            <PlusCircleIcon className="mr-2" />
                            <span className="text-base font-weight-semibold text-blue">
                              {"Aggiungi un'altra opportunità"}
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
