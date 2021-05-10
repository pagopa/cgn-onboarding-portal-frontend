import React from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormContainer from "../../FormContainer";
import Api from "../../../../api";
import { RootState } from "../../../../store/store";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import ProfileImage from "./ProfileImage";
import ProfileDescription from "./ProfileDescription";
import SalesChannels from "./SalesChannels";

// TODO riempire gli initial values con i dati dello user
const initialValues = {
  fullName: "PagoPA S.p.A.",
  hasDifferentFullName: false,
  name: "",
  pecAddress: "",
  taxCodeOrVat: "1537637100912345",
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
  salesChannel: {
    channelType: "",
    websiteUrl: "",
    discountCodeType: "",
    addresses: [{ street: "", zipCode: "", city: "", district: "" }]
  }
};

const validationSchema = Yup.object().shape({
  hasDifferentName: Yup.boolean(),
  name: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required()
  }),
  pecAddress: Yup.string()
    .email()
    .required(),
  legalOffice: Yup.string().required(),
  telephoneNumber: Yup.string()
    .max(15)
    .required(),
  legalRepresentativeFullName: Yup.string().required(),
  legalRepresentativeTaxCode: Yup.string()
    .min(16)
    .max(16)
    .required(),
  referent: Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    role: Yup.string().required(),
    emailAddress: Yup.string()
      .email()
      .required(),
    telephoneNumber: Yup.string()
      .max(15)
      .required()
  }),
  description: Yup.string().required(),
  salesChannel: Yup.object().shape({
    channelType: Yup.mixed().oneOf([
      "OnlineChannel",
      "OfflineChannel",
      "BothChannels"
    ]),
    websiteUrl: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required()
    }),
    discountCodeType: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required()
    }),
    addresses: Yup.array().when("channelType", {
      is: "OfflineChannel" || "BothChannels",
      then: Yup.array().of(
        Yup.object().shape({
          street: Yup.string().required(),
          zipCode: Yup.string().required(),
          city: Yup.string().required(),
          district: Yup.string().required()
        })
      )
    })
  })
});

type Props = {
  handleBack: any;
  handleNext: any;
  handleSuccess: any;
};

const ProfileData = ({ handleBack, handleNext, handleSuccess }: Props) => {
  const agreementState = useSelector(
    (state: RootState) => state.agreement.value
  );

  const createProfile = (discount: any) => {
    if (agreementState) {
      void Api.Profile.createProfile(agreementState.id, discount);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const { hasDifferentFullName, ...discount } = values;

        if (discount.salesChannel.channelType === "OnlineChannel") {
          const newSalesChannel = discount.salesChannel;
          const { addresses, ...salesChannel } = newSalesChannel;
          createProfile({ ...discount, salesChannel });
        } else {
          const newSalesChannel = discount.salesChannel;
          const {
            websiteUrl,
            discountCodeType,
            ...salesChannel
          } = newSalesChannel;
          createProfile({ ...discount, salesChannel });
        }

        handleSuccess();
        handleNext();
      }}
    >
      {({ errors, touched, values, isValid, dirty }) => (
        <Form autoComplete="off">
          <FormContainer className="mb-20">
            <ProfileInfo
              errors={errors}
              touched={touched}
              formValues={values}
            />
            <ReferentData errors={errors} touched={touched} />
            <ProfileImage />
            <ProfileDescription
              errors={errors}
              touched={touched}
              formValues={values}
            />
            <SalesChannels
              handleBack={handleBack}
              formValues={values}
              isValid={isValid}
              dirty={dirty}
            />
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileData;
