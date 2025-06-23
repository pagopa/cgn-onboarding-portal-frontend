import { format } from "date-fns";
import { Button } from "design-react-kit";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  CreateDiscount,
  Discount,
  ProductCategory
} from "../../../../api/generated";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../../../utils/strings";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../../utils/formChecks";
import FormContainer from "../../FormContainer";
import FormSection from "../../FormSection";
import { discountsListDataValidationSchema } from "../../ValidationSchemas";
import { remoteData } from "../../../../api/common";
import {
  discountEmptyInitialValues,
  updateDiscountMutationOnError
} from "../../discountFormUtils";

const emptyInitialValues = {
  discounts: [discountEmptyInitialValues]
};

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
  onUpdate: () => void;
};

/**
 * These are the entry points for forms for discounts. This comment is repeated in every file.
 * src/components/Form/CreateProfileForm/DiscountData/DiscountData.tsx Used in onboarding process
 * src/components/Form/CreateDiscountForm/CreateDiscountForm.tsx Used to create new discount once onboarded
 * src/components/Form/EditDiscountForm/EditDiscountForm.tsx  Used to edit new discount once onboarded
 */
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

  const { checkStaticCode, checkLanding, checkBucket } =
    getDiscountTypeChecks(profile);

  const createDiscountMutation =
    remoteData.Index.Discount.createDiscount.useMutation({
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
            text: "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
          });
        }
      }
    });
  const createDiscount = (agreementId: string, discount: CreateDiscount) =>
    createDiscountMutation.mutate({ agreementId, discount });

  const updateDiscountMutation =
    remoteData.Index.Discount.updateDiscount.useMutation({
      onSuccess() {
        onUpdate();
        handleNext();
      },
      onError: updateDiscountMutationOnError({ triggerTooltip })
    });

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
          discountUrl: discount.discountUrl ?? undefined,
          startDate: new Date(discount.startDate),
          endDate: new Date(discount.endDate),
          landingPageReferrer: discount.landingPageReferrer ?? undefined,
          landingPageUrl: discount.landingPageUrl ?? undefined,
          discount: discount.discount ?? undefined,
          staticCode: discount.staticCode ?? undefined,
          lastBucketCodeLoadUid: discount.lastBucketCodeLoadUid ?? undefined,
          lastBucketCodeLoadFileName:
            discount.lastBucketCodeLoadFileName ?? undefined
        }))
      };
    } else {
      return emptyInitialValues;
    }
  }, [discountsQuery.data]);

  const deleteDiscountMutation =
    remoteData.Index.Discount.deleteDiscount.useMutation();

  const deleteDiscount = (agreementId: string, discountId: string) => {
    deleteDiscountMutation.mutate({ agreementId, discountId });
  };

  const isPending =
    profileQuery.isPending || (isCompleted ? discountsQuery.isPending : false);

  if (isPending) {
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
                productCategories: discount.productCategories.filter(pc =>
                  Object.values(ProductCategory).includes(pc)
                ),
                startDate: format(new Date(discount.startDate), "yyyy-MM-dd"),
                endDate: format(new Date(discount.endDate), "yyyy-MM-dd")
              }) as Discount
          )
        };
        newValues.discounts.forEach((discount: Discount) => {
          if (isCompleted && discount.id) {
            updateDiscount(agreement.id, discount);
          } else {
            createDiscount(agreement.id, discount);
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
                {values.discounts.map((discount, index: number) => (
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
                            deleteDiscount(
                              agreement.id,
                              (discount as { id: string }).id
                            );
                          }
                          arrayHelpers.remove(index);
                        }
                      }}
                      title="Dati dell’opportunità"
                    >
                      <DiscountInfo
                        formValues={values}
                        setFieldValue={setFieldValue}
                        index={index}
                        profile={profile}
                      />
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
                            <PlusCircleIcon className="me-2" />
                            <span className="text-base fw-semibold text-blue">
                              {"Aggiungi un'altra opportunità"}
                            </span>
                          </div>
                          <div className="d-flex mt-10 gap-4 flex-wrap">
                            <Button
                              className="px-14"
                              outline
                              color="primary"
                              tag="button"
                              onClick={handleBack}
                            >
                              Indietro
                            </Button>
                            <Button
                              type="submit"
                              className="px-14"
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
