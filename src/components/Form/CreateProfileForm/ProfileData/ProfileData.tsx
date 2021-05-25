/* eslint-disable sonarjs/cognitive-complexity */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import Api from "../../../../api";
import { RootState } from "../../../../store/store";
import chainAxios from "../../../../utils/chainAxios";
import { ProfileDataValidationSchema } from "../../ValidationSchemas";
import { useTooltip, Severity } from "../../../../context/tooltip";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import ProfileImage from "./ProfileImage";
import ProfileDescription from "./ProfileDescription";
import SalesChannels from "./SalesChannels";

const defaultSalesChannel = {
  channelType: "",
  websiteUrl: "",
  discountCodeType: "",
  addresses: [{ fullAddress: "", coordinates: { latitude: "", longitude: "" } }]
};

const defaultInitialValues = {
  fullName: "",
  hasDifferentFullName: false,
  name: "",
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
  description: "",
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
        (profile: any) => {
          setInitialValues({
            ...profile,
            salesChannel:
              profile.salesChannel.channelType === "OfflineChannel"
                ? {
                    ...profile.salesChannel,
                    addresses: profile.salesChannel.addresses.map(
                      (address: any) => ({
                        ...address,
                        value: address.fullAddress,
                        label: address.fullAddress
                      })
                    )
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
        return OfflineChannel;
      case "BothChannels":
        return salesChannel;
    }
  };

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
        const { hasDifferentFullName, ...discount } = values;
        void submitProfile()({
          ...discount,
          ...getSalesChannel(discount.salesChannel)
        });
      }}
    >
      {({ values, setFieldValue }) => (
        <Form autoComplete="off">
          <FormContainer className="mb-20">
            <ProfileInfo formValues={values} />
            <ReferentData />
            <ProfileImage />
            <ProfileDescription />
            <SalesChannels
              geolocationToken={geolocationToken}
              handleBack={handleBack}
              formValues={values}
              isValid={!!agreement.imageUrl}
              setFieldValue={setFieldValue}
            />
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileData;
