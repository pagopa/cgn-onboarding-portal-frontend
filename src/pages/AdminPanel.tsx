import React, { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import IntroductionAdmin from "../components/Introduction/IntroductionAdmin";
import Requests from "../components/Requests/Requests";
import OperatorConvention from "../components/OperatorConvention/OperatorConvention";
import { RootState } from "../store/store";

const AdminPanel = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const [tab, setTab] = useState(0);
  const user = data as any;

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
            name={user.name?.replace(".", " ")}
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
