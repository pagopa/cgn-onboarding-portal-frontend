import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "design-react-kit";
import { createAgreement } from "../store/agreement/agreementSlice";

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
