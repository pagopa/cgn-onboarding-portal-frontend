import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { href, useNavigate } from "react-router";
import { remoteData } from "../../../api/common";
import { RootState } from "../../../store/store";
import CenteredLoading from "../../CenteredLoading/CenteredLoading";
import ProfileDescription from "../CreateProfileForm/ProfileData/ProfileDescription";
import ProfileImage from "../CreateProfileForm/ProfileData/ProfileImage";
import ProfileInfo from "../CreateProfileForm/ProfileData/ProfileInfo";
import ReferentData from "../CreateProfileForm/ProfileData/ReferentData";
import SalesChannels from "../CreateProfileForm/ProfileData/SalesChannels";
import { ProfileDataValidationSchema } from "../ValidationSchemas";
import { useAuthentication } from "../../../authentication/AuthenticationContext";
import {
  profileFormValuesToRequest,
  profileToProfileFormValues
} from "../operatorDataUtils";
import { useStandardForm } from "../../../utils/useStandardForm";

export const EditOperatorForm = ({
  variant
}: {
  variant: "edit-data" | "edit-profile";
}) => {
  const navigate = useNavigate();
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
        navigate(href("/operator/dashboard/profile"));
      }
    });

  const authentication = useAuthentication();

  const form = useStandardForm({
    values: initialValues,
    zodSchema: ProfileDataValidationSchema
  });

  if (profileQuery.isPending) {
    return <CenteredLoading />;
  }

  const entityType = agreement.entityType;

  const fullName = authentication.currentMerchant?.organization_name ?? "";
  const taxCodeOrVat =
    authentication.currentMerchantFiscalCode ??
    authentication.currentUserFiscalCode ??
    "";

  const isSubmitEnabled =
    !editProfileMutation.isPending && !form.formState.isSubmitting;

  return (
    <form
      autoComplete="off"
      onSubmit={form.handleSubmit(async values => {
        const profileData = profileFormValuesToRequest(values);
        await editProfileMutation.mutateAsync({
          agreementId: agreement.id,
          profile: profileData
        });
      })}
    >
      {(() => {
        switch (variant) {
          case "edit-data":
            return (
              <Fragment>
                <ProfileInfo
                  formLens={form.lens}
                  entityType={entityType}
                  fullName={fullName}
                  taxCodeOrVat={taxCodeOrVat}
                />
                <ReferentData formLens={form.lens} />
                <ProfileImage />
                <ProfileDescription formLens={form.lens} />
                <SalesChannels
                  formLens={form.lens.focus("salesChannel")}
                  entityType={entityType}
                >
                  <OperatorDataButtons
                    onBack={() => {
                      navigate(href("/operator/dashboard/profile"));
                    }}
                    isEnabled={isSubmitEnabled}
                  />
                </SalesChannels>
              </Fragment>
            );
          case "edit-profile":
            return (
              <Fragment>
                <ProfileInfo
                  formLens={form.lens}
                  entityType={entityType}
                  fullName={fullName}
                  taxCodeOrVat={taxCodeOrVat}
                />
                <ReferentData formLens={form.lens}>
                  <OperatorDataButtons
                    onBack={() => {
                      navigate(href("/operator/dashboard/profile"));
                    }}
                    isEnabled={isSubmitEnabled}
                  />
                </ReferentData>
              </Fragment>
            );
        }
      })()}
    </form>
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
