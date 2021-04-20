import React from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import Activities from "../components/Activities/Activities";
import Tutorial from "../components/Tutorial/Tutorial";
import Profile from "../components/Profile/Profile";
import Introduction from "../components/Introduction/Introduction";

function Home() {
  return (
    <Layout>
      <Container className="mt-10 mb-20">
        <div className="col-7 offset-1">
          <Introduction name="Mario Rossi" />
          <Profile />
        </div>
        <div className="col-3">
          <Activities />
        </div>
      </Container>
    </Layout>
  );
}

export default Home;
