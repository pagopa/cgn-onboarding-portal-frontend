import {
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Container as MuiContainer
} from "@mui/material";
import Layout from "../components/Layout/Layout";
import CgnLogo from "../components/Logo/CgnLogo";
import {
  goToAdminLoginPage,
  goToUserLoginPage
} from "../authentication/authentication";

const MAINTENANCE_BANNER: undefined | "short-downtime" | "long-downtime" =
  undefined;

function Alert({ title }: { title: string }) {
  return (
    <Box
      sx={{
        borderLeft: "4px solid #FFCB46",
        backgroundColor: "#fffaec",
        borderRadius: "4px",
        display: "flex",
        padding: "16px",
        gap: "16px",
        alignItems: "center"
      }}
    >
      <Typography
        sx={{ fontSize: "16px", fontWeight: 400, lineHeight: "21px" }}
      >
        {title}
      </Typography>
    </Box>
  );
}

const Login = () => (
  <Layout>
    <MuiContainer maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      <Paper sx={{ px: 10, py: 14, backgroundColor: "white" }}>
        <Grid container spacing={2} sx={{ mb: 7 }}>
          <Grid item xs={12} sm={9}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#01254C", mb: 3 }}
            >
              Ti diamo il benvenuto sul Portale operatori Carta Giovani
              Nazionale
            </Typography>
            <Typography variant="body1" sx={{ color: "#5C6F82" }}>
              Il portale è il punto unico di richiesta e gestione delle
              convenzioni tra gli operatori che intendono aderire all’iniziativa
              e il Dipartimento per le Politiche Giovanili e il Servizio Civile
              Universale
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
        {MAINTENANCE_BANNER && (
          <Box sx={{ mt: 4 }}>
            {MAINTENANCE_BANNER === "short-downtime" && (
              <Alert title="Il portale è in manutenzione, tornerà operativo a breve" />
            )}
            {MAINTENANCE_BANNER === "long-downtime" && (
              <Alert title="Il portale è in manutenzione. Se riscontri qualche problema, riprova più tardi" />
            )}
          </Box>
        )}
        <Grid container spacing={4} sx={{ mt: 7 }}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h5" sx={{ color: "#01254C", mb: 2 }}>
              Sei un operatore?
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: "auto" }}
              onClick={() => {
                goToUserLoginPage();
              }}
            >
              Entra con SPID/CIE
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h5" sx={{ color: "#01254C", mb: 1 }}>
              Sei un amministratore?
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                color: "#01254C",
                textTransform: "uppercase",
                display: "block",
                mb: 2
              }}
            >
              Accedi con le tue credenziali
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: "auto" }}
              onClick={() => {
                goToAdminLoginPage();
              }}
            >
              Entra come Amministratore
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </MuiContainer>
  </Layout>
);

export default Login;
