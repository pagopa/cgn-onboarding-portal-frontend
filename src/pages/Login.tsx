import React, { useEffect } from "react";
import { Button } from "design-react-kit";
import { setCookie } from "../utils/cookie";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import Spid from "../assets/icons/spid.svg";
import { AdminAccess, loginRequest } from "../authConfig";

const Login = () => {
  useEffect(() => {
    void AdminAccess.handleRedirectPromise().then(response => {
      if (response) {
        setCookie(response.idToken);
        window.location.replace("/");
      }
    });
  }, []);

  const AdminLogin = () => {
    void AdminAccess.loginRedirect(loginRequest);
  };

  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="px-20 py-28 bg-white">
              <h1 className="h2 font-weight-bold text-dark-blue">
                Benvenuto su &lt;portale&gt; Carta Giovani Nazionale
              </h1>
              <p className="text-gray">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse quis dictum mi. Morbi auctor nibh ante, eget
                interdum urna malesuada in. Styles Code
              </p>
              <div className="mt-14 row variable-gutters">
                <div className="col">
                  <h2 className="h3 text-dark-blue">Sei un operatore?</h2>
                  <span className="text-sm font-weight-normal text-dark-blue text-uppercase">
                    Accedi con spid
                  </span>
                  <div className="mt-10">
                    <Spid />
                    <p>
                      SPID è il sistema unico di accesso ai servizi online della
                      Pubblica Amministrazione. Se hai già un&apos;identità
                      digitale SPID, accedi con le tue credenziali. Se non hai
                      ancora SPID, richiedilo ad uno dei gestori.
                    </p>
                  </div>
                  <Button
                    type="button"
                    color="primary"
                    className="mt-10"
                    style={{ width: "100%" }}
                    onClick={() =>
                      window.location.replace(
                        `${process.env.BASE_SPID_LOGIN_PATH}/login?entityID=xx_testenv2&authLevel=SpidL2`
                      )
                    }
                  >
                    Entra con SPID
                  </Button>
                </div>
                <div className="col">
                  <h2 className="h3 text-dark-blue">Sei un amministratore?</h2>
                  <span className="text-sm font-weight-normal text-dark-blue text-uppercase">
                    Accedi con le tue credenziali
                  </span>
                  <Button
                    type="button"
                    color="primary"
                    className="mt-10"
                    style={{ width: "100%" }}
                    onClick={AdminLogin}
                  >
                    Entra come Amministratore
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </Container>
      </Container>
    </Layout>
  );
};

export default Login;
