import { Tabs, Tab, Box, Grid, Typography } from "@mui/material";
import {
  ADMIN_PANEL_ACCESSI,
  ADMIN_PANEL_CONVENZIONATI,
  ADMIN_PANEL_RICHIESTE
} from "../../navigation/routes";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  name: string;
  activeTab: string;
  handleClick(path: string): void;
};

const IntroductionAdmin = ({ name, activeTab, handleClick }: Props) => (
  <Box sx={{ backgroundColor: "white", textAlign: "start" }}>
    <Box sx={{ px: 4, pt: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={9}>
          <Typography
            variant="caption"
            sx={{ color: "#5C6F82", display: "block" }}
          >
            Carta Giovani Nazionale
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: "#01254C", fontWeight: "bold" }}
          >
            Portale Amministratori
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#01254C", textTransform: "capitalize", mt: 1 }}
          >
            {name}
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
    </Box>
    <Tabs
      value={[
        ADMIN_PANEL_RICHIESTE,
        ADMIN_PANEL_CONVENZIONATI,
        ADMIN_PANEL_ACCESSI
      ].indexOf(activeTab)}
      onChange={(_e, newIndex) =>
        handleClick(
          [
            ADMIN_PANEL_RICHIESTE,
            ADMIN_PANEL_CONVENZIONATI,
            ADMIN_PANEL_ACCESSI
          ][newIndex]
        )
      }
      sx={{ mt: 2 }}
    >
      <Tab label="Richieste" />
      <Tab label="Operatori Convenzionati" />
      <Tab label="Impostazioni di accesso" />
    </Tabs>
  </Box>
);

export default IntroductionAdmin;
