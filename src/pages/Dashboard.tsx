import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { AgreementState as AgreementStateType } from "../api/generated";
import AgreementState from "../components/AgreementState/AgreementState";
import Layout from "../components/Layout/Layout";
import { ContainerFluid } from "../components/Container/Container";
import Introduction from "../components/Introduction/Introduction";
import { RootState } from "../store/store";
import { useAuthentication } from "../authentication/AuthenticationContext";

const Dashboard = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const authentication = useAuthentication();
  const user = authentication.currentUserSession;

  function hasStateSection(state: AgreementStateType) {
    return (
      state === AgreementStateType.PendingAgreement ||
      state === AgreementStateType.ApprovedAgreement
    );
  }

  return (
    <Layout>
      <ContainerFluid className="mt-10 mb-20" maxWidth="972px">
        <div className="col-9">
          <Introduction
            name={user ? `${user.first_name} ${user.last_name}` : ""}
          />
          <Outlet />
        </div>
        {hasStateSection(AgreementStateType.ApprovedAgreement) && (
          <div className="col-3 ">
            <AgreementState
              state={agreement.state}
              startDate={agreement.startDate}
            />
          </div>
        )}
      </ContainerFluid>
    </Layout>
  );
};

export default Dashboard;
