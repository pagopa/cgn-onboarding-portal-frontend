import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCookie } from "./utils/cookie";
import { createAgreement } from "./store/agreement/agreementSlice";
import CenteredLoading from "./components/CenteredLoading/CenteredLoading";
import RouterConfig from "./navigation/RouterConfig";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import Login from "./pages/Login";
import { RootState } from "./store/store";

function App() {
  const { value, loading } = useSelector((state: RootState) => state.agreement);
  const token = getCookie();
  const dispatch = useDispatch();

  if (!token) {
    return <Login />;
  }

  // if (!value.id && !loading) {
  //   dispatch(createAgreement());
  // }

  return (
    <BrowserRouter>
      <RouterConfig state={value.state} />
    </BrowserRouter>
  );
}

export default App;
