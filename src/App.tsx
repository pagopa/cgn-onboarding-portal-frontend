import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCookie, getCookie } from "./utils/cookie";
import { setUser } from "./store/user/userSlice";
import CenteredLoading from "./components/CenteredLoading/CenteredLoading";
import RouterConfig from "./navigation/RouterConfig";
import Login from "./pages/Login";
import SelectCompany from "./pages/SelectCompany";
import "./styles/bootstrap-italia-custom.scss";
import "react-datepicker/dist/react-datepicker.css";
import "typeface-titillium-web";
import { RootState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const { data: user, type, loading } = useSelector(
    (state: RootState) => state.user
  );
  const token = getCookie();
  const { hash = "" } = window.location;

  useEffect(() => {
    if (hash) {
      const urlToken = hash.replace("#token=", "");
      setCookie(urlToken);
      window.location.replace("/");
    }
    if (token) {
      dispatch(setUser(token));
    }
  }, []);

  if (!token && !hash) {
    return <Login />;
  }

  if (type === "USER" && user.level === "L1") {
    return <SelectCompany token={token} />;
  }

  return loading ? (
    <CenteredLoading />
  ) : (
    <RouterConfig user={user} userType={type} />
  );
}

export default App;
