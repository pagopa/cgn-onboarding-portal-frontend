import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0273E6"
    },
    secondary: {
      main: "#01254C"
    },
    error: {
      main: "#CC334D"
    },
    warning: {
      main: "#EA7614"
    },
    info: {
      main: "#0073E6"
    },
    background: {
      default: "#E6E9F2",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#17324D",
      secondary: "#5C6F82"
    }
  },
  typography: {
    fontFamily: 'Titillium Web, "Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: "100%"
        },
        body: {
          height: "100%",
          backgroundColor: "#E6E9F2",
          color: "#17324D"
        },
        "#root": {
          minHeight: "100%"
        },
        a: {
          color: "#0273E6"
        }
      }
    }
  }
});

export default muiTheme;
