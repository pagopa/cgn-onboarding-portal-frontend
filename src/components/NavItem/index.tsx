import { ReactNode } from "react";
import { Button } from "@mui/material";

const NavItem = ({
  children,
  active,
  onClick
}: {
  children: ReactNode | string;
  active: boolean;
  onClick: () => void;
}) => (
  <li>
    <Button
      variant="text"
      color={active ? "primary" : "inherit"}
      sx={{ cursor: "pointer", fontWeight: active ? 700 : 400, minWidth: 0 }}
      onClick={onClick}
      type="button"
    >
      {children}
    </Button>
  </li>
);
export default NavItem;
