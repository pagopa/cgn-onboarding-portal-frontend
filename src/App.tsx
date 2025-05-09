import { hot } from "react-hot-loader";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it";
import RouterConfig from "./navigation/RouterConfig";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import { queryClient } from "./api/common";
import { AuthenticationProvider } from "./authentication/AuthenticationContext";
import { TooltipProvider } from "./context/tooltip";
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

export default hot(module)(App);
