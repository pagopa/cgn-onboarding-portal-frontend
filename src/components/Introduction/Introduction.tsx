import { Tabs, Tab, Box, Grid, Typography } from "@mui/material";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  name: string;
  activeTab: number;
  handleClick(activeTab: number): void;
};

const Introduction = ({ name, activeTab, handleClick }: Props) => (
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
            Portale Operatori
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
      value={activeTab}
      onChange={(_e, newValue) => handleClick(newValue)}
      sx={{ mt: 2 }}
    >
      <Tab label="Profilo" />
      <Tab label="Opportunita" />
      <Tab label="Dati dell'ente" />
    </Tabs>
  </Box>
);

export default Introduction;
