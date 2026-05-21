import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { it } from "date-fns/locale/it";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./api/common";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";
import { TooltipProvider } from "./context/TooltipProvider";
import RouterConfig from "./navigation/RouterConfig";
import { store } from "./store/store";
import "./styles/react-datepicker-custom.scss";
import "./styles/utils.scss";
import muiTheme from "./theme/muiTheme";
import { renderCSP } from "./utils/meta";
import "./utils/zod-csp-fix";

renderCSP();

registerLocale("it", it);
setDefaultLocale("it");

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <TooltipProvider>
            <QueryClientProvider client={queryClient}>
              <AuthenticationProvider>
                <RouterConfig />
              </AuthenticationProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;

// eslint-disable-next-line no-console
console.info(
  `%cVERSION %c${__APP_VERSION__}`,
  "font-weight: bold; color: lightblue;",
  "font-weight: normal;"
);

// eslint-disable-next-line no-console
console.info(
  `%cCOMMIT %c${__COMMIT_HASH__}`,
  "font-weight: bold; color: lightblue;",
  "font-weight: normal;"
);
