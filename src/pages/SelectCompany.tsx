import React from "react";
import { Button } from "design-react-kit";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import CgnLogo from "../components/Logo/CgnLogo";
import { useAuthentication } from "../authentication/AuthenticationContext";
import { getCurrentUserSession } from "../authentication/authenticationState";

const SelectCompany = () => {
  const authentication = useAuthentication();
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(
    null
  );
  const merchants = getCurrentUserSession(authentication)?.merchants;
  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="p-20 bg-white">
              <div className="row">
                <div className="col-9">
                  <h1 className="h2 font-weight-bold text-dark-blue">
                    Società Operante
                  </h1>
                  <p>
                    Per completare l’accesso, seleziona la società per la quale
                    intendi operare
                  </p>
                </div>
                <div className="col-3 d-flex justify-content-end">
                  <CgnLogo />
                </div>
              </div>
              {merchants?.map((company, i) => {
                return (
                  <div
                    key={i}
                    className="form-check pb-4"
                    style={{ borderBottom: "1px solid lightgray" }}
                  >
                    <input
                      name={`organization_fiscal_code_${i}`}
                      type="radio"
                      id={`organization_fiscal_code_${i}`}
                      onChange={e => setSelectedCompany(e.target.value)}
                      value={company.organization_fiscal_code}
                      checked={
                        selectedCompany === company.organization_fiscal_code
                      }
                    />
                    <label htmlFor={`organization_fiscal_code_${i}`}>
                      <strong>{company.organization_name}</strong>
                      <small
                        id={`organization_fiscal_code_${i}`}
                        className="form-text"
                      >
                        CF/PIVA {company.organization_fiscal_code}
                      </small>
                    </label>
                  </div>
                );
              })}
              <div className="mt-10 d-flex flex-row">
                <Button
                  className="px-14 mr-4"
                  outline
                  color="primary"
                  tag="button"
                  onClick={() => {
                    authentication.logout(authentication.currentSession);
                  }}
                >
                  Annulla
                </Button>
                <Button
                  disabled={!selectedCompany}
                  className="px-14 mr-4"
                  color="primary"
                  tag="button"
                  onClick={() => {
                    if (
                      authentication.currentSession?.type === "user" &&
                      selectedCompany
                    ) {
                      authentication.changeSession({
                        type: "user",
                        userFiscalCode:
                          authentication.currentSession.userFiscalCode,
                        merchantFiscalCode: selectedCompany
                      });
                    }
                  }}
                >
                  Continua
                </Button>
              </div>
            </section>
          </div>
        </Container>
      </Container>
    </Layout>
  );
};

export default SelectCompany;
