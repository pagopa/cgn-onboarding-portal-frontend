import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CreateProfile from "../pages/CreateProfile";
import EditProfile from "../pages/EditProfile";
import Help from "../pages/Help";
import { AgreementState } from "../api/generated";
import Login from "../pages/Login";
import CreateDiscount from "../pages/CreateDiscount";
import AdminPanel from "../pages/AdminPanel";

import {
    ROOT,
    DASHBOARD,
    CREATE_PROFILE,
    EDIT_PROFILE,
    HELP,
    CREATE_DISCOUNT, ADMIN_PANEL
} from "./routes";

export const RouterConfig = ({ state }: any) => {
  const history = useHistory();

  // useEffect(() => {
  //   switch (state) {
  //     case AgreementState.DraftAgreement:
  //       history.push(CREATE_PROFILE);
  //       break;
  //     case AgreementState.PendingAgreement:
  //     case AgreementState.ApprovedAgreement:
  //     case AgreementState.RejectedAgreement:
  //       history.push(DASHBOARD);
  //       break;
  //   }
  // }, [state]);

  return (
    <Switch>
      <Route exact path={ROOT} component={Login} />
      <Route exact path={DASHBOARD} component={Dashboard} />
      <Route exact path={CREATE_PROFILE} component={CreateProfile} />
      <Route exact path={EDIT_PROFILE} component={EditProfile} />
      <Route exact path={HELP} component={Help} />
      <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
      <Route exact path={ADMIN_PANEL} component={AdminPanel} />
    </Switch>
  );
};

export default RouterConfig;
