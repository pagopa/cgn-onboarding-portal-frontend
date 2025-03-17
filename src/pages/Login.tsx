import React, { useEffect, useState } from "react";
import { Button, Icon } from "design-react-kit";
import { useLocation } from "react-router-dom";
import { setCookie } from "../utils/cookie";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import Spid from "../assets/icons/spid.svg";
import { AdminAccess, loginRequest } from "../authConfig";
import CgnLogo from "../components/Logo/CgnLogo";
import SpidSelect from "./SpidSelect";
import Help from "./Help";

const Login = () => {
  const location = useLocation();
  const [showIDPS, setShowIDPS] = useState(false);

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

  if (location.pathname === "/admin/operatori/login/help") {
    return <Help />;
  }

  if (showIDPS) {
    return <SpidSelect onBack={() => setShowIDPS(false)} />;
  }

  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="px-20 py-28 bg-white">
              <div className="row">
                <div className="col-9">
                  <h1 className="h2 font-weight-bold text-dark-blue">
                    Benvenuto sul portale operatori di Carta Giovani Nazionale
                  </h1>
                  <p className="text-gray">
                    Il portale è il punto unico di richiesta e gestione delle
                    convenzioni tra gli operatori che intendono aderire
                    all’iniziativa e il Dipartimento per le Politiche Giovanili
                    e il Servizio Civile Universale
                  </p>
                </div>
                <div className="col-3 d-flex justify-content-end">
                  <CgnLogo />
                </div>
              </div>
              {MAINTENANCE_BANNER && (
                <div className="mt-8">
                  {MAINTENANCE_BANNER === "short-downtime" && (
                    <Alert title="Il portale è in manutenzione, tornerà operativo a breve" />
                  )}
                  {MAINTENANCE_BANNER === "long-downtime" && (
                    <Alert title="Il portale è in manutenzione. Se riscontri qualche problema, riprova più tardi" />
                  )}
                </div>
              )}
              <div className="mt-14 row variable-gutters">
                <div className="col">
                  <h2 className="h3 text-dark-blue">Sei un operatore?</h2>
                  <span className="text-sm font-weight-normal text-dark-blue text-uppercase">
                    Accedi con spid
                  </span>
                  <div className="mt-10">
                    <Spid />
                    <p className="mt-4">
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
                    onClick={() => setShowIDPS(true)}
                  >
                    Entra con SPID
                  </Button>
                  <div className="mt-4">
                    <span>
                      Non hai spid?{" "}
                      <a href="https://www.spid.gov.it/">Scopri di più</a>
                    </span>
                  </div>
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

const MAINTENANCE_BANNER:
  | undefined
  | "short-downtime"
  | "long-downtime" = "short-downtime;

function Alert({ title }: { title: string }) {
  return (
    <div
      style={{
        borderLeft: "4px solid #FFCB46",
        backgroundColor: "#fffaec",
        borderRadius: "4px",
        display: "flex",
        padding: "16px",
        gap: "16px",
        alignItems: "center"
      }}
    >
      <Icon icon="it-warning-circle" />
      <div
        style={{
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "21px"
        }}
      >
        {title}
      </div>
    </div>
  );
}
