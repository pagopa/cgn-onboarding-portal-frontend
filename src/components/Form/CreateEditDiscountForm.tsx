import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { remoteData } from "../../api/common";
import { useTooltip } from "../../context/tooltip";
import { DASHBOARD } from "../../navigation/routes";
import { RootState } from "../../store/store";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import { getDiscountTypeChecks } from "../../utils/formChecks";
import { zodSchemaToFormikValidationSchema } from "../../utils/zodFormikAdapter";
import DiscountInfo from "./CreateProfileForm/DiscountData/DiscountInfo";
import FormSection from "./FormSection";
import { discountDataValidationSchema } from "./ValidationSchemas";
import {
  createDiscountMutationOnError,
  discountFormValuesToRequest,
  discountToFormValues,
  updateDiscountMutationOnError
} from "./discountFormUtils";

export const CreateEditDiscountForm = () => {
  const { discountId } = useParams<{ discountId: string }>();
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const { checkStaticCode, checkLanding, checkBucket } =
    getDiscountTypeChecks(profile);

  const createDiscountMutation =
    remoteData.Index.Discount.createDiscount.useMutation({
      onSuccess() {
        history.push(DASHBOARD);
      },
      onError: createDiscountMutationOnError(triggerTooltip)
    });

  const updateDiscountMutation =
    remoteData.Index.Discount.updateDiscount.useMutation({
      onSuccess() {
        history.push(DASHBOARD);
      },
      onError: updateDiscountMutationOnError(triggerTooltip)
    });

  const discountQuery = remoteData.Index.Discount.getDiscountById.useQuery(
    { agreementId: agreement.id, discountId },
    { enabled: Boolean(discountId) }
  );
  const discount = discountQuery.data;
  const initialValues = useMemo(
    () => discountToFormValues(discount),
    [discount]
  );

  const isPending = profileQuery.isPending || discountQuery.isPending;

  if (isPending) {
    return <CenteredLoading />;
  }

  const isDraft = discount?.state === "draft";

  return (
    <Formik
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
        if (discountId) {
          updateDiscountMutation.mutate({
            agreementId: agreement.id,
            discountId,
            discount: newValues
          });
        } else {
          createDiscountMutation.mutate({
            agreementId: agreement.id,
            discount: newValues
          });
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form autoComplete="off">
          <FormSection hasIntroduction>
            <DiscountInfo
              profile={profile}
              formValues={values}
              setFieldValue={setFieldValue}
            />
            <div className="d-flex mt-10 gap-4 flex-wrap">
              <Button
                className="px-14"
                outline={!isDraft}
                color={isDraft ? "secondary" : "primary"}
                tag="button"
                onClick={() => history.push(DASHBOARD)}
              >
                {isDraft ? "Annulla" : "Indietro"}
              </Button>
              <Button
                type="submit"
                className="px-14"
                color="primary"
                outline={isDraft}
                tag="button"
                disabled={
                  updateDiscountMutation.isPending ||
                  createDiscountMutation.isPending
                }
              >
                Salva
              </Button>
            </div>
          </FormSection>
        </Form>
      )}
    </Formik>
  );
};
