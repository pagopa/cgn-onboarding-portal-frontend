import React, { useEffect } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createAgreement } from "../store/agreement/agreementSlice";
import { RootState } from "../store/store";
import Dashboard from "../pages/Dashboard";
import Help from "../pages/Help";
import CreateProfile from "../pages/CreateProfile";
import EditProfile from "../pages/EditProfile";
import CreateDiscount from "../pages/CreateDiscount";
import EditDiscount from "../pages/EditDiscount";
import AdminPanel from "../pages/AdminPanel";
import EditOperatorData from "../pages/EditOperatorData";
import RejectedProfile from "../pages/RejectedProfile";
import { AgreementState } from "../api/generated";
import CenteredLoading from "../components/CenteredLoading/CenteredLoading";
import CreateActivation from "../pages/CreateActivation";
import EditActivation from "../pages/EditActivation";
import {
  DASHBOARD,
  CREATE_PROFILE,
  EDIT_PROFILE,
  HELP,
  CREATE_DISCOUNT,
  EDIT_DISCOUNT,
  EDIT_OPERATOR_DATA,
  ADMIN_PANEL_RICHIESTE,
  ADMIN_PANEL_CONVENZIONATI,
  REJECT_PROFILE,
  ADMIN_PANEL_ACCESSI,
  ADMIN_PANEL_ACCESSI_EDIT,
  ADMIN_PANEL_ACCESSI_CREA
} from "./routes";

export const RouterConfig = ({ userType }: { user: any; userType: string }) => {
  const { value: agreement, loading } = useSelector(
    (state: RootState) => state.agreement
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = userType === "ADMIN";

  const adminRoutes = [
    ADMIN_PANEL_RICHIESTE,
    ADMIN_PANEL_CONVENZIONATI,
    ADMIN_PANEL_ACCESSI,
    ADMIN_PANEL_ACCESSI_EDIT,
    ADMIN_PANEL_ACCESSI_CREA
  ];

  useEffect(() => {
    if (!isAdmin) {
      dispatch(createAgreement());
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      switch (agreement.state) {
        case AgreementState.DraftAgreement:
          history.push(CREATE_PROFILE);
          break;
        case AgreementState.PendingAgreement:
        case AgreementState.ApprovedAgreement:
          if (location.pathname === "/") {
            history.push(DASHBOARD);
          }
          break;
        case AgreementState.RejectedAgreement:
          history.push(REJECT_PROFILE);
          break;
      }
    } else {
      history.push(
        adminRoutes.includes(location.pathname)
          ? location.pathname
          : ADMIN_PANEL_RICHIESTE
      );
    }
  }, [agreement.state]);

  if (isAdmin) {
    return (
      <Switch>
        <Route exact path={ADMIN_PANEL_RICHIESTE} component={AdminPanel} />
        <Route exact path={ADMIN_PANEL_CONVENZIONATI} component={AdminPanel} />
        <Route exact path={ADMIN_PANEL_ACCESSI} component={AdminPanel} />
        <Route
          exact
          path={ADMIN_PANEL_ACCESSI_EDIT}
          component={EditActivation}
        />
        <Route
          exact
          path={ADMIN_PANEL_ACCESSI_CREA}
          component={CreateActivation}
        />
      </Switch>
    );
  }

  return loading ? (
    <CenteredLoading />
  ) : (
    <Switch>
      <Route exact path={DASHBOARD} component={Dashboard} />
      <Route exact path={HELP} component={Help} />
      <Route exact path={CREATE_PROFILE} component={CreateProfile} />
      <Route exact path={EDIT_PROFILE} component={EditProfile} />
      <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
      <Route exact path={EDIT_DISCOUNT} component={EditDiscount} />
      <Route exact path={EDIT_OPERATOR_DATA} component={EditOperatorData} />
      <Route exact path={REJECT_PROFILE} component={RejectedProfile} />
    </Switch>
  );
};

export default RouterConfig;
