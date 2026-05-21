import { useState } from "react";
import { Grid, Container as MuiContainer } from "@mui/material";
import { AgreementState as AgreementStateType } from "../api/generated";
import AgreementState from "../components/AgreementState/AgreementState";
import Layout from "../components/Layout/Layout";
import Introduction from "../components/Introduction/Introduction";
import Discounts from "../components/Discounts/Discounts";
import Profile from "../components/Profile/Profile";
import ProfileData from "../components/ProfileData/ProfileData";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { selectAgreement } from "../store/agreement/selectors";
import { useCgnSelector } from "../store/hooks";

const Dashboard = () => {
  const [tab, setTab] = useState(0);
  const agreement = useCgnSelector(selectAgreement);

  const authentication = useAuthentication();
  const user = authentication.currentUserSession;

  function hasStateSection(state: AgreementStateType) {
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
      <MuiContainer maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={9}>
            <Introduction
              name={user ? `${user.first_name} ${user.last_name}` : ""}
              handleClick={handleClick}
              activeTab={tab}
            />
            {selectedTab()}
          </Grid>
          {hasStateSection(AgreementStateType.ApprovedAgreement) && (
            <Grid item xs={12} sm={3}>
              <AgreementState
                state={agreement.state}
                startDate={agreement.startDate}
              />
            </Grid>
          )}
        </Grid>
      </MuiContainer>
    </Layout>
  );
};

export default Dashboard;
