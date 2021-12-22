import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "design-react-kit";
import { RootState } from "../store/store";
import { logout } from "../utils/cookie";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import DocumentFail from "../assets/icons/document_fail.svg";
import { CREATE_PROFILE } from "../navigation/routes";
import CgnLogo from "../components/Logo/CgnLogo";

const RejectedProfile = () => {
  const agreement = useSelector((state: RootState) => state.agreement.value);
  const history = useHistory();
  return (
    <Layout>
      <Container className="mt-10 mb-20">
        <section className="col-12 d-flex flex-column">
          <div className="px-8 pt-10">
            <div className="row">
              <div className="col-9">
                <h1 className="h5">Carta Giovani Nazionale</h1>
                <h2 className="h2 text-dark-blue font-weight-bold">
                  Portale Operatori
                </h2>
              </div>
              <div className="col-3 d-flex justify-content-end">
                <CgnLogo />
              </div>
            </div>
          </div>
          <div className="p-20 mt-4 bg-white d-flex flex-column align-items-center">
            <h2 className="h2 mb-4 text-dark-blue font-weight-bold">
              Richiesta di convenzione rifiutata
            </h2>
            <DocumentFail />
            <p className="mt-4">
              Ci dispiace ma la sua richiesta di convenzione è stata rifiutata
              dal Dipartimento, di seguito le note in merito:
            </p>
            <p className="mt-4 mb-8 p-4 neutral-1-bg-a1">
              {agreement.reasonMessage}
            </p>
            <div>
              <Button
                color="primary"
                className="ml-4"
                outline
                onClick={() => logout("USER")}
                style={{ width: "175px" }}
              >
                Esci
              </Button>
              <Button
                color="primary"
                className="ml-4"
                onClick={() => history.push(CREATE_PROFILE)}
                style={{ width: "175px" }}
              >
                Modifica dati
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
};

export default RejectedProfile;
