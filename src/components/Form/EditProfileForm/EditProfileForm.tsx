import { Button } from "design-react-kit";
import { Form, Formik } from "formik";
import { toError } from "fp-ts/lib/Either";
import { tryCatch } from "fp-ts/lib/TaskEither";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Api from "../../../api";
import { Profile } from "../../../api/generated";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import {
  clearIfReferenceIsBlank,
  withNormalizedSpaces
} from "../../../utils/strings";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import { ProfileDataValidationSchema } from "../ValidationSchemas";

const EditProfileForm = () => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const [currentProfile, setCurrentProfile] = useState<any>();
  const [existingProfile, setExistingProfile] = useState<Profile>();

  const getProfile = async (agreementId: string) =>
    await tryCatch(() => Api.Profile.getProfile(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        profile => {
          setExistingProfile(profile);
          const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
          setCurrentProfile({
            ...profile,
            name: cleanedIfNameIsBlank(profile.name),
            name_en: cleanedIfNameIsBlank(profile.name_en),
            name_de: "-",
            description: withNormalizedSpaces(profile.description),
            description_en: withNormalizedSpaces(profile.description_en),
            description_de: "-",
            hasDifferentFullName: !!profile.name
          });
        }
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

  if (!currentProfile || !existingProfile?.entityType) {
    return null;
  }

  const entityType = existingProfile.entityType;

  return (
    <Formik
      initialValues={currentProfile}
      validationSchema={ProfileDataValidationSchema}
      onSubmit={values => {
        const { hasDifferentFullName, ...profile } = values;
        const cleanedIfNameIsBlank = clearIfReferenceIsBlank(profile.name);
        void editProfile({
          ...profile,
          name: !hasDifferentFullName ? "" : cleanedIfNameIsBlank(profile.name),
          name_en: !hasDifferentFullName
            ? ""
            : cleanedIfNameIsBlank(profile.name_en),
          name_de: !hasDifferentFullName
            ? ""
            : cleanedIfNameIsBlank(profile.name_de),
          description: withNormalizedSpaces(profile.description),
          description_en: withNormalizedSpaces(profile.description_en),
          description_de: withNormalizedSpaces(profile.description_de)
        });
      }}
    >
      {({ values }) => (
        <Form autoComplete="off">
          <ProfileInfo entityType={entityType} />
          <ReferentData entityType={entityType}>
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
