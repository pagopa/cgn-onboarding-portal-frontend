import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { Discount } from "../../../api/generated";
import { useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import {
  withNormalizedSpaces,
  clearIfReferenceIsBlank
} from "../../../utils/strings";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../utils/formChecks";
import FormSection from "../FormSection";
import { discountDataValidationSchema } from "../ValidationSchemas";
import {
  updateDiscountMutationOnError,
  discountEmptyInitialValues,
  sanitizeDiscountFormValues
} from "../discountFormUtils";

/**
 * These are the entry points for forms for discounts. This comment is repeated in every file.
 * src/components/Form/CreateProfileForm/DiscountData/DiscountData.tsx Used in onboarding process
 * src/components/Form/CreateDiscountForm/CreateDiscountForm.tsx Used to create new discount once onboarded
 * src/components/Form/EditDiscountForm/EditDiscountForm.tsx  Used to edit new discount once onboarded
 */
const EditDiscountForm = () => {
  const { discountId } = useParams<{ discountId: string }>();
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const { checkStaticCode, checkLanding, checkBucket } =
    getDiscountTypeChecks(profile);

  const tooltip = useTooltip();

  const updateDiscountMutation =
    remoteData.Index.Discount.updateDiscount.useMutation({
      onSuccess() {
        history.push(DASHBOARD);
      },
      onError: updateDiscountMutationOnError(tooltip)
    });
  const updateDiscount = (agreementId: string, discount: Discount) => {
    updateDiscountMutation.mutate({ agreementId, discountId, discount });
  };

  const discountQuery = remoteData.Index.Discount.getDiscountById.useQuery({
    agreementId: agreement.id,
    discountId
  });
  const discount = discountQuery.data;
  const initialValues = useMemo(() => {
    if (!discount) {
      return { ...discountEmptyInitialValues };
    }
    const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
      discount.description
    );
    const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(
      discount.condition
    );
    return {
      ...discount,
      name: withNormalizedSpaces(discount.name),
      name_en: withNormalizedSpaces(discount.name_en),
      name_de: "-",
      description: cleanedIfDescriptionIsBlank(discount.description),
      description_en: cleanedIfDescriptionIsBlank(discount.description_en),
      description_de: "-",
      condition: cleanedIfConditionIsBlank(discount.condition),
      condition_en: cleanedIfConditionIsBlank(discount.condition_en),
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
    };
  }, [discount]);

  const isLoading = profileQuery.isPending || discountQuery.isPending;

  if (isLoading) {
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
          const newValues = sanitizeDiscountFormValues(values);
          updateDiscount(agreement.id, newValues);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form autoComplete="off">
            <FormSection hasIntroduction>
              <DiscountInfo
                formValues={values}
                setFieldValue={setFieldValue}
                profile={profile}
              />
              {discount?.state !== "draft" && (
                <div className="d-flex mt-10 gap-4 flex-wrap">
                  <Button
                    className="px-14"
                    outline
                    color="primary"
                    tag="button"
                    onClick={() => history.push(DASHBOARD)}
                  >
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    className="px-14"
                    color="primary"
                    tag="button"
                    disabled={updateDiscountMutation.isPending}
                  >
                    Salva
                  </Button>
                </div>
              )}
              {discount?.state === "draft" && (
                <div className="mt-10">
                  <Button
                    className="px-14 me-4"
                    color="secondary"
                    tag="button"
                    onClick={() => history.push(DASHBOARD)}
                  >
                    Annulla
                  </Button>
                  <Button
                    type="submit"
                    className="px-14 me-4"
                    color="primary"
                    outline
                    tag="button"
                    disabled={updateDiscountMutation.isPending}
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
