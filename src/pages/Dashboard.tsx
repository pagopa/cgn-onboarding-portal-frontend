import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AgreementState as AgreementStateType } from "../api/generated";
import AgreementState from "../components/AgreementState/AgreementState";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import Introduction from "../components/Introduction/Introduction";
import Discounts from "../components/Discounts/Discounts";
import Profile from "../components/Profile/Profile";
import ProfileData from "../components/ProfileData/ProfileData";
import { RootState } from "../store/store";

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const agreement = useSelector((state: RootState) => state.agreement.value);

  function hasStateSection(state: any) {
    return (
      state === AgreementStateType.PendingAgreement ||
      state === AgreementStateType.ApprovedAgreement
    );
  }

  function handleClick(newTab: number) {
    setTab(newTab);
  }

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
      <Container className="mt-10 mb-20">
        <div className="col-7 offset-1">
          <Introduction
            name="Mario Rossi"
            handleClick={handleClick}
            activeTab={tab}
          />
          {selectedTab()}
        </div>
        {hasStateSection(AgreementStateType.ApprovedAgreement) && (
          <div className="col-3">
            <AgreementState
              state={AgreementStateType.ApprovedAgreement}
              startDate={agreement.startDate}
              endDate={agreement.endDate}
            />
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default Dashboard;
