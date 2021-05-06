import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { TooltipProvider } from "./context/tooltip";
import App from "./App";
import { store } from "./store/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("app")
);
