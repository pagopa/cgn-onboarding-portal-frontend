import React from "react";
import { NavLink } from "react-router-dom";
import { DASHBOARD } from "../../navigation/routes";

type Props = {
  children: string;
  breadcrumbLink?: string;
};

const Breadcrumb = ({ children, breadcrumbLink }: Props) => (
  <nav className="breadcrumb-container" aria-label="breadcrumb">
    <ol className="breadcrumb">
      <li className="breadcrumb-item no-underline">
        <NavLink to={breadcrumbLink ?? DASHBOARD}>Home</NavLink>
        <span className="separator">/</span>
      </li>
      <li className="breadcrumb-item active" aria-current="page">
        {children}
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;
