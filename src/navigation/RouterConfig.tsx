import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Help from "../pages/Help";
import CreateProfile from "../pages/CreateProfile";
import EditProfile from "../pages/EditProfile";
import CreateDiscount from "../pages/CreateDiscount";
import EditDiscount from "../pages/EditDiscount";
import AdminPanel from "../pages/AdminPanel";

import { AgreementState } from "../api/generated";
import {
  ROOT,
  DASHBOARD,
  CREATE_PROFILE,
  EDIT_PROFILE,
  HELP,
  CREATE_DISCOUNT,
  EDIT_DISCOUNT,
  ADMIN_PANEL
} from "./routes";

type Props = {
  state: any;
};

export const RouterConfig = ({ state }: Props) => {
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
      <Route exact path={HELP} component={Help} />
      <Route exact path={CREATE_PROFILE} component={CreateProfile} />
      <Route exact path={EDIT_PROFILE} component={EditProfile} />
      <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
      <Route exact path={EDIT_DISCOUNT} component={EditDiscount} />
      <Route exact path={ADMIN_PANEL} component={AdminPanel} />
    </Switch>
  );
};

export default RouterConfig;
