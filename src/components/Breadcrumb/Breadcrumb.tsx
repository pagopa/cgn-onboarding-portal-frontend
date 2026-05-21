import { NavLink } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import { DASHBOARD } from "../../navigation/routes";

type Props = {
  children: string;
  breadcrumbLink?: string;
};

const Breadcrumb = ({ children, breadcrumbLink }: Props) => (
  <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
    <NavLink
      to={breadcrumbLink ?? DASHBOARD}
      style={{ textDecoration: "none", color: "#0073E6" }}
    >
      Home
    </NavLink>
    <Typography sx={{ color: "text.primary" }}>{children}</Typography>
  </Breadcrumbs>
);

export default Breadcrumb;
