import { useState } from "react";
import { Button, Icon } from "design-react-kit";
import Layout from "../components/Layout/Layout";
import CgnLogo from "../components/Logo/CgnLogo";
import {
  goToAdminLoginPage,
  goToUserLoginPage
} from "../authentication/authentication";

const MAINTENANCE_MODE = import.meta.env.CGN_MAINTENANCE_MODE;

type AlertProps = {
  title: string;
  onClose: () => void;
};

function Alert({ title, onClose }: AlertProps) {
  return (
    <div className="d-flex border border-dark bg-white mb-14">
      <div className="bg-warning px-1" />
      <div className="d-flex flex-grow-1 align-items-start gap-3 gap-md-4 p-4 p-md-6">
        <div className="fs-5 flex-shrink-0">
          <Icon icon="it-warning-circle" color="warning" />
        </div>
        <div className="fs-5 fw-semibold flex-grow-1">{title}</div>
        <div className="fs-5 flex-shrink-0">
          <Icon
            icon="it-close"
            color="secondary"
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

const Login = () => {
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const showAlert = !!MAINTENANCE_MODE && !isAlertDismissed;

  return (
    <Layout>
      <div className="container-xl px-2 px-md-12 px-lg-3 my-20">
        <section className="mx-auto px-4 px-md-14 px-lg-24 pt-24 pb-24 bg-white login-box">
          {showAlert && (
            <>
              {MAINTENANCE_MODE === "short-downtime" && (
                <Alert
                  title="Il portale è in manutenzione, tornerà operativo a breve."
                  onClose={() => setIsAlertDismissed(true)}
                />
              )}
              {MAINTENANCE_MODE === "long-downtime" && (
                <Alert
                  title="Il portale è in manutenzione. Se riscontri qualche problema, riprova più tardi."
                  onClose={() => setIsAlertDismissed(true)}
                />
              )}
            </>
          )}
          <div className="row">
            <div className="col-9">
              <h1 className="h2 fw-bold text-dark-blue">
                Ti diamo il benvenuto sul Portale operatori Carta Giovani
                Nazionale
              </h1>
              <p className="text-gray mt-8">
                Il portale è il punto unico di richiesta e gestione delle
                convenzioni tra gli operatori che intendono aderire
                all’iniziativa e il Dipartimento per le Politiche Giovanili e il
                Servizio Civile Universale.
              </p>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <CgnLogo />
            </div>
          </div>
          <div className="mt-10 row variable-gutters position-relative py-md-4">
            <div className="position-absolute top-0 bottom-0 start-50 w-auto p-0 border-start border-secondary d-none d-md-block" />
            <div className="col-12 col-md-6 pe-md-4 pe-lg-1 d-flex flex-column justify-content-between">
              <h2 className="h3 fs-3 text-dark-blue">Sei un operatore?</h2>
              <Button
                type="button"
                color="primary"
                size="lg"
                className="mt-10 align-self-start"
                disabled={!!MAINTENANCE_MODE}
                onClick={() => {
                  goToUserLoginPage();
                }}
              >
                Entra con SPID/CIE
              </Button>
            </div>
            <hr className="d-md-none mt-14 mb-8 border-secondary opacity-100" />
            <div className="col-12 col-md-6 ps-md-4 ps-lg-20 d-flex flex-column justify-content-between">
              <div>
                <h2 className="h3 fs-3 text-dark-blue">
                  Sei un amministratore?
                </h2>
                <span className="text-lg fw-semibold text-dark-blue text-uppercase">
                  Accedi con le tue credenziali
                </span>
              </div>
              <Button
                type="button"
                color="primary"
                size="lg"
                className="mt-10 align-self-start"
                disabled={!!MAINTENANCE_MODE}
                onClick={() => {
                  goToAdminLoginPage();
                }}
              >
                Entra come amministratore
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Login;
