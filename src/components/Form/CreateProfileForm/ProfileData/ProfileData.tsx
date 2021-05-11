import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import CenteredLoading from "../../../CenteredLoading/CenteredLoading";
import FormContainer from "../../FormContainer";
import Api from "../../../../api";
import { RootState } from "../../../../store/store";
import ProfileInfo from "./ProfileInfo";
import ReferentData from "./ReferentData";
import ProfileImage from "./ProfileImage";
import ProfileDescription from "./ProfileDescription";
import SalesChannels from "./SalesChannels";

const validationSchema = Yup.object().shape({
  hasDifferentName: Yup.boolean(),
  name: Yup.string().when(["hasDifferentName"], {
    is: true,
    then: Yup.string().required("Campo obbligatorio")
  }),
  pecAddress: Yup.string()
    .email("Deve essere una email")
    .required("Campo obbligatorio"),
  legalOffice: Yup.string().required("Campo obbligatorio"),
  telephoneNumber: Yup.string()
    .max(15, "Massimo 15 caratteri")
    .required("Campo obbligatorio"),
  legalRepresentativeFullName: Yup.string().required(),
  legalRepresentativeTaxCode: Yup.string()
    .min(16, "Deve essere di 16 caratteri")
    .max(16, "Deve essere di 16 caratteri")
    .required("Campo obbligatorio"),
  referent: Yup.object().shape({
    firstName: Yup.string().required("Campo obbligatorio"),
    lastName: Yup.string().required("Campo obbligatorio"),
    role: Yup.string().required("Campo obbligatorio"),
    emailAddress: Yup.string()
      .email("Deve essere una email")
      .required("Campo obbligatorio"),
    telephoneNumber: Yup.string()
      .max(15, "Massimo 15 caratteri")
      .required("Campo obbligatorio")
  }),
  description: Yup.string().required("Campo obbligatorio"),
  salesChannel: Yup.object().shape({
    channelType: Yup.mixed().oneOf([
      "OnlineChannel",
      "OfflineChannel",
      "BothChannels"
    ]),
    websiteUrl: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required("Campo obbligatorio")
    }),
    discountCodeType: Yup.string().when("channelType", {
      is: "OnlineChannel" || "BothChannels",
      then: Yup.string().required("Campo obbligatorio")
    }),
    addresses: Yup.array().when("channelType", {
      is: "OfflineChannel" || "BothChannels",
      then: Yup.array().of(
        Yup.object().shape({
          street: Yup.string().required("Campo obbligatorio"),
          zipCode: Yup.string().required("Campo obbligatorio"),
          city: Yup.string().required("Campo obbligatorio"),
          district: Yup.string().required("Campo obbligatorio")
        })
      )
    })
  })
});

type Props = {
  isCompleted: boolean;
  handleBack: () => void;
  handleNext: () => void;
};

const ProfileData = ({ isCompleted, handleBack, handleNext }: Props) => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [initialValues, setInitialValues] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const createProfile = (discount: any) => {
    if (agreement) {
      void Api.Profile.createProfile(agreement.id, discount);
    }
  };

  const updateProfile = (discount: any) => {
    if (agreement) {
      void Api.Profile.updateProfile(agreement.id, discount);
    }
  };

  const submitProfile = () => (isCompleted ? updateProfile : createProfile);

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => setLoading(false),
        profile => {
          setInitialValues({
            ...profile,
            hasDifferentFullName: !!profile.name
          });
          setLoading(false);
        }
      )
      .run();

  useEffect(() => {
    if (isCompleted) {
      setLoading(true);
      void getProfile(agreement.id);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => {
        const { hasDifferentFullName, ...discount } = values;
        if (discount.salesChannel?.channelType === "OnlineChannel") {
          const newSalesChannel = discount.salesChannel;
          const { addresses, ...salesChannel } = newSalesChannel;
          submitProfile()({ ...discount, salesChannel });
        } else {
          const newSalesChannel = discount.salesChannel;
          const {
            websiteUrl,
            discountCodeType,
            ...salesChannel
          } = newSalesChannel;
          submitProfile()({ ...discount, salesChannel });
        }
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
