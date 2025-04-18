import React, { useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
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
import { useAuthentication } from "../authentication/AuthenticationContext";
import Login from "../pages/Login";
import SelectCompany from "../pages/SelectCompany";
import { LoginRedirect } from "../pages/LoginRedirect";
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
  ADMIN_PANEL_ACCESSI_CREA,
  LOGIN_REDIRECT,
  LOGIN
} from "./routes";

const RouterConfig = () => {
  const { value: agreement, loading } = useSelector(
    (state: RootState) => state.agreement
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const authentication = useAuthentication();

  const merchantFiscalCode = authentication.currentMerchantFiscalCode;

  useEffect(() => {
    if (merchantFiscalCode) {
      dispatch(createAgreement());
    }
  }, [dispatch, merchantFiscalCode]);

  if (location.pathname === LOGIN_REDIRECT) {
    return <LoginRedirect />;
  }

  if (!authentication.currentSession) {
    return <Login />;
  }
  if (authentication.currentSession.type === "admin") {
    return (
      <Switch>
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={HELP} component={Help} />
        <Route
          exact
          path={[
            ADMIN_PANEL_RICHIESTE,
            ADMIN_PANEL_CONVENZIONATI,
            ADMIN_PANEL_ACCESSI
          ]}
          component={AdminPanel}
        />
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
        <Route path="*">
          <Redirect to={ADMIN_PANEL_RICHIESTE} />
        </Route>
      </Switch>
    );
  }
  if (!authentication.currentSession.merchantFiscalCode) {
    return <SelectCompany />;
  }
  if (loading) {
    return <CenteredLoading />;
  }
  switch (agreement.state) {
    case AgreementState.DraftAgreement: {
      return (
        <Switch>
          <Route exact path={LOGIN} component={Login} />
          <Route exact path={HELP} component={Help} />
          <Route exact path={CREATE_PROFILE} component={CreateProfile} />
          <Route path="*">
            <Redirect to={CREATE_PROFILE} />
          </Route>
        </Switch>
      );
    }
    case AgreementState.RejectedAgreement: {
      return (
        <Switch>
          <Route exact path={LOGIN} component={Login} />
          <Route exact path={HELP} component={Help} />
          <Route exact path={CREATE_PROFILE} component={CreateProfile} />
          <Route exact path={REJECT_PROFILE} component={RejectedProfile} />
          <Route path="*">
            <Redirect to={REJECT_PROFILE} />
          </Route>
        </Switch>
      );
    }
    default: {
      return (
        <Switch>
          <Route exact path={LOGIN} component={Login} />
          <Route exact path={HELP} component={Help} />
          <Route exact path={DASHBOARD} component={Dashboard} />
          <Route exact path={CREATE_PROFILE} component={CreateProfile} />
          <Route exact path={EDIT_PROFILE} component={EditProfile} />
          <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
          <Route exact path={EDIT_DISCOUNT} component={EditDiscount} />
          <Route exact path={EDIT_OPERATOR_DATA} component={EditOperatorData} />
          <Route exact path={REJECT_PROFILE} component={RejectedProfile} />
          <Route path="*">
            <Redirect to={DASHBOARD} />
          </Route>
        </Switch>
      );
    }
  }
};

export default RouterConfig;
