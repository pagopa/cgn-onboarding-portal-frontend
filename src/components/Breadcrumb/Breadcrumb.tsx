import { href, NavLink, SafePathname } from "react-router";

type Props = {
  children: string;
  breadcrumbLink?: SafePathname;
};

const Breadcrumb = ({ children, breadcrumbLink }: Props) => (
  <nav className="breadcrumb-container" aria-label="breadcrumb">
    <ol className="breadcrumb">
      <li className="breadcrumb-item text-decoration-none">
        <NavLink to={breadcrumbLink ?? href("/")}>Home</NavLink>
        <span className="separator">/</span>
      </li>
      <li className="breadcrumb-item active" aria-current="page">
        {children}
      </li>
    </ol>
  </nav>
);

export default Breadcrumb;
