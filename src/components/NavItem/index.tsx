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
    <a className={cx("nav-item", active ? "active" : false)} onClick={onClick}>
      {children}
    </a>
  </li>
);
export default NavItem;
