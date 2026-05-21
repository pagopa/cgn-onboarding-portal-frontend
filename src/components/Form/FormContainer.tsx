import { ReactNode } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import Container from "../Container/Container";

type Props = {
  sx?: SxProps<Theme>;
  children: ReactNode;
};

const FormContainer = ({ sx, children }: Props) => (
  <Container>
    <Box sx={{ width: "100%", maxWidth: "83.3333%", mx: "auto", ...sx }}>
      {children}
    </Box>
  </Container>
);

export default FormContainer;
