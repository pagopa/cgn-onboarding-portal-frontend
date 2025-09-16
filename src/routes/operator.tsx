import { useSelector } from "react-redux";
import { href, Navigate, Outlet, Route, Routes } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { RootState } from "../store/store";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { AgreementState } from "../api/generated";
import Layout from "../components/Layout/Layout";

export default function Component() {
  const authentication = useAuthentication();
  const { value: agreement } = useSelector(
    (state: RootState) => state.agreement
  );

  if (authentication.currentSession.type !== "user") {
    return <Navigate to={href("/login")} />;
  }

  if (!authentication.currentMerchantFiscalCode) {
    return (
      <Fragment>
        <Outlet />
        <Navigate to={href("/operator/select-company")} />
      </Fragment>
    );
  }

  return (
    <Layout>
      <Outlet />
      {(() => {
        switch (agreement.state) {
          case AgreementState.DraftAgreement: {
            return (
              <Routes>
                <Route path={href("/operator/create-profile")} />
                <Route
                  path="*"
                  element={<Navigate to={href("/operator/create-profile")} />}
                />
              </Routes>
            );
          }
          case AgreementState.RejectedAgreement: {
            return (
              <Routes>
                <Route path={href("/operator/create-profile")} />
                <Route path={href("/operator/rejected")} />
                <Route
                  path="*"
                  element={<Navigate to={href("/operator/rejected")} />}
                />
              </Routes>
            );
          }
        }
      })()}
    </Layout>
  );
}
