import { Button } from "design-react-kit";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { remoteData } from "../../api/common";
import { useTooltip } from "../../context/tooltip";
import { DASHBOARD } from "../../navigation/routes";
import { RootState } from "../../store/store";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import { getDiscountTypeChecks } from "../../utils/formChecks";
import { useStandardForm } from "../../utils/useStandardForm";
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

  const { checkStaticCode, checkLanding, checkBucket } = getDiscountTypeChecks(
    profile?.salesChannel
  );

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

  const form = useStandardForm({
    values: initialValues,
    zodSchema: discountDataValidationSchema(
      checkStaticCode,
      checkLanding,
      checkBucket
    )
  });

  const isPending =
    profileQuery.isPending || (discountId && discountQuery.isPending);

  if (isPending) {
    return <CenteredLoading />;
  }

  const isDraft = discount?.state === "draft";

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(async values => {
        const newValues = discountFormValuesToRequest(values);
        if (discountId) {
          await updateDiscountMutation.mutateAsync({
            agreementId: agreement.id,
            discountId,
            discount: newValues
          });
        } else {
          await createDiscountMutation.mutateAsync({
            agreementId: agreement.id,
            discount: newValues
          });
        }
      })}
    >
      <FormSection hasIntroduction>
        {profile && <DiscountInfo profile={profile} formLens={form.lens} />}
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
              form.formState.isSubmitting ||
              updateDiscountMutation.isPending ||
              createDiscountMutation.isPending
            }
          >
            Salva
          </Button>
        </div>
      </FormSection>
    </form>
  );
};
