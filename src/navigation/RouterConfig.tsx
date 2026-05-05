import { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AgreementState } from "../api/generated";
import { useAuthentication } from "../authentication/AuthenticationContext";
import CenteredLoading from "../components/CenteredLoading/CenteredLoading";
import AdminPanel from "../pages/AdminPanel";
import CreateActivation from "../pages/CreateActivation";
import CreateDiscount from "../pages/CreateDiscount";
import CreateProfile from "../pages/CreateProfile";
import Dashboard from "../pages/Dashboard";
import EditActivation from "../pages/EditActivation";
import EditDiscount from "../pages/EditDiscount";
import EditOperatorData from "../pages/EditOperatorData";
import EditProfile from "../pages/EditProfile";
import Login from "../pages/Login";
import { LoginRedirect } from "../pages/LoginRedirect";
import RejectedProfile from "../pages/RejectedProfile";
import SelectCompany from "../pages/SelectCompany";
import { createAgreement } from "../store/agreement/agreementSlice";
import { useCgnDispatch, useCgnSelector } from "../store/hooks";
import { RootState } from "../store/store";
import {
  ADMIN_PANEL_ACCESSI,
  ADMIN_PANEL_ACCESSI_CREA,
  ADMIN_PANEL_ACCESSI_EDIT,
  ADMIN_PANEL_CONVENZIONATI,
  ADMIN_PANEL_RICHIESTE,
  CREATE_DISCOUNT,
  CREATE_PROFILE,
  DASHBOARD,
  EDIT_DISCOUNT,
  EDIT_OPERATOR_DATA,
  EDIT_PROFILE,
  LOGIN,
  LOGIN_REDIRECT,
  REJECT_PROFILE
} from "./routes";

const RouterConfig = () => {
  const { value: agreement, loading } = useCgnSelector(
    (state: RootState) => state.agreement
  );
  const dispatch = useCgnDispatch();
  const authentication = useAuthentication();

  const merchantFiscalCode = authentication.currentMerchantFiscalCode;

  useEffect(() => {
    if (merchantFiscalCode) {
      void dispatch(createAgreement());
    }
  }, [dispatch, merchantFiscalCode]);

  if (authentication.currentSession.type === "none") {
    return (
      <Switch>
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
        <Route path="*">
          <Redirect to={LOGIN} />
        </Route>
      </Switch>
    );
  }
  if (authentication.currentSession.type === "admin") {
    return (
      <Switch>
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
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
    return (
      <Switch>
        <Route exact path={LOGIN} component={Login} />
        <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
        <Route path="*" component={SelectCompany} />
      </Switch>
    );
  }
  if (loading) {
    return <CenteredLoading />;
  }
  switch (agreement.state) {
    case AgreementState.DraftAgreement: {
      return (
        <Switch>
          <Route exact path={LOGIN} component={Login} />
          <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
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
          <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
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
          <Route exact path={LOGIN_REDIRECT} component={LoginRedirect} />
          <Route exact path={DASHBOARD} component={Dashboard} />
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
