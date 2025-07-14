import { Button } from "design-react-kit";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../../utils/formChecks";
import FormContainer from "../../FormContainer";
import FormSection from "../../FormSection";
import { discountsListDataValidationSchema } from "../../ValidationSchemas";
import { remoteData } from "../../../../api/common";
import {
  discountEmptyInitialValues,
  discountFormValuesToRequest,
  discountToFormValues,
  updateDiscountMutationOnError
} from "../../discountFormUtils";
import { zodSchemaToFormikValidationSchema } from "../../../../utils/zodFormikAdapter";

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

  const updateDiscountMutation =
    remoteData.Index.Discount.updateDiscount.useMutation({
      onSuccess() {
        onUpdate();
        handleNext();
      },
      onError: updateDiscountMutationOnError({ triggerTooltip })
    });

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
        discounts: discountsQuery.data.items.map(discountToFormValues)
      };
    } else {
      return emptyInitialValues;
    }
  }, [discountsQuery.data]);

  const deleteDiscountMutation =
    remoteData.Index.Discount.deleteDiscount.useMutation();

  const isPending =
    profileQuery.isPending || (isCompleted ? discountsQuery.isPending : false);

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={zodSchemaToFormikValidationSchema(() =>
        discountsListDataValidationSchema(
          checkStaticCode,
          checkLanding,
          checkBucket
        )
      )}
      onSubmit={values => {
        values.discounts.forEach(vals => {
          const discount = discountFormValuesToRequest(vals);
          if (isCompleted && vals.id) {
            updateDiscountMutation.mutate({
              agreementId: agreement.id,
              discountId: vals.id,
              discount
            });
          } else {
            createDiscountMutation.mutate({
              agreementId: vals.id,
              discount
            });
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
                            deleteDiscountMutation.mutate({
                              agreementId: agreement.id,
                              discountId: discount.id
                            });
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
                              arrayHelpers.push(discountEmptyInitialValues)
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
