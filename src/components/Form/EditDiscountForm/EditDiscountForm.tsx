import { format } from "date-fns";
import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { fromNullable } from "fp-ts/lib/Option";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { remoteData } from "../../../api/common";
import { Discount, ProductCategory } from "../../../api/generated";
import {
  Severity,
  TooltipContextProps,
  useTooltip
} from "../../../context/tooltip";
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

export const discountEmptyInitialValues = {
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
  staticCode: "",
  visibleOnEyca: false,
  eycaLandingPageUrl: undefined,
  discountUrl: "",
  lastBucketCodeLoadFileName: undefined,
  lastBucketCodeLoadUid: undefined
};

export function updateDiscountMutationOnError({
  triggerTooltip
}: TooltipContextProps) {
  return (error: AxiosError<unknown, unknown>) => {
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
        text: "È già in corso il caricamento di una lista di codici. Attendi il completamento e riprova."
      });
    } else {
      triggerTooltip({
        severity: Severity.DANGER,
        text: "Errore durante la modifica dell'opportunità, controllare i dati e riprovare"
      });
    }
  };
}

export function sanitizeDiscountFormValues(values: any) {
  const cleanedIfDescriptionIsBlank = clearIfReferenceIsBlank(
    values.description
  );
  const cleanedIfConditionIsBlank = clearIfReferenceIsBlank(values.condition);
  return {
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
}

/**
 * These are the entry points for forms for discounts. This comment is repeated in every file.
 * src/components/Form/CreateProfileForm/DiscountData/DiscountData.tsx Used in onboarding process
 * src/components/Form/CreateDiscountForm/CreateDiscountForm.tsx Used to create new discount once onboarded
 * src/components/Form/EditDiscountForm/EditDiscountForm.tsx  Used to edit new discount once onboarded
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
const EditDiscountForm = () => {
  const { discountId } = useParams<any>();
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
    };
  }, [discount]);

  const isLoading = profileQuery.isLoading || discountQuery.isLoading;

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
          void updateDiscount(agreement.id, newValues);
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
                    disabled={updateDiscountMutation.isLoading}
                  >
                    Salva
                  </Button>
                </div>
              )}
              {discount?.state === "draft" && (
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
                    disabled={updateDiscountMutation.isLoading}
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
