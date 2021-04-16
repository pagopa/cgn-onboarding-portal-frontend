import React from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import CreateProfileForm from "../components/Form/CreateProfileForm/CreateProfileForm";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";

const CreateProfile = () => (
  <Layout>
    <Container className="mt-20 mb-64">
      <div className="col-10 offset-1">
        <Breadcrumb>Dati operatore</Breadcrumb>
        <h1 className="mt-4 h3 font-weight-bold text-dark-blue">
          Dati operatore
        </h1>
        <CreateProfileForm />
      </div>
    </Container>
  </Layout>
);

export default CreateProfile;
