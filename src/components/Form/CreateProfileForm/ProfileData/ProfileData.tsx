import { Form, Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { remoteData } from "../../../../api/common";
import { CreateProfile, UpdateProfile } from "../../../../api/generated";
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
import { zodSchemaToFormikValidationSchema } from "../../../../utils/zodFormikAdapter";
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
          editProfile(variables.profile);
        } else {
          throwErrorTooltip();
        }
      },
      onSuccess() {
        handleNext();
      }
    });
  const createProfile = (profile: CreateProfile) => {
    createProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

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
  const editProfile = (profile: UpdateProfile) => {
    editProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

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

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={zodSchemaToFormikValidationSchema(
        ProfileDataValidationSchema
      )}
      onSubmit={values => {
        const profileData = profileFormValuesToRequest(values);
        if (isCompleted) {
          editProfile(profileData);
        } else {
          createProfile({ ...profileData, fullName });
        }
      }}
    >
      <Form autoComplete="off">
        <FormContainer className="mb-20">
          <ProfileInfo
            entityType={entityType}
            fullName={fullName}
            taxCodeOrVat={taxCodeOrVat}
          />
          <ReferentData />
          <ProfileImage />
          <ProfileDescription />
          <SalesChannels entityType={entityType}>
            <OperatorDataButtons
              onBack={handleBack}
              isEnabled={!!agreement.imageUrl}
            />
          </SalesChannels>
        </FormContainer>
      </Form>
    </Formik>
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
