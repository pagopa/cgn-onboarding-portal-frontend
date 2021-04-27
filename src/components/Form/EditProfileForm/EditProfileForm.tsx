import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import Api from "../../../api";
import { Button } from "design-react-kit";
import { Link, useHistory } from "react-router-dom";
import { DASHBOARD } from "../../../navigation/routes";

const EditProfileForm = () => {
  const history = useHistory();
  const agreementState = useSelector((state: any) => state.agreement.value);
  const [currentProfile, setCurrentProfile] = useState<any>();

  useEffect(() => {
    const getProfile = async (agreementId: string) => {
      const response = await Api.Profile.getProfile(agreementId);
      void setCurrentProfile(response.data);
    };

    void getProfile(agreementState.id);
  }, []);

  const editProfile = (profile: any) => {
    agreementState && Api.Profile.updateProfile(agreementState.id, profile);
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

  return (
    <>
      {currentProfile && (
        <Formik
          initialValues={currentProfile}
          validationSchema={validationSchema}
          onSubmit={values => {
            const { hasDifferentFullName, ...profile } = values;
            editProfile(profile);
            history.push(DASHBOARD);
          }}
        >
          {({ errors, touched, values }) => (
            <Form>
              <ProfileInfo
                errors={errors}
                touched={touched}
                formValues={values}
              />
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
      )}
    </>
  );
};

export default EditProfileForm;
