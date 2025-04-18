import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AgreementState as AgreementStateType } from "../api/generated";
import AgreementState from "../components/AgreementState/AgreementState";
import Layout from "../components/Layout/Layout";
import { ContainerFluid } from "../components/Container/Container";
import Introduction from "../components/Introduction/Introduction";
import Discounts from "../components/Discounts/Discounts";
import Profile from "../components/Profile/Profile";
import ProfileData from "../components/ProfileData/ProfileData";
import { RootState } from "../store/store";
import { useAuthentication } from "../authentication/AuthenticationContext";

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const agreement = useSelector((state: RootState) => state.agreement.value);

  const authentication = useAuthentication();
  const user = authentication.currentUserSession;

  function hasStateSection(state: any) {
    return (
      state === AgreementStateType.PendingAgreement ||
      state === AgreementStateType.ApprovedAgreement
    );
  }

  const handleClick = (newTab: number) => {
    setTab(newTab);
  };

  function selectedTab() {
    switch (tab) {
      case 0:
        return <ProfileData />;
      case 1:
        return <Discounts />;
      case 2:
        return <Profile />;
      default:
        <div>error</div>;
    }
  }

  return (
    <Layout>
      <ContainerFluid className="mt-10 mb-20" maxWidth="972px">
        <div className="col-9">
          <Introduction
            name={user ? `${user.first_name} ${user.last_name}` : ""}
            handleClick={handleClick}
            activeTab={tab}
          />
          {selectedTab()}
        </div>
        {hasStateSection(AgreementStateType.ApprovedAgreement) && (
          <div className="col-3 ">
            <AgreementState
              state={agreement.state}
              startDate={agreement.startDate}
              endDate={agreement.endDate}
            />
          </div>
        )}
      </ContainerFluid>
    </Layout>
  );
};

export default Dashboard;
