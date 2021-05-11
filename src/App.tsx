import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie } from "./utils/cookie";
import { setUser } from "./store/user/userSlice";
import CenteredLoading from "./components/CenteredLoading/CenteredLoading";
import RouterConfig from "./navigation/RouterConfig";
import Login from "./pages/Login";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import { RootState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const { type, loading } = useSelector((state: RootState) => state.user);
  const token = getCookie();
  const { search = "" } = window.location;

  useEffect(() => {
    if (search) {
      const urlToken = search.replace("?token=", "");
      setCookie(urlToken);
      window.location.replace("/");
    }
    if (token) {
      dispatch(setUser(token));
    }
  }, []);

  if (!token && !search) {
    return <Login />;
  }

  return loading ? <CenteredLoading /> : <RouterConfig userType={type} />;
}

export default App;
