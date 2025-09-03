import "./utils/zod-csp-fix";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { it } from "date-fns/locale/it";
import RouterConfig from "./navigation/RouterConfig";
import "./styles/bootstrap-italia-fonts.scss";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker-custom.scss";
import "./styles/utils.scss";
import { queryClient } from "./api/common";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";
import { TooltipProvider } from "./context/TooltipProvider";
import { renderCSP } from "./utils/meta";
import { store } from "./store/store";

renderCSP();

registerLocale("it", it);
setDefaultLocale("it");

function App() {
  return (
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
