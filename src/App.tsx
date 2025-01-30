import { hot } from "react-hot-loader";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { setCookie, getCookie } from "./utils/cookie";
import { setUser } from "./store/user/userSlice";
import CenteredLoading from "./components/CenteredLoading/CenteredLoading";
import RouterConfig from "./navigation/RouterConfig";
import Login from "./pages/Login";
import SelectCompany from "./pages/SelectCompany";
import "./styles/bootstrap-italia-custom.scss";
import "./styles/react-datepicker.css";
import "typeface-titillium-web";
import { RootState } from "./store/store";
import { queryClient } from "./api/common";

function App() {
  const dispatch = useDispatch();
  const { data: user, type, loading } = useSelector(
    (state: RootState) => state.user
  );
  const token = getCookie();
  const { hash = "" } = window.location;

  useEffect(() => {
    if (hash && !hash.includes("#state")) {
      const urlToken = hash.replace("#token=", "");
      setCookie(urlToken);
      window.location.replace("/");
    }
    if (token) {
      dispatch(setUser(token));
    }
  }, [dispatch, hash, token]);

  if (!token) {
    return <Login />;
  }

  if (type === "USER" && user.level === "L1") {
    return <SelectCompany token={token} />;
  }

  if (loading) {
    return <CenteredLoading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterConfig user={user} userType={type} />
    </QueryClientProvider>
  );
}

export default hot(module)(App);
