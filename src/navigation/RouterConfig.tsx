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
import SelectCompany from "../pages/SelectCompany";
import { AgreementState } from "../api/generated";
import CenteredLoading from "../components/CenteredLoading/CenteredLoading";
import { getCompanyCookie } from "../utils/cookie";
import {
  DASHBOARD,
  CREATE_PROFILE,
  EDIT_PROFILE,
  HELP,
  CREATE_DISCOUNT,
  EDIT_DISCOUNT,
  EDIT_OPERATOR_DATA,
  ADMIN_PANEL,
  SELECT_COMPANY
} from "./routes";

export const RouterConfig = ({
  user,
  userType
}: {
  user: any;
  userType: string;
}) => {
  const { value: agreement, loading } = useSelector(
    (state: RootState) => state.agreement
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const companyCookie = getCompanyCookie();
  const isAdmin = userType === "ADMIN";

  useEffect(() => {
    if (!companyCookie && user.iss) {
      history.push(SELECT_COMPANY);
    } else if (!isAdmin) {
      companyCookie(companyCookie);
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
      {!isAdmin && (
        <>
          <Route exact path={SELECT_COMPANY} component={SelectCompany} />
          <Route exact path={DASHBOARD} component={Dashboard} />
          <Route exact path={HELP} component={Help} />
          <Route exact path={CREATE_PROFILE} component={CreateProfile} />
          <Route exact path={EDIT_PROFILE} component={EditProfile} />
          <Route exact path={CREATE_DISCOUNT} component={CreateDiscount} />
          <Route exact path={EDIT_DISCOUNT} component={EditDiscount} />
          <Route exact path={EDIT_OPERATOR_DATA} component={EditOperatorData} />
        </>
      )}
      {isAdmin && <Route exact path={ADMIN_PANEL} component={AdminPanel} />}
    </Switch>
  );
};

export default RouterConfig;
