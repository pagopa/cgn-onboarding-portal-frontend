import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "design-react-kit";
import { Link, useHistory } from "react-router-dom";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import Api from "../../../api";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";

const EditProfileForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [currentProfile, setCurrentProfile] = useState<any>();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        profile => setCurrentProfile(profile)
      )
      .run();

  useEffect(() => {
    void getProfile(agreement.id);
  }, []);

  const editProfile = (profile: any) => {
    if (agreement.id) {
      void Api.Profile.updateProfile(agreement.id, profile);
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
            <Form autoComplete="off">
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
