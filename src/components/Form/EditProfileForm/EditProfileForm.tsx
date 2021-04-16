import React from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import FormContainer from "../FormContainer";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import Api from "../../../api";
import { Button } from "design-react-kit";
import { Link } from "react-router-dom";
import { DASHBOARD } from "../../../navigation/routes";

const initialValues = {
  fullName: "PagoPA S.p.A.",
  hasDifferentFullName: false,
  name: "",
  pecAddress: "",
  taxCodeOrVat: "15376371009",
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
  fullName: Yup.string(),
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
  legalRepresentativeTaxCode: Yup.string().required(),
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

const EditProfileForm = () => {
  const agreementState = useSelector((state: any) => state.agreement.value);

  const createDiscount = (discount: any) => {
    console.log(discount);
    agreementState && Api.Profile.createProfile(agreementState.id, discount);
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
          createDiscount({ ...discount, salesChannel: salesChannel });
        } else {
          const newSalesChannel = discount.salesChannel;
          const {
            websiteUrl,
            discountCodeType,
            ...salesChannel
          } = newSalesChannel;
          createDiscount({ ...discount, salesChannel: salesChannel });
        }
      }}
    >
      {({ errors, touched, values, isValid }) => (
        <Form>
          <ProfileInfo errors={errors} touched={touched} formValues={values} />
          <ReferentData errors={errors} touched={touched}>
            <div className="mt-10">
              <Link
                to={DASHBOARD}
                className="px-14 mr-4 btn btn-outline-primary"
              >
                Indietro
              </Link>
              <Button
                className="px-14"
                color="primary"
                tag="button"
                type="submit"
              >
                Salva
              </Button>
            </div>
          </ReferentData>
        </Form>
      )}
    </Formik>
  );
};

export default EditProfileForm;
