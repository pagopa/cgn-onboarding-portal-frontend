import React from "react";
import { useDispatch } from "react-redux";
import { createAgreement } from "../store/agreement/agreementSlice";
import { Button } from "design-react-kit";

const Login = () => {
  const dispatch = useDispatch();

  function handleLogin() {
    dispatch(createAgreement());
  }

  return (
    <Button color="primary" tag="button" onClick={handleLogin}>
      Login
    </Button>
  );
};

export default Login;
