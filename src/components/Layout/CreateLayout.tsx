import React from "react";
import Container from "../Container/Container";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Layout from "./Layout";

type Props = {
  breadcrumbLabel: string;
  title: string;
  children: any;
};

const CreateLayout = ({ breadcrumbLabel, title, children }: Props) => (
  <Layout>
    <Container className="mt-20 mb-64">
      <div className="col-10 offset-1">
        <Breadcrumb>{breadcrumbLabel}</Breadcrumb>
        <h1 className="mt-4 h3 font-weight-bold text-dark-blue">{title}</h1>
        {children}
      </div>
    </Container>
  </Layout>
);

export default CreateLayout;
