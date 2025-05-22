import { ReactNode } from "react";

const NavItem = ({
  children,
  active,
  onClick
}: {
  children: ReactNode | string;
  active: boolean;
  onClick: () => void;
}) => (
  <li className="nav-item">
    <a
      className={`nav-link ${active ? "active" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
    </a>
  </li>
);
export default NavItem;
