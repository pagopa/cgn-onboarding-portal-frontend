import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { LOGIN } from "../navigation/routes";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";

export function LoginRedirect() {
  const showError = false;
  return (
    <Layout>
      <Container>
        <div className="col-12 bg-white my-20 p-10 d-flex flex-column align-items-center">
          {showError ? (
            <Fragment>
              <h1 className="h2 font-weight-bold text-dark-blue">
                Errore durante il login
              </h1>
              <Link className="mt-8 btn btn-outline-primary" to={LOGIN}>
                Riprova
              </Link>
            </Fragment>
          ) : (
            <h1 className="h2 font-weight-bold text-dark-blue">
              Login in corso
            </h1>
          )}
        </div>
      </Container>
    </Layout>
  );
}
