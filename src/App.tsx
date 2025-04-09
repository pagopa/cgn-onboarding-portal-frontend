import { hot } from "react-hot-loader";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import RouterConfig from "./navigation/RouterConfig";
import Login from "./pages/Login";
import SelectCompany from "./pages/SelectCompany";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import { queryClient } from "./api/common";
import {
  AuthenticationConsumer,
  AuthenticationProvider
} from "./authentication/authentication";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticationProvider>
        <AuthenticationConsumer>
          {({ currentSession }) => {
            if (currentSession === null) {
              return <Login />;
            }
            if (
              currentSession.type === "user" &&
              !currentSession.merchantFiscalCode
            ) {
              return <SelectCompany />;
            }
            return <RouterConfig />;
          }}
        </AuthenticationConsumer>
      </AuthenticationProvider>
    </QueryClientProvider>
  );
}

export default hot(module)(App);
