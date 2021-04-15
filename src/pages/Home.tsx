import React from "react";
import Layout from "../components/Base/Layout";
import Activities from "../components/Activities/Activities";
import Tutorial from "../components/Tutorial/Tutorial";
import Introduction from "../components/Introduction/Introduction";

const Home = () => (
  <Layout>
    <div className="container">
      <div className="row variable-gutters">
        <div className="mt-10 col-7 offset-1 mb-20">
          <Introduction name="Mario Rossi" />
          <Tutorial />
        </div>
        <div className="mt-10 col-3 mt-5">
          <Activities />
        </div>
      </div>
    </div>
  </Layout>
);

export default Home;
