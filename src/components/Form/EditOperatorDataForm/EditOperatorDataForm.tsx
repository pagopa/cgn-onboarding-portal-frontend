import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { useHistory } from "react-router-dom";
import * as H from "history";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import Api from "../../../api";
import { RootState } from "../../../store/store";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { DASHBOARD } from "../../../navigation/routes";
import { ProfileDataValidationSchema } from "../ValidationSchemas";
import { EmptyAddresses } from "../../../utils/form_types";
import { Profile } from "../../../api/generated";

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

const updateProfile = (agreement: any, history: H.History) => async (
  discount: any
) => {
  if (agreement) {
    await tryCatch(
      () => Api.Profile.updateProfile(agreement.id, discount),
      toError
    )
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();
  }
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const EditOperatorDataForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const user = useSelector((state: RootState) => state.user.data);
  const [initialValues, setInitialValues] = useState<any>(defaultInitialValues);
  const [loading, setLoading] = useState(true);
  const [geolocationToken, setGeolocationToken] = useState<any>();
  const updateProfileHandler = updateProfile(agreement, history);

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        (profile: any) => {
          setInitialValues({
            ...profile,
            salesChannel:
              profile.salesChannel.channelType === "OfflineChannel" ||
              profile.salesChannel.channelType === "BothChannels"
                ? {
                    ...profile.salesChannel,
                    addresses: profile.salesChannel.allNationalAddresses
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
                      : profile.salesChannel.addresses.map((address: any) => {
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
                        })
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

  if (loading) {
    return <CenteredLoading />;
  }

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
        const { hasDifferentFullName, ...discount } = values;
        void updateProfileHandler({
          ...discount,
          salesChannel: { ...getSalesChannel(discount.salesChannel) }
        });
      }}
    >
      {({ values, setFieldValue }) => (
        <Form autoComplete="off">
          <ProfileInfo formValues={values} />
          <ReferentData />
          <ProfileImage />
          <ProfileDescription />
          <SalesChannels
            // geolocationToken={geolocationToken}
            setFieldValue={setFieldValue}
            handleBack={() => history.push(DASHBOARD)}
            formValues={values}
            isValid
          />
        </Form>
      )}
    </Formik>
  );
};

export default EditOperatorDataForm;
