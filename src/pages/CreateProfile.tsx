import React from "react";
import Layout from "../components/Base/Layout";
import CreateProfileForm from "../components/Form/CreateProfileForm/CreateProfileForm";
import Breadcrumb from "../components/Base/Breadcrumb";

const CreateProfile = () => (
  <Layout>
    <div className="container mt-20 mb-64">
      <div className="row variable-gutters">
        <div className="col-10 offset-1">
          <Breadcrumb>Dati Operatore</Breadcrumb>
          <h1 className="mt-4 h3 font-weight-bold text-dark-blue">
            Dati operatore
          </h1>
          <CreateProfileForm />
        </div>
      </div>
    </div>
  </Layout>
);

export default CreateProfile;
