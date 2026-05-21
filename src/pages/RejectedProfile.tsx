import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Container as MuiContainer,
  Paper,
  Button
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import DocumentFail from "../assets/icons/document_fail.svg?react";
import { CREATE_PROFILE } from "../navigation/routes";
import CgnLogo from "../components/Logo/CgnLogo";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { selectAgreement } from "../store/agreement/selectors";
import { useCgnSelector } from "../store/hooks";

const RejectedProfile = () => {
  const agreement = useCgnSelector(selectAgreement);
  const navigate = useNavigate();
  const authentication = useAuthentication();
  return (
    <Layout>
      <Box sx={{ backgroundColor: "white" }}>
        <MuiContainer maxWidth="lg" sx={{ py: 5 }}>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={9}>
              <Typography
                variant="caption"
                sx={{ color: "#5C6F82", display: "block", mb: 1 }}
              >
                Carta Giovani Nazionale
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#01254C" }}
              >
                Portale Operatori
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
        </MuiContainer>
        <Paper
          sx={{
            p: 10,
            m: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#01254C", mb: 2 }}
          >
            Richiesta di convenzione rifiutata
          </Typography>
          <DocumentFail />
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 4, textAlign: "center" }}
          >
            Ci dispiace ma la sua richiesta di convenzione è stata rifiutata dal
            Dipartimento, di seguito le note in merito:
          </Typography>
          <Paper
            sx={{ p: 2, mb: 4, backgroundColor: "#F5F5F5", maxWidth: "100%" }}
          >
            <Typography variant="body2">{agreement.reasonMessage}</Typography>
          </Paper>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                authentication.logout(authentication.currentSession);
              }}
              sx={{ width: "175px" }}
            >
              Esci
            </Button>
            <Button
              color="primary"
              onClick={() => navigate(CREATE_PROFILE)}
              sx={{ width: "175px" }}
            >
              Modifica dati
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default RejectedProfile;
