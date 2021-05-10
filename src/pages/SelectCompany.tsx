import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { RootState } from "../store/store";
import { setCompanyCookie } from "../utils/cookie";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";

const SelectCompany = () => {
  const { data } = useSelector((state: RootState) => state.user);
  const [selectedCompany, setCompany] = useState("");
  const user = data as any;

  const saveSelectedCompany = () => {
    setCompanyCookie(selectedCompany);
    window.location.replace("/");
  };

  return (
    <Layout>
      <Container>
        <Container className="mt-20 mb-20">
          <div className="col-10 offset-1">
            <section className="p-20 bg-white">
              <h1 className="h2 font-weight-bold text-dark-blue">
                Società Operante
              </h1>
              <p>
                Per completare l’accesso, seleziona la società per la quale
                intendi operare
              </p>
              {/* {user.companies.map((company: any, i: number) => ( */}
              {user.iss.split("").map((company: any, i: number) => (
                <div
                  key={i}
                  className="form-check pb-4"
                  style={{ borderBottom: "1px solid lightgray" }}
                >
                  <input
                    name={`company${i}`}
                    type="radio"
                    id={`company${i}`}
                    onChange={() => setCompany(`company${i}`)}
                    // value={company.organization_fiscal_code}
                    value={`company${i}`}
                    checked={selectedCompany === `company${i}`}
                  />
                  <label htmlFor={`company${i}`}>
                    <strong>{company}</strong>
                    {/* {company.organization_name} */}
                    <small id={`company${i}`} className="form-text">
                      CF/PIVA {`company${i}`}
                      {/* {company.organization_fiscal_code} */}
                    </small>
                  </label>
                </div>
              ))}
              <div className="mt-10 d-flex flex-row">
                {/* <Button
                  className="px-14 mr-4"
                  outline
                  color="primary"
                  tag="button"
                >
                  Annulla
                </Button> */}
                <Button
                  disabled={!selectedCompany}
                  className="px-14 mr-4"
                  color="primary"
                  tag="button"
                  onClick={saveSelectedCompany}
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
