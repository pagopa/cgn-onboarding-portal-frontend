import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { CreateDiscount } from "../../../api/generated";
import { Severity, useTooltip } from "../../../context/tooltip";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import DiscountInfo from "../CreateProfileForm/DiscountData/DiscountInfo";
import { getDiscountTypeChecks } from "../../../utils/formChecks";
import FormSection from "../FormSection";
import { discountDataValidationSchema } from "../ValidationSchemas";
import {
  discountEmptyInitialValues,
  discountFormValuesToRequest
} from "../discountFormUtils";
import { zodSchemaToFormikValidationSchema } from "../../../utils/zodFormikAdapter";

/**
 * These are the entry points for forms for discounts. This comment is repeated in every file.
 * src/components/Form/CreateProfileForm/DiscountData/DiscountData.tsx Used in onboarding process
 * src/components/Form/CreateDiscountForm/CreateDiscountForm.tsx Used to create new discount once onboarded
 * src/components/Form/EditDiscountForm/EditDiscountForm.tsx  Used to edit new discount once onboarded
 */
const CreateDiscountForm = () => {
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
      onError() {
        triggerTooltip({
          severity: Severity.DANGER,
          text: "Errore durante la creazione dell'opportunità, controllare i dati e riprovare"
        });
      }
    });

  const createDiscount = (agreementId: string, discount: CreateDiscount) =>
    createDiscountMutation.mutate({ agreementId, discount });

  return (
    <Formik
      initialValues={discountEmptyInitialValues}
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
        createDiscount(agreement.id, newValues);
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form autoComplete="off">
          <FormSection hasIntroduction>
            <DiscountInfo
              formValues={values}
              setFieldValue={setFieldValue}
              profile={profile}
            />
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
                aria-disabled={isSubmitting}
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

export default CreateDiscountForm;
