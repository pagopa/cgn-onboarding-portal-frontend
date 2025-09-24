import { useSelector } from "react-redux";
import { href, Navigate, Outlet, useMatch } from "react-router";
import isEqual from "lodash/isEqual";
import { RootState } from "../store/store";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { AgreementState } from "../api/generated";
import Layout from "../components/Layout/Layout";
import SelectCompany from "../pages/SelectCompany";
import CenteredLoading from "../components/CenteredLoading/CenteredLoading";

export default function Component() {
  const authentication = useAuthentication();
  const { value: agreement } = useSelector(
    (state: RootState) => state.agreement
  );

  const isCreateProfileRoute = useMatch(href("/operator/create-profile"));
  const isRejectedRoute = useMatch(href("/operator/rejected"));

  if (authentication.currentSession.type !== "user") {
    return <Navigate to={href("/login")} />;
  }

  if (!authentication.currentMerchantFiscalCode) {
    return (
      <Layout>
        {/* No <Outlet/> here since it was trying to render routes that need currentMerchantFiscalCode
          which was triggering automatic logout  */}
        <SelectCompany />
        <Navigate to={href("/operator/select-company")} />
      </Layout>
    );
  }

  if (isEqual(agreement, {})) {
    return <CenteredLoading />;
  }

  return (
    <Layout>
      <Outlet />
      {(() => {
        switch (agreement.state) {
          case AgreementState.DraftAgreement: {
            return <Navigate to={href("/operator/create-profile")} />;
          }
          case AgreementState.RejectedAgreement: {
            return (
              !(isRejectedRoute || isCreateProfileRoute) && (
                <Navigate to={href("/operator/rejected")} />
              )
            );
          }
        }
      })()}
    </Layout>
  );
}
