import { Form, Formik } from "formik";
import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import * as H from "history";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import Api from "../../../api";
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
import { Profile } from "../../../api/generated";

// WARNING: this file is 90% duplicated with src/components/Form/CreateProfileForm/ProfileData/ProfileData.tsx
// any changes here should be reflected there as well

const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  allNationalAddresses: false,
  addresses: [{ street: "", zipCode: "", city: "", district: "" }]
};

const defaultInitialValues = {
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditOperatorForm = (variant: "edit-data" | "edit-profile") => () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const user = useSelector((state: RootState) => state.user.data);
  const [initialValues, setInitialValues] = useState<any>(defaultInitialValues);
  const [loading, setLoading] = useState(true);
  const [geolocationToken, setGeolocationToken] = useState<any>();
  const [existingProfile, setExistingProfile] = useState<Profile | undefined>();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        (profile: Profile) => {
          setExistingProfile(profile);
          const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
          setInitialValues({
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
                    addresses: (profile.salesChannel as any)
                      .allNationalAddresses
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
          });
          setLoading(false);
        }
      )
      .run();

  const getGeolocationToken = async (_: string) =>
    await tryCatch(() => Api.GeolocationToken.getGeolocationToken(), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        token => setGeolocationToken(token.token)
      )
      .run();

  useEffect(() => {
    setLoading(true);
    void getProfile(agreement.id);
    void getGeolocationToken(agreement.id);
  }, []);

  const getSalesChannel = (salesChannel: any) => {
    switch (salesChannel.channelType) {
      case "OnlineChannel":
        const { addresses, ...OnlineChannel } = salesChannel;
        return OnlineChannel;
      case "OfflineChannel":
        const {
          websiteUrl,
          discountCodeType,
          ...OfflineChannel
        } = salesChannel;
        return {
          ...OfflineChannel,
          addresses:
            EmptyAddresses.is(OfflineChannel.addresses) ||
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
            EmptyAddresses.is(salesChannel.addresses) ||
            salesChannel.allNationalAddresses
              ? []
              : salesChannel.addresses.map((add: any) => ({
                  fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                  coordinates: add.coordinates
                }))
        };
    }
  };

  const editProfile = async (profile: any) =>
    await tryCatch(
      () => Api.Profile.updateProfile(agreement.id, profile),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();

  if (loading) {
    return <CenteredLoading />;
  }
  const entityType = agreement.entityType;

  return (
    <Formik
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
        const { hasDifferentFullName, ...profile } = values;
        const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
        void editProfile({
          ...profile,
          name: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name),
          name_en: !hasDifferentFullName
            ? ""
            : cleanedIfNameIsBlank(profile.name_en),
          name_de: !hasDifferentFullName
            ? ""
            : cleanedIfNameIsBlank(profile.name_de),
          description: withNormalizedSpaces(profile.description),
          description_en: withNormalizedSpaces(profile.description_en),
          description_de: withNormalizedSpaces(profile.description_de),
          salesChannel: { ...getSalesChannel(profile.salesChannel) }
        });
      }}
    >
      {({ values, setFieldValue }) => {
        switch (variant) {
          case "edit-data":
            return (
              <Form autoComplete="off">
                <ProfileInfo entityType={entityType} />
                <ReferentData entityType={entityType} />
                <ProfileImage />
                <ProfileDescription />
                <SalesChannels
                  entityType={entityType}
                  // geolocationToken={geolocationToken}
                >
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
                <ReferentData entityType={entityType}>
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

export const EditOperatorDataForm = EditOperatorForm("edit-data");
export const EditProfileForm = EditOperatorForm("edit-profile");

export function OperatorDataButtons({
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
