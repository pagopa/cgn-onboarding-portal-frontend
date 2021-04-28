import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import IntroductionAdmin from "../components/Introduction/IntroductionAdmin";
import Requests from "../components/Requests/Requests";
import OperatorConvention from "../components/OperatorConvention/OperatorConvention";

const AdminPanel = () => {
  const [tab, setTab] = useState(0);

  function handleClick(newTab: number) {
    setTab(newTab);
  }

  function selectedTab() {
    switch (tab) {
      case 0:
        return <Requests />;
      case 1:
        return <OperatorConvention />;
      default:
        return <div>error</div>;
    }
  }

  return (
    <Layout>
      <Container className="mt-10 mb-20">
        <div className="col-12">
          <IntroductionAdmin
            name="Mario Rossi"
            handleClick={handleClick}
            activeTab={tab}
          />
          {selectedTab()}
        </div>
      </Container>
    </Layout>
  );
};

export default AdminPanel;
