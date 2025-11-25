import { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "design-react-kit";
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
import { useAuthentication } from "../../../authentication/AuthenticationContext";
import {
  profileFormValuesToRequest,
  profileToProfileFormValues
} from "../operatorDataUtils";
import { useStandardForm } from "../../../utils/useStandardForm";
import AsyncButton from "../../AsyncButton/AsyncButton";

type OperatorDataButtonsProps = {
  onBack(): void;
  isPending: boolean;
};

type Props = {
  variant: "edit-data" | "edit-profile";
};

function OperatorDataButtons({ isPending, onBack }: OperatorDataButtonsProps) {
  return (
    <div className="d-flex mt-10 gap-4 flex-wrap">
      <Button
        tag="button"
        className="px-14"
        outline
        color="primary"
        onClick={onBack}
      >
        Indietro
      </Button>
      <AsyncButton
        type="submit"
        className="px-14"
        color="primary"
        isPending={isPending}
      >
        Salva
      </AsyncButton>
    </div>
  );
}

export const EditOperatorForm = ({ variant }: Props) => {
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

  const isPending =
    editProfileMutation.isPending && form.formState.isSubmitting;

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
                    onBack={() => history.push(DASHBOARD)}
                    isPending={isPending}
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
                    onBack={() => history.push(DASHBOARD)}
                    isPending={isPending}
                  />
                </ReferentData>
              </Fragment>
            );
        }
      })()}
    </form>
  );
};
