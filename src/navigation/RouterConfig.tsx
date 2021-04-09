import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateProfile from "../pages/CreateProfile";
import { ROOT, CREATE_PROFILE } from "./routes";

export const RouterConfig = () => (
  <Switch>
    <Route exact path={ROOT} component={Home} />
    <Route exact path={CREATE_PROFILE} component={CreateProfile} />
  </Switch>
);

export default RouterConfig;
