import { Button, Icon } from "design-react-kit";
import Layout from "../components/Layout/Layout";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { resetAgreement } from "../store/agreement/agreementSlice";
import { useCgnDispatch } from "../store/hooks";

const TerminatedAgreement = () => {
  const authentication = useAuthentication();
  const dispatch = useCgnDispatch();
  const backToCompanySelection = () => {
    if (authentication.currentSession.type === "user") {
      dispatch(resetAgreement());
      authentication.setCurrentSession({
        type: "user",
        userFiscalCode: authentication.currentSession.userFiscalCode,
        merchantFiscalCode: undefined
      });
    }
  };
  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 px-4">
        <Icon icon="it-close-circle" size="xl" color="primary" />
        <h1 className="h2 mt-6 mb-0 text-dark-blue fw-bold">
          Convenzione terminata
        </h1>
        <p className="mt-10 mb-0">
          Non è possibile accedere al portale Carta Giovani Nazionale perché la
          convenzione è stata interrotta.
        </p>
        <Button
          color="primary"
          className="mt-20"
          onClick={backToCompanySelection}
        >
          Ho capito
        </Button>
      </div>
    </Layout>
  );
};

export default TerminatedAgreement;
