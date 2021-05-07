import React, { useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
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
import { AgreementState } from "../api/generated";
import CenteredLoading from "../components/CenteredLoading/CenteredLoading";
import {
  DASHBOARD,
  CREATE_PROFILE,
  EDIT_PROFILE,
  HELP,
  CREATE_DISCOUNT,
  EDIT_DISCOUNT,
  EDIT_OPERATOR_DATA,
  ADMIN_PANEL
} from "./routes";

export const RouterConfig = ({
  userType
}: {
  userType: string;
}) => {
  const { value: agreement, loading } = useSelector(
    (state: RootState) => state.agreement
  );
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userType !== "ADMIN") {
      dispatch(createAgreement());
    }
  }, []);

  useEffect(() => {
    if (userType !== "ADMIN") {
      switch (agreement.state) {
        case AgreementState.DraftAgreement:
          history.push(CREATE_PROFILE);
          break;
        case AgreementState.PendingAgreement:
        case AgreementState.ApprovedAgreement:
        case AgreementState.RejectedAgreement:
          history.push(DASHBOARD);
          break;
      }
    } else {
      history.push(ADMIN_PANEL);
    }
  }, [agreement.state]);

  return loading ? (
    <CenteredLoading />
  ) : (
    <Switch>
      {userType === "USER" && (
        <>
          <Route exact path={DASHBOARD} component={Dashboard} />
          <Route exact path={HELP} component={Help} />
          <Route exact path={CREATE_PROFILE} component={CreateProfile} />
          <Route exact path={EDIT_PROFILE} component={EditProfile} />
          <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
          <Route exact path={EDIT_DISCOUNT} component={EditDiscount} />
          <Route exact path={EDIT_OPERATOR_DATA} component={EditOperatorData} />
        </>
      )}
      {userType === "ADMIN" && (
        <Route exact path={ADMIN_PANEL} component={AdminPanel} />
      )}
    </Switch>
  );
};

export default RouterConfig;
