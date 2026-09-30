import { Button, Icon } from "design-react-kit";
import Layout from "../components/Layout/Layout";
import { useAuthentication } from "../authentication/AuthenticationContext";

const Maintenance = () => {
  const authentication = useAuthentication();
  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 px-4">
        <Icon icon="it-warning-circle" size="xl" style={{ fill: "#995C00" }} />
        <h1 className="h2 mt-6 mb-0 text-dark-blue fw-bold">
          Portale in manutenzione
        </h1>
        <p className="mt-10 mb-0">
          Il portale Carta Giovani Nazionale è momentaneamente in manutenzione.
          Riprova più tardi.
        </p>
        <Button
          color="primary"
          className="mt-20"
          onClick={() => authentication.logout(authentication.currentSession)}
        >
          Torna al login
        </Button>
      </div>
    </Layout>
  );
};

export default Maintenance;
