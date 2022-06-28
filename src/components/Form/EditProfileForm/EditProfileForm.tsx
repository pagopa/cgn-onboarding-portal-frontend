import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Api from "../../../api";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import { ProfileDataValidationSchema } from "../ValidationSchemas";

const EditProfileForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [currentProfile, setCurrentProfile] = useState<any>();

  const getProfile = (agreementId: string) =>
    pipe(
      TE.tryCatch(() => Api.Profile.getProfile(agreementId), toError),
      TE.map(response => response.data),
      TE.map(profile => setCurrentProfile(profile))
    )();

  useEffect(() => {
    void getProfile(agreement.id);
  }, []);

  const editProfile = (profile: any) =>
    pipe(
      TE.tryCatch(
        () => Api.Profile.updateProfile(agreement.id, profile),
        toError
      ),
      TE.map(response => response.data),
      TE.map(() => history.push(DASHBOARD))
    )();

  return (
    <>
      {currentProfile && (
        <Formik
          initialValues={currentProfile}
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
