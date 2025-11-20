import { ReactNode } from "react";
import { SafePathname } from "react-router";
import Container from "../Container/Container";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  breadcrumbLabel: string;
  title: string;
  children: ReactNode;
  breadcrumbLink?: SafePathname;
};

const CreateLayout = ({
  breadcrumbLabel,
  title,
  children,
  breadcrumbLink
}: Props) => (
  <Container className="mt-20 mb-64">
    <div className="col-10 offset-1">
      <Breadcrumb breadcrumbLink={breadcrumbLink}>{breadcrumbLabel}</Breadcrumb>

      <div className="row">
        <div className="col-9">
          <h1 className="mt-4 h3 fw-bold text-dark-blue">{title}</h1>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <CgnLogo />
        </div>
      </div>
      {children}
    </div>
  </Container>
);

export default CreateLayout;
