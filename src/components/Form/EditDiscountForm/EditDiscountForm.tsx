import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { UpdateDiscount } from "../../../api/generated";
import { useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../utils/formChecks";
import FormSection from "../FormSection";
import { discountDataValidationSchema } from "../ValidationSchemas";
import {
  updateDiscountMutationOnError,
  discountFormValuesToRequest,
  DiscountFormValues,
  discountToFormValues
} from "../discountFormUtils";
import { zodSchemaToFormikValidationSchema } from "../../../utils/zodFormikAdapter";

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
  const updateDiscount = (agreementId: string, discount: UpdateDiscount) => {
    updateDiscountMutation.mutate({ agreementId, discountId, discount });
  };

  const discountQuery = remoteData.Index.Discount.getDiscountById.useQuery({
    agreementId: agreement.id,
    discountId
  });
  const discount = discountQuery.data;
  const initialValues = useMemo(
    () => discountToFormValues(discount),
    [discount]
  );

  const isPending = profileQuery.isPending || discountQuery.isPending;

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <>
      <Formik<DiscountFormValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={() =>
          zodSchemaToFormikValidationSchema(() =>
            discountDataValidationSchema(
              checkStaticCode,
              checkLanding,
              checkBucket
            )
          )
        }
        onSubmit={values => {
          const newValues = discountFormValuesToRequest(values);
          updateDiscount(agreement.id, newValues);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form autoComplete="off">
            <FormSection hasIntroduction>
              <DiscountInfo
                setFieldValue={setFieldValue}
                profile={profile}
                formValues={values}
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
