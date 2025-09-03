import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { remoteData } from "../../../../api/common";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import {
  profileFormValuesToRequest,
  profileToProfileFormValues
} from "../../operatorDataUtils";
import { useAuthentication } from "../../../../authentication/AuthenticationContext";
import { useStandardForm } from "../../../../utils/useStandardForm";
import ProfileDescription from "./ProfileDescription";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import SalesChannels from "./SalesChannels";

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
  onUpdate: () => void;
};

const ProfileData = ({
  isCompleted,
  handleBack,
  handleNext,
  onUpdate
}: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text: "Errore durante la creazione del profilo, controllare i dati e riprovare"
    });
  };

  const createProfileMutation =
    remoteData.Index.Profile.createProfile.useMutation({
      async onError(error, variables) {
        if (
          error.status === 400 &&
          error.response?.data ===
            "PROFILE_ALREADY_EXISTS_FOR_AGREEMENT_PROVIDED"
        ) {
          await editProfileMutation.mutateAsync({
            agreementId: agreement.id,
            profile: variables.profile
          });
        } else {
          throwErrorTooltip();
        }
      },
      onSuccess() {
        handleNext();
      }
    });

  const editProfileMutation =
    remoteData.Index.Profile.updateProfile.useMutation({
      onError() {
        throwErrorTooltip();
      },
      onSuccess() {
        onUpdate();
        handleNext();
      }
    });

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery(
    {
      agreementId: agreement.id
    },
    {
      enabled: isCompleted
    }
  );
  const profile = profileQuery.data;
  const initialValues = useMemo(
    () => profileToProfileFormValues(profile),
    [profile]
  );

  const entityType = agreement.entityType;

  const isPending = isCompleted && profileQuery.isPending;

  const authentication = useAuthentication();

  const fullName = authentication.currentMerchant?.organization_name ?? "";
  const taxCodeOrVat =
    authentication.currentMerchantFiscalCode ??
    authentication.currentUserFiscalCode ??
    "";

  const form = useStandardForm({
    values: initialValues,
    zodSchema: ProfileDataValidationSchema
  });

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(async values => {
        const profileData = profileFormValuesToRequest(values);
        if (isCompleted) {
          await editProfileMutation.mutateAsync({
            agreementId: agreement.id,
            profile: profileData
          });
        } else {
          await createProfileMutation.mutateAsync({
            agreementId: agreement.id,
            profile: { ...profileData, fullName, taxCodeOrVat }
          });
        }
      })}
    >
      <FormContainer className="mb-20">
        <ProfileInfo
          formLens={form.lens}
          entityType={entityType}
          fullName={fullName}
          taxCodeOrVat={taxCodeOrVat}
        />
        <ReferentData formLens={form.lens} />
        <ProfileImage />
        <ProfileDescription formLens={form.lens} />
        <SalesChannels
          formLens={form.lens.focus("salesChannel")}
          entityType={entityType}
        >
          <OperatorDataButtons
            onBack={handleBack}
            isEnabled={
              !!agreement.imageUrl &&
              !editProfileMutation.isPending &&
              !createProfileMutation.isPending &&
              !form.formState.isSubmitting
            }
          />
        </SalesChannels>
      </FormContainer>
    </form>
  );
};

export default ProfileData;

function OperatorDataButtons({
  isEnabled,
  onBack
}: {
  onBack(): void;
  isEnabled: boolean;
}) {
  return (
    <div className="d-flex mt-10 gap-4 flex-wrap">
      <Button
        className="px-14"
        outline
        color="primary"
        tag="button"
        onClick={onBack}
      >
        Indietro
      </Button>
      <Button
        type="submit"
        className="px-14"
        color="primary"
        tag="button"
        disabled={!isEnabled}
      >
        Continua
      </Button>
    </div>
  );
}
