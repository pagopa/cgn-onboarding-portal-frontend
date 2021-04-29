import React from "react";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createAgreement } from "./store/agreement/agreementSlice";
import CenteredLoading from "./components/CenteredLoading";
import RouterConfig from "./navigation/RouterConfig";
import Login from "./pages/Login";
import { getCookie } from "./utils/cookie";

function App() {
  const { value, loading } = useSelector((state: any) => state.agreement);
  const token = getCookie();
  const dispatch = useDispatch();

  if (!token) {
    return <Login />;
  }

  if (!value.id && !loading) {
    dispatch(createAgreement());
  }

  return loading ? (
    <CenteredLoading />
  ) : (
    <BrowserRouter>
      <RouterConfig state={value.state} />
    </BrowserRouter>
  );
}

export default App;
