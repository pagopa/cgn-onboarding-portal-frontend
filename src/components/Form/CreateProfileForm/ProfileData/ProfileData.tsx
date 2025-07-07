import { Form, Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { remoteData } from "../../../../api/common";
import { CreateProfile, UpdateProfile } from "../../../../api/generated";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import {
  withNormalizedSpaces,
  clearIfReferenceIsBlank
} from "../../../../utils/strings";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import {
  defaultSalesChannel,
  profileDefaultInitialValues,
  sanitizeProfileFromValues
} from "../../EditOperatorDataForm/operatorDataUtils";
import { useAuthentication } from "../../../../authentication/AuthenticationContext";
import { zodSchemaToFormikValidationSchema } from "../../../../utils/zodFormikAdapter";
import ProfileDescription from "./ProfileDescription";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import SalesChannels from "./SalesChannels";

// WARNING: this file is 90% duplicated with src/components/Form/EditOperatorDataForm/EditOperatorDataForm.tsx
// any changes here should be reflected there as well

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
  const initialValues = useMemo(() => {
    if (!profile) {
      return { ...profileDefaultInitialValues };
    }
    const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
    return {
      ...profile,
      name: cleanedIfNameIsBlank(profile.name),
      name_en: cleanedIfNameIsBlank(profile.name_en),
      name_de: "-",
      description: withNormalizedSpaces(profile.description),
      description_en: withNormalizedSpaces(profile.description_en),
      description_de: "-",
      salesChannel:
        profile.salesChannel.channelType === "OfflineChannel" ||
        profile.salesChannel.channelType === "BothChannels"
          ? {
              ...profile.salesChannel,
              addresses:
                (profile.salesChannel as any).addresses.length > 0
                  ? (profile.salesChannel as any).addresses.map(
                      (address: any) => {
                        const addressSplit = address.fullAddress
                          .split(",")
                          .map((item: string) => item.trim());
                        return {
                          street: addressSplit[0],
                          city: addressSplit[1],
                          district: addressSplit[2],
                          zipCode: addressSplit[3],
                          value: address.fullAddress,
                          label: address.fullAddress
                        };
                      }
                    )
                  : [
                      {
                        fullAddress: ""
                      }
                    ]
            }
          : profile.salesChannel,
      hasDifferentName: !!profile.name
    };
  }, [profile]);

  const entityType = agreement.entityType;

  const isPending = isCompleted && profileQuery.isPending;

  const authentication = useAuthentication();

  if (isPending) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues,
        salesChannel: {
          ...defaultSalesChannel,
          ...initialValues.salesChannel
        },
        fullName: authentication.currentMerchant?.organization_name ?? "",
        taxCodeOrVat:
          authentication.currentMerchantFiscalCode ??
          authentication.currentUserFiscalCode ??
          ""
      }}
      validationSchema={zodSchemaToFormikValidationSchema(
        ProfileDataValidationSchema
      )}
      onSubmit={values => {
        const profileData = sanitizeProfileFromValues(values);
        if (isCompleted) {
          editProfile(profileData);
        } else {
          createProfile(profileData);
        }
      }}
    >
      {() => (
        <Form autoComplete="off">
          <FormContainer className="mb-20">
            <ProfileInfo entityType={entityType} />
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
      )}
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
