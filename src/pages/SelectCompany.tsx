import { Button } from "design-react-kit";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import CgnLogo from "../components/Logo/CgnLogo";
import { useAuthentication } from "../authentication/AuthenticationContext";

const SelectCompany = () => {
  const authentication = useAuthentication();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const merchants = authentication.currentUserSession?.merchants;
  const onConfirmSelection = () => {
    if (authentication.currentSession.type === "user" && selectedCompany) {
      authentication.setCurrentSession({
        type: "user",
        userFiscalCode: authentication.currentSession.userFiscalCode,
        merchantFiscalCode: selectedCompany
      });
    }
  };
  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="p-20 bg-white">
              <div className="row" style={{ marginBottom: "40px" }}>
                <div className="col-9">
                  <h1 className="h2 fw-bold text-dark-blue">
                    Società Operante
                  </h1>
                  <p style={{ marginTop: "20px" }}>
                    Per completare l’accesso, seleziona la società per la quale
                    intendi operare
                  </p>
                </div>
                <div className="col-3 d-flex justify-content-end">
                  <CgnLogo />
                </div>
              </div>
              {merchants?.map((company, i) => (
                <div
                  key={i}
                  className="form-check pb-4"
                  style={{
                    marginBottom: "16px",
                    borderBottom:
                      i < merchants.length - 1 ? "1px solid lightgray" : "none"
                  }}
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
                  <label
                    htmlFor={`organization_fiscal_code_${i}`}
                    className="form-label"
                  >
                    <strong>{company.organization_name}</strong>
                    <small
                      id={`organization_fiscal_code_${i}`}
                      className="form-text d-block"
                    >
                      CF/PIVA {company.organization_fiscal_code}
                    </small>
                  </label>
                </div>
              ))}
              <div className="mt-10 d-flex flex-row gap-4 flex-wrap">
                <Button
                  className="px-14"
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
                  className="px-14"
                  color="primary"
                  tag="button"
                  onClick={onConfirmSelection}
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
