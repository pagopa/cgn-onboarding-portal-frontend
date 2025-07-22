import { Button } from "design-react-kit";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { z } from "zod/v4";
import { useFieldArray } from "@hookform/lenses/rhf";
import PlusCircleIcon from "../../../../assets/icons/plus-circle.svg?react";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import DiscountInfo from "../../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../../utils/formChecks";
import FormContainer from "../../FormContainer";
import FormSection from "../../FormSection";
import { remoteData } from "../../../../api/common";
import {
  createDiscountMutationOnError,
  discountEmptyInitialValues,
  discountFormValuesToRequest,
  discountToFormValues,
  updateDiscountMutationOnError
} from "../../discountFormUtils";
import { useStandardForm } from "../../../../utils/useStandardForm";
import { discountDataValidationSchema } from "../../ValidationSchemas";

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

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;

  const discountsQuery = remoteData.Index.Discount.getDiscounts.useQuery(
    { agreementId: agreement.id },
    { enabled: isCompleted }
  );

  const { checkStaticCode, checkLanding, checkBucket } =
    getDiscountTypeChecks(profile);

  const createDiscountMutation =
    remoteData.Index.Discount.createDiscount.useMutation({
      onSuccess() {
        remoteData.Index.Discount.getDiscounts.invalidateQueries({});
      },
      onError: createDiscountMutationOnError(triggerTooltip)
    });

  const updateDiscountMutation =
    remoteData.Index.Discount.updateDiscount.useMutation({
      onSuccess() {
        remoteData.Index.Discount.getDiscounts.invalidateQueries({});
      },
      onError: updateDiscountMutationOnError(triggerTooltip)
    });

  const deleteDiscountMutation =
    remoteData.Index.Discount.deleteDiscount.useMutation({
      onSuccess() {
        remoteData.Index.Discount.getDiscounts.invalidateQueries({});
      },
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Errore durante l'eliminazione dello sconto"
        });
      }
    });

  const initialValues = useMemo(
    () =>
      discountsQuery.data
        ? discountsQuery.data.items.map(discountToFormValues)
        : [discountEmptyInitialValues],
    [discountsQuery.data]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useStandardForm({
    values: initialValues,
    zodSchema: z.array(
      discountDataValidationSchema(checkStaticCode, checkLanding, checkBucket)
    )
  });

  const discountsArray = useFieldArray(form.lens.interop());

  const isPending =
    !profile ||
    profileQuery.isPending ||
    (isCompleted ? discountsQuery.isPending : false);

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <form
      onSubmit={form.handleSubmit(async values => {
        // eslint-disable-next-line functional/no-let
        let triggerOnUpdate = false;
        try {
          for (const vals of values) {
            const discount = discountFormValuesToRequest(vals);
            if (isCompleted && vals.id) {
              await updateDiscountMutation.mutateAsync({
                agreementId: agreement.id,
                discountId: vals.id,
                discount
              });
              triggerOnUpdate = true;
            } else {
              await createDiscountMutation.mutateAsync({
                agreementId: agreement.id,
                discount
              });
            }
          }
          if (triggerOnUpdate) {
            onUpdate();
          }
          handleNext();
        } catch {
          void 0;
        }
      })}
    >
      {form.lens.map(
        discountsArray.fields,
        (discount, itemLens, index, array) => (
          <FormContainer key={index} className={index <= 1 ? "mb-20" : ""}>
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
                  discountsArray.remove(index);
                }
              }}
              title="Dati dell’opportunità"
            >
              <DiscountInfo
                profile={profile}
                formLens={itemLens}
                index={index}
              />
              {array.length - 1 === index && (
                <>
                  <div
                    className="mt-8 cursor-pointer"
                    onClick={() =>
                      discountsArray.append(discountEmptyInitialValues)
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
                      aria-disabled={
                        form.formState.isSubmitting ||
                        createDiscountMutation.isPending ||
                        updateDiscountMutation.isPending ||
                        deleteDiscountMutation.isPending
                      }
                    >
                      Continua
                    </Button>
                  </div>
                </>
              )}
            </FormSection>
          </FormContainer>
        )
      )}
    </form>
  );
};

export default DiscountData;
