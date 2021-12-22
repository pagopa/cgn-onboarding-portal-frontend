import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import { logout, setCookie } from "../utils/cookie";
import { RootState } from "../store/store";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import CgnLogo from "../components/Logo/CgnLogo";

const SelectCompany = ({ token }: { token: string }) => {
  const { data } = useSelector((state: RootState) => state.user);
  const [selectedCompany, setCompany] = useState("");
  const user = data as any;

  const saveSelectedCompany = async () =>
    await tryCatch(
      () =>
        axios.post(
          `${process.env.BASE_SPID_LOGIN_PATH}/upgradeToken`,
          {
            organization_fiscal_code: selectedCompany
          },
          {
            headers: {
              "X-CGN-TOKEN": token,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        ),
      toError
    )
      .map(response => response.data.token)
      .fold(
        () => logout("USER"),
        response => {
          setCookie(response);
          window.location.replace("/");
        }
      )
      .run();

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
              {user.companies.map((company: any, i: number) => (
                <div
                  key={i}
                  className="form-check pb-4"
                  style={{ borderBottom: "1px solid lightgray" }}
                >
                  <input
                    name={`organization_fiscal_code_${i}`}
                    type="radio"
                    id={`organization_fiscal_code_${i}`}
                    onChange={e => setCompany(e.target.value)}
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
              ))}
              <div className="mt-10 d-flex flex-row">
                <Button
                  className="px-14 mr-4"
                  outline
                  color="primary"
                  tag="button"
                  onClick={() => logout("USER")}
                >
                  Annulla
                </Button>
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
