import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import { EmptyAddresses } from "../../../utils/form_types";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../../utils/strings";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { ProfileDataValidationSchema } from "../ValidationSchemas";
import { UpdateProfile } from "../../../api/generated";
import { useAuthentication } from "../../../authentication/AuthenticationContext";

// WARNING: this file is 90% duplicated with src/components/Form/CreateProfileForm/ProfileData/ProfileData.tsx
// any changes here should be reflected there as well

export const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  allNationalAddresses: false,
  addresses: [{ street: "", zipCode: "", city: "", district: "" }]
};

export const profileDefaultInitialValues = {
  fullName: "",
  hasDifferentFullName: false,
  name: "",
  name_en: "",
  name_de: "-",
  pecAddress: "",
  taxCodeOrVat: "",
  legalOffice: "",
  telephoneNumber: "",
  legalRepresentativeFullName: "",
  legalRepresentativeTaxCode: "",
  referent: {
    firstName: "",
    lastName: "",
    role: "",
    emailAddress: "",
    telephoneNumber: ""
  },
  secondaryReferents: [],
  description: "",
  description_en: "",
  description_de: "-",
  salesChannel: defaultSalesChannel
};

function getSalesChannel(salesChannel: any) {
  switch (salesChannel.channelType) {
    case "OnlineChannel":
      const { addresses, ...OnlineChannel } = salesChannel;
      return OnlineChannel;
    case "OfflineChannel":
      const { websiteUrl, discountCodeType, ...OfflineChannel } = salesChannel;
      return {
        ...OfflineChannel,
        addresses:
          EmptyAddresses.safeParse(OfflineChannel.addresses).success ||
          OfflineChannel.allNationalAddresses
            ? []
            : OfflineChannel.addresses.map((add: any) => ({
                fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                coordinates: add.coordinates
              }))
      };
    case "BothChannels":
      return {
        ...salesChannel,
        addresses:
          EmptyAddresses.safeParse(salesChannel.addresses).success ||
          salesChannel.allNationalAddresses
            ? []
            : salesChannel.addresses.map((add: any) => ({
                fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                coordinates: add.coordinates
              }))
      };
  }
}

export function sanitizeProfileFromValues(values: any) {
  const { hasDifferentFullName, ...profile } = values;
  const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
  return {
    ...profile,
    name: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name),
    name_en: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name_en),
    name_de: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name_de),
    description: withNormalizedSpaces(profile.description),
    description_en: withNormalizedSpaces(profile.description_en),
    description_de: withNormalizedSpaces(profile.description_de),
    salesChannel: getSalesChannel(profile.salesChannel)
  };
}

export const EditOperatorForm = ({
  variant
}: {
  variant: "edit-data" | "edit-profile";
}) => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);

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
              addresses: (profile.salesChannel as any).allNationalAddresses
                ? [
                    {
                      street: "",
                      city: "",
                      district: "",
                      zipCode: "",
                      value: "",
                      label: ""
                    }
                  ]
                : (profile.salesChannel as any).addresses.map(
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
            }
          : profile.salesChannel,
      hasDifferentFullName: !!profile.name
    };
  }, [profile]);

  const editProfileMutation =
    remoteData.Index.Profile.updateProfile.useMutation({
      onSuccess() {
        history.push(DASHBOARD);
      }
    });
  const editProfile = async (profile: UpdateProfile) => {
    editProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

  const authentication = useAuthentication();

  if (profileQuery.isLoading) {
    return <CenteredLoading />;
  }

  const entityType = agreement.entityType;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...initialValues,
        salesChannel: {
          ...defaultSalesChannel,
          ...initialValues.salesChannel
        },
        fullName: authentication.currentMerchant?.organization_name || "",
        taxCodeOrVat:
          authentication.currentMerchantFiscalCode ||
          authentication.currentUserFiscalCode ||
          ""
      }}
      validationSchema={ProfileDataValidationSchema}
      onSubmit={values => {
        const profileData = sanitizeProfileFromValues(values);
        void editProfile(profileData);
      }}
    >
      {() => {
        switch (variant) {
          case "edit-data":
            return (
              <Form autoComplete="off">
                <ProfileInfo entityType={entityType} />
                <ReferentData />
                <ProfileImage />
                <ProfileDescription />
                <SalesChannels entityType={entityType}>
                  <OperatorDataButtons
                    onBack={() => history.push(DASHBOARD)}
                    isEnabled={true}
                  />
                </SalesChannels>
              </Form>
            );
          case "edit-profile":
            return (
              <Form autoComplete="off">
                <ProfileInfo entityType={entityType} />
                <ReferentData>
                  <OperatorDataButtons
                    onBack={() => history.push(DASHBOARD)}
                    isEnabled={true}
                  />
                </ReferentData>
              </Form>
            );
        }
      }}
    </Formik>
  );
};

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
        Salva
      </Button>
    </div>
  );
}
