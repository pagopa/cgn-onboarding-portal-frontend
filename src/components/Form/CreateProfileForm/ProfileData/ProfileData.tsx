/* eslint-disable sonarjs/cognitive-complexity */
import { Form, Formik } from "formik";
import * as array from "fp-ts/lib/Array";
import React, { useEffect, useMemo, useState } from "react";
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
} from "../../EditOperatorDataForm/EditOperatorDataForm";
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
  const user = useSelector((state: RootState) => state.user.data);
  const { triggerTooltip } = useTooltip();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const throwErrorTooltip = () => {
    triggerTooltip({
      severity: Severity.DANGER,
      text:
        "Errore durante la creazione del profilo, controllare i dati e riprovare"
    });
  };

  const createProfileMutation = remoteData.Index.Profile.createProfile.useMutation(
    {
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
    }
  );
  const createProfile = (profile: CreateProfile) => {
    createProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

  const editProfileMutation = remoteData.Index.Profile.updateProfile.useMutation(
    {
      onError() {
        throwErrorTooltip();
      },
      onSuccess() {
        onUpdate();
        handleNext();
      }
    }
  );
  const editProfile = (profile: UpdateProfile) => {
    editProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
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
              addresses: !array.isEmpty((profile.salesChannel as any).addresses)
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
      hasDifferentFullName: !!profile.name
    };
  }, [profile]);

  const entityType = agreement.entityType;

  if (profileQuery.isLoading) {
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
        fullName: user.company?.organization_name || "",
        taxCodeOrVat:
          user.company?.organization_fiscal_code || user.fiscal_number || ""
      }}
      validationSchema={ProfileDataValidationSchema}
      onSubmit={values => {
        const profileData = sanitizeProfileFromValues(values);
        if (isCompleted) {
          void editProfile(profileData);
        } else {
          void createProfile(profileData);
        }
      }}
    >
      {() => (
        <Form autoComplete="off">
          <FormContainer className="mb-20">
            <ProfileInfo entityType={entityType} />
            <ReferentData entityType={entityType} />
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
    <div className="mt-10">
      <Button
        className="px-14 mr-4"
        outline
        color="primary"
        tag="button"
        onClick={onBack}
      >
        Indietro
      </Button>
      <Button
        type="submit"
        className="px-14 mr-4"
        color="primary"
        tag="button"
        disabled={!isEnabled}
      >
        Continua
      </Button>
    </div>
  );
}
