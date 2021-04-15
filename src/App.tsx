import React from "react";
import "./styles/bootstrap-italia-custom.scss";
import "typeface-titillium-web";
import { BrowserRouter } from "react-router-dom";
import RouterConfig from "./navigation/RouterConfig";

function App() {
  return (
    <BrowserRouter>
      <RouterConfig />
    </BrowserRouter>
  );
}

export default App;
