import { useState, type ReactElement } from "react";
import AgreementState from "../components/AgreementState/AgreementState";
import Layout from "../components/Layout/Layout";
import { ContainerFluid } from "../components/Container/Container";
import Introduction from "../components/Introduction/Introduction";
import Discounts from "../components/Discounts/Discounts";
import Profile from "../components/Profile/Profile";
import ProfileData from "../components/ProfileData/ProfileData";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { selectAgreement } from "../store/agreement/selectors";
import { useCgnSelector } from "../store/hooks";

export type DashboardTab = "profileData" | "discounts" | "profile";

const Dashboard = () => {
  const [tab, setTab] = useState<DashboardTab>("profileData");
  const agreement = useCgnSelector(selectAgreement);

  const authentication = useAuthentication();
  const user = authentication.currentUserSession;

  const handleClick = (newTab: DashboardTab) => {
    setTab(newTab);
  };

  const tabComponents: Record<DashboardTab, ReactElement> = {
    profileData: <ProfileData />,
    discounts: <Discounts />,
    profile: <Profile />
  };

  return (
    <Layout>
      <ContainerFluid className="mt-10 mb-20" maxWidth="972px">
        <div className="col-9">
          <Introduction
            name={user ? `${user.first_name} ${user.last_name}` : ""}
            handleClick={handleClick}
            activeTab={tab}
          />
          {tabComponents[tab]}
        </div>
        <div className="col-3 ">
          <AgreementState
            state={agreement.state}
            startDate={agreement.startDate}
          />
        </div>
      </ContainerFluid>
    </Layout>
  );
};

export default Dashboard;
