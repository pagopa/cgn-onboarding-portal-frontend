import React from "react";
import CreateLayout from "../components/Layout/CreateLayout";
import HelpForm from "../components/Form/HelpForm/HelpForm";

const Help = () => (
  <CreateLayout breadcrumbLabel="Serve aiuto?" title="Serve aiuto?">
    <HelpForm />
  </CreateLayout>
);

export default Help;
