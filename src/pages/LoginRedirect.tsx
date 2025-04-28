import React from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";

export function LoginRedirect() {
  return (
    <Layout>
      <Container>
        <div className="col-12 bg-white my-20 p-10 d-flex flex-column align-items-center">
          <h1 className="h2 font-weight-bold text-dark-blue">Login in corso</h1>
        </div>
      </Container>
    </Layout>
  );
}
