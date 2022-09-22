import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Api from "../../../api";
import { SupportType } from "../../../api/generated";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import { ProfileDataValidationSchema } from "../ValidationSchemas";

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

  const editProfile = async (profile: any) =>
    await tryCatch(
      () => Api.Profile.updateProfile(agreement.id, profile),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        () => history.push(DASHBOARD)
      )
      .run();

  return (
    <>
      {currentProfile && (
        <Formik
          initialValues={{
            ...currentProfile,
            supportType: SupportType.EmailAddress,
            supportValue: "-----"
          }}
          validationSchema={ProfileDataValidationSchema}
          onSubmit={values => {
            const { hasDifferentFullName, ...profile } = values;
            void editProfile(profile);
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
