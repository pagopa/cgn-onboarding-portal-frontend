import { ReactNode } from "react";
import {
  Box,
  Grid,
  Typography,
  Container as MuiContainer
} from "@mui/material";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import CgnLogo from "../Logo/CgnLogo";
import Layout from "./Layout";

type Props = {
  breadcrumbLabel: string;
  title: string;
  children: ReactNode;
  breadcrumbLink?: string;
};

const CreateLayout = ({
  breadcrumbLabel,
  title,
  children,
  breadcrumbLink
}: Props) => (
  <Layout>
    <MuiContainer maxWidth="lg" sx={{ mt: 10, mb: 32 }}>
      <Box sx={{ maxWidth: "83.33%", mx: "auto" }}>
        <Breadcrumb breadcrumbLink={breadcrumbLink}>
          {breadcrumbLabel}
        </Breadcrumb>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={9}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#01254C", mt: 2 }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" }
            }}
          >
            <CgnLogo />
          </Grid>
        </Grid>
        {children}
      </Box>
    </MuiContainer>
  </Layout>
);

export default CreateLayout;
