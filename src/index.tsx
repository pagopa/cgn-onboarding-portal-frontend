import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import it from "date-fns/locale/it";
import { TooltipProvider } from "./context/tooltip";
import App from "./App";
import { store } from "./store/store";
import { renderCSP } from "./utils/meta";

registerLocale("it", it);
setDefaultLocale("it");

renderCSP();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
