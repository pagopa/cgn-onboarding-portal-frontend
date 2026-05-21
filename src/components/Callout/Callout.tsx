import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import { Box, Grid, Typography } from "@mui/material";

type CalloutType = "info" | "warning" | "danger";

type Props = {
  type: CalloutType;
  title: string;
  children?: React.ReactNode;
  body?: React.ReactNode;
};

const getIconByType = (type: CalloutType) => {
  switch (type) {
    case "danger":
      return <ErrorIcon sx={{ fill: "#D1344C" }} />;
    case "warning":
      return <WarningIcon sx={{ fill: "#EA7614" }} />;
    case "info":
    default:
      return <InfoIcon sx={{ fill: "#0073E6" }} />;
  }
};

const getColorByType = (type: CalloutType) => {
  switch (type) {
    case "danger":
      return "#D1344C";
    case "warning":
      return "#EA7614";
    case "info":
    default:
      return "#0073E6";
  }
};

const Callout = ({ title, body, type, children }: Props) => (
  <Box
    sx={{
      filter: "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))",
      position: "relative",
      borderRadius: "4px",
      border: "1px solid #FFFF",
      borderLeftWidth: "4px",
      borderLeftColor: getColorByType(type),
      padding: "16px",
      marginBottom: "1rem",
      backgroundColor: "white"
    }}
  >
    <Grid container spacing={1} sx={{ alignItems: "flex-start" }}>
      <Grid item xs="auto">
        {getIconByType(type)}
      </Grid>
      <Grid item xs>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, fontSize: "16px" }}
        >
          {title}
        </Typography>
        {body && (
          <Typography variant="body2" sx={{ color: "#5C6F82", mt: 0.5 }}>
            {body}
          </Typography>
        )}
      </Grid>
    </Grid>
    {children}
  </Box>
);

export default Callout;
