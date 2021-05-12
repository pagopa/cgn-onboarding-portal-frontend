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
      .phone("IT", false, "Numero di telefono non valido")
      .required("Campo obbligatorio"),
    legalRepresentativeFullName: Yup.string()
      .matches(/^[a-zA-Z\s]*$/)
      .required(),
    legalRepresentativeTaxCode: Yup.string()
      .min(16, "Deve essere di 16 caratteri")
      .max(16, "Deve essere di 16 caratteri")
      .required("Campo obbligatorio"),
    referent: Yup.object().shape({
      firstName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/)
        .required("Campo obbligatorio"),
      lastName: Yup.string()
        .matches(/^[a-zA-Z\s]*$/)
        .required("Campo obbligatorio"),
      role: Yup.string()
        .matches(/^[a-zA-Z\s]*$/)
        .required("Campo obbligatorio"),
      emailAddress: Yup.string()
        .email("Deve essere una email")
        .required("Campo obbligatorio"),
      telephoneNumber: Yup.string()
        .phone("IT", false, "Numero di telefono non valido")
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
            zipCode: Yup.string()
              .matches(/^[0-9]*$/)
              .required("Campo obbligatorio"),
            city: Yup.string().required("Campo obbligatorio"),
            district: Yup.string().required("Campo obbligatorio")
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
          {({ values }) => (
            <Form autoComplete="off">
              <ProfileInfo formValues={values} />
              <ReferentData>
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
