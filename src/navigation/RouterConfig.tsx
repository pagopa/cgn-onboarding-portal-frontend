import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
        <Route path="*" element={<Navigate to={LOGIN} replace />} />
      </Routes>
    );
  }
  if (authentication.currentSession.type === "admin") {
    return (
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
        <Route path={ADMIN_PANEL_RICHIESTE} element={<AdminPanel />} />
        <Route path={ADMIN_PANEL_CONVENZIONATI} element={<AdminPanel />} />
        <Route path={ADMIN_PANEL_ACCESSI} element={<AdminPanel />} />
        <Route path={ADMIN_PANEL_ACCESSI_EDIT} element={<EditActivation />} />
        <Route path={ADMIN_PANEL_ACCESSI_CREA} element={<CreateActivation />} />
        <Route
          path="*"
          element={<Navigate to={ADMIN_PANEL_RICHIESTE} replace />}
        />
      </Routes>
    );
  }
  if (!authentication.currentSession.merchantFiscalCode) {
    return (
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
        <Route path="*" element={<SelectCompany />} />
      </Routes>
    );
  }
  if (loading) {
    return <CenteredLoading />;
  }
  switch (agreement.state) {
    case AgreementState.DraftAgreement: {
      return (
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
          <Route path={CREATE_PROFILE} element={<CreateProfile />} />
          <Route path="*" element={<Navigate to={CREATE_PROFILE} replace />} />
        </Routes>
      );
    }
    case AgreementState.RejectedAgreement: {
      return (
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
          <Route path={CREATE_PROFILE} element={<CreateProfile />} />
          <Route path={REJECT_PROFILE} element={<RejectedProfile />} />
          <Route path="*" element={<Navigate to={REJECT_PROFILE} replace />} />
        </Routes>
      );
    }
    default: {
      return (
        <Routes>
          <Route path={LOGIN} element={<Login />} />
          <Route path={LOGIN_REDIRECT} element={<LoginRedirect />} />
          <Route path={DASHBOARD} element={<Dashboard />} />
          <Route path={EDIT_PROFILE} element={<EditProfile />} />
          <Route path={CREATE_DISCOUNT} element={<CreateDiscount />} />
          <Route path={EDIT_DISCOUNT} element={<EditDiscount />} />
          <Route path={EDIT_OPERATOR_DATA} element={<EditOperatorData />} />
          <Route path={REJECT_PROFILE} element={<RejectedProfile />} />
          <Route path="*" element={<Navigate to={DASHBOARD} replace />} />
        </Routes>
      );
    }
  }
};

export default RouterConfig;
