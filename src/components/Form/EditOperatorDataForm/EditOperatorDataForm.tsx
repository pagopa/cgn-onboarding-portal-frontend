import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { useHistory } from "react-router-dom";
import { remoteData } from "../../../api/common";
import { DASHBOARD } from "../../../navigation/routes";
import { RootState } from "../../../store/store";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { ProfileDataValidationSchema } from "../ValidationSchemas";
import { UpdateProfile } from "../../../api/generated";
import { useAuthentication } from "../../../authentication/AuthenticationContext";
import { zodSchemaToFormikValidationSchema } from "../../../utils/zodFormikAdapter";
import {
  profileFormValuesToRequest,
  profileToProfileFormValues
} from "../operatorDataUtils";

// WARNING: this file is 90% duplicated with src/components/Form/CreateProfileForm/ProfileData/ProfileData.tsx
// any changes here should be reflected there as well

export const EditOperatorForm = ({
  variant
}: {
  variant: "edit-data" | "edit-profile";
}) => {
  const history = useHistory();
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const profileQuery = remoteData.Index.Profile.getProfile.useQuery({
    agreementId: agreement.id
  });
  const profile = profileQuery.data;
  const initialValues = useMemo(
    () => profileToProfileFormValues(profile),
    [profile]
  );

  const editProfileMutation =
    remoteData.Index.Profile.updateProfile.useMutation({
      onSuccess() {
        history.push(DASHBOARD);
      }
    });
  const editProfile = (profile: UpdateProfile) => {
    editProfileMutation.mutate({ agreementId: agreement.id, profile });
  };

  const authentication = useAuthentication();

  if (profileQuery.isPending) {
    return <CenteredLoading />;
  }

  const entityType = agreement.entityType;

  const fullName = authentication.currentMerchant?.organization_name ?? "";
  const taxCodeOrVat =
    authentication.currentMerchantFiscalCode ??
    authentication.currentUserFiscalCode ??
    "";

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={zodSchemaToFormikValidationSchema(
        ProfileDataValidationSchema
      )}
      onSubmit={values => {
        const profileData = profileFormValuesToRequest(values);
        editProfile(profileData);
      }}
    >
      {() => {
        switch (variant) {
          case "edit-data":
            return (
              <Form autoComplete="off">
                <ProfileInfo
                  entityType={entityType}
                  fullName={fullName}
                  taxCodeOrVat={taxCodeOrVat}
                />
                <ReferentData />
                <ProfileImage />
                <ProfileDescription />
                <SalesChannels entityType={entityType}>
                  <OperatorDataButtons
                    onBack={() => history.push(DASHBOARD)}
                    isEnabled={true}
                  />
                </SalesChannels>
              </Form>
            );
          case "edit-profile":
            return (
              <Form autoComplete="off">
                <ProfileInfo
                  entityType={entityType}
                  fullName={fullName}
                  taxCodeOrVat={taxCodeOrVat}
                />
                <ReferentData>
                  <OperatorDataButtons
                    onBack={() => history.push(DASHBOARD)}
                    isEnabled={true}
                  />
                </ReferentData>
              </Form>
            );
        }
      }}
    </Formik>
  );
};

function OperatorDataButtons({
  isEnabled,
  onBack
}: {
  onBack(): void;
  isEnabled: boolean;
}) {
  return (
    <div className="d-flex mt-10 gap-4 flex-wrap">
      <Button
        className="px-14"
        outline
        color="primary"
        tag="button"
        onClick={onBack}
      >
        Indietro
      </Button>
      <Button
        type="submit"
        className="px-14"
        color="primary"
        tag="button"
        disabled={!isEnabled}
      >
        Salva
      </Button>
    </div>
  );
}
