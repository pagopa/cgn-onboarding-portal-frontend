import { Form, Formik } from "formik";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import * as H from "history";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Api from "../../../api";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import { EmptyAddresses } from "../../../utils/form_types";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { ProfileDataValidationSchema } from "../ValidationSchemas";

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
    void pipe(
      TE.tryCatch(
        () => Api.Profile.updateProfile(agreement.id, discount),
        toError
      ),
      TE.map(() => history.push(DASHBOARD))
    )();
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

  const getProfile = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Profile.getProfile(agreementId), toError),
      TE.map(response => response.data),
      TE.mapLeft(() => setLoading(false)),
      TE.map((profile: any) => {
        setInitialValues({
          ...profile,
          salesChannel:
            profile.salesChannel.channelType === "OfflineChannel" ||
            profile.salesChannel.channelType === "BothChannels"
              ? {
                  ...profile.salesChannel,
                  addresses: profile.salesChannel.addresses.map(
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
      })
    )();

  const getGeolocationToken = (_: string) =>
    pipe(
      TE.tryCatch(() => Api.GeolocationToken.getGeolocationToken(), toError),
      TE.map(response => response.data),
      TE.map(token => setGeolocationToken(token.token))
    )();

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
