import { ReactNode } from "react";
import { Box, Container as MuiContainer } from "@mui/material";

type Props = {
  children: ReactNode;
};

const Container = ({ children }: Props) => (
  <MuiContainer maxWidth={false} disableGutters sx={{ width: "100%" }}>
    <Box sx={{ width: "100%", mx: "auto" }}>{children}</Box>
  </MuiContainer>
);

export default Container;
