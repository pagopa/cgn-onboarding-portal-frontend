import React, { ReactChildren } from "react";
import cx from "classnames";

const NavItem = ({
  children,
  active,
  onClick
}: {
  children: ReactChildren | string;
  active: boolean;
  onClick: () => void;
}) => (
  <li className="nav-item">
    <a
      className={cx("nav-link", active ? "active" : false)}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      {children}
    </a>
  </li>
);
export default NavItem;
