/* eslint-disable sonarjs/cognitive-complexity */
import { Form, Formik } from "formik";
import * as array from "fp-ts/lib/Array";
import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import Api from "../../../../api";
import { Profile } from "../../../../api/generated";
import { Severity, useTooltip } from "../../../../context/tooltip";
import { RootState } from "../../../../store/store";
import chainAxios from "../../../../utils/chainAxios";
import { EmptyAddresses } from "../../../../utils/form_types";
import {
  withNormalizedSpaces,
  clearIfReferenceIsBlank
} from "../../../../utils/strings";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import ProfileDescription from "./ProfileDescription";
import ProfileImage from "./ProfileImage";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import SalesChannels from "./SalesChannels";

// WARNING: this file is 90% duplicated with src/components/Form/EditOperatorDataForm/EditOperatorDataForm.tsx
// any changes here should be reflected there as well

const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  allNationalAddresses: false,
  addresses: [
    {
      street: "",
      zipCode: "",
      city: "",
      district: ""
    }
  ]
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
  const [initialValues, setInitialValues] = useState<any>(defaultInitialValues);
  const { triggerTooltip } = useTooltip();
  const [loading, setLoading] = useState(true);
  const [geolocationToken, setGeolocationToken] = useState<any>();
  const [existingProfile, setExistingProfile] = useState<Profile | undefined>();

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

  const createProfile = async (discount: any) =>
    await tryCatch(
      () => Api.Profile.createProfile(agreement.id, discount),
      toError
    )
      .chain(chainAxios)
      .fold(throwErrorTooltip, () => handleNext())
      .run();

  const updateProfile = async (discount: any) => {
    await tryCatch(
      () => Api.Profile.updateProfile(agreement.id, discount),
      toError
    )
      .chain(chainAxios)
      .fold(throwErrorTooltip, () => {
        onUpdate();
        handleNext();
      })
      .run();
  };

  const submitProfile = () => (isCompleted ? updateProfile : createProfile);

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
                    addresses: !array.isEmpty(
                      (profile.salesChannel as any).addresses
                    )
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
          });
          setLoading(false);
        }
      )
      .run();

  const getGeolocationToken = async () =>
    await tryCatch(() => Api.GeolocationToken.getGeolocationToken(), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        token => setGeolocationToken(token.token)
      )
      .run();

  useEffect(() => {
    if (isCompleted) {
      setLoading(true);
      void getProfile(agreement.id);
    } else {
      setLoading(false);
    }
    void getGeolocationToken();
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
          salesChannel: {
            ...OfflineChannel,
            addresses:
              EmptyAddresses.is(OfflineChannel.addresses) ||
              OfflineChannel.allNationalAddresses
                ? []
                : OfflineChannel.addresses.map((add: any) => ({
                    fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                    coordinates: add.coordinates
                  }))
          }
        };
      case "BothChannels":
        return {
          salesChannel: {
            ...salesChannel,
            addresses:
              EmptyAddresses.is(salesChannel.addresses) ||
              salesChannel.allNationalAddresses
                ? []
                : salesChannel.addresses.map((add: any) => ({
                    fullAddress: `${add.street}, ${add.city}, ${add.district}, ${add.zipCode}`,
                    coordinates: add.coordinates
                  }))
          }
        };
    }
  };
  const entityType = agreement.entityType;
  if (loading) {
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
        const { hasDifferentFullName, ...profile } = values;
        const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
        void submitProfile()({
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
          ...getSalesChannel(profile.salesChannel)
        });
      }}
    >
      {({ values, setFieldValue }) => (
        <Form autoComplete="off">
          <FormContainer className="mb-20">
            <ProfileInfo entityType={entityType} />
            <ReferentData entityType={entityType} />
            <ProfileImage />
            <ProfileDescription />
            <SalesChannels
              entityType={entityType}
              // geolocationToken={geolocationToken}
            >
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
