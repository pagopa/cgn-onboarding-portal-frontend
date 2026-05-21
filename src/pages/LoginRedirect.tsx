import {
  Box,
  Typography,
  Container as MuiContainer,
  CircularProgress
} from "@mui/material";
import Layout from "../components/Layout/Layout";

export function LoginRedirect() {
  return (
    <Layout>
      <MuiContainer maxWidth="md" sx={{ mt: 10, mb: 10 }}>
        <Box
          sx={{
            backgroundColor: "white",
            p: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#01254C", mb: 3 }}
          >
            Login in corso
          </Typography>
          <CircularProgress />
        </Box>
      </MuiContainer>
    </Layout>
  );
}
