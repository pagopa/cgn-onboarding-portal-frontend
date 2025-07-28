import { ReactNode } from "react";
import { NavLink, SafePathname } from "react-router";

const NavItem = ({
  to,
  children
}: {
  children: ReactNode | string;
  to: SafePathname;
}) => (
  <li className="nav-item">
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
      style={{ cursor: "pointer" }}
    >
      {children}
    </NavLink>
  </li>
);
export default NavItem;
