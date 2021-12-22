import React from "react";
import Logo from "../Logo/Logo";
import DeparmentLogo from "../Logo/DepartmentLogo";

const Footer = () => (
  <footer>
    <div className="p-3 bg-white d-flex justify-content-center">
      <DeparmentLogo />
    </div>
    <div className="p-8 bg-secondary text-white">
      <div className="container">
        <div className="row d-flex flex-row align-items-center">
          <div className="col-2">
            <a
              href="https://www.pagopa.it/it/"
              target="_blank"
              rel="noreferrer"
            >
              <Logo />
            </a>
          </div>
          <div className="col-9 text-left">
            <span className="text-sm text-white">
              PagoPA S.p.A. - società per azioni con socio unico - capitale
              sociale di euro 1,000,000 interamente versato - sede legale in
              Roma, Piazza Colonna 370, CAP 00187 - n. di iscrizione a Registro
              Imprese di Roma, CF e P.IVA 15376371009
            </span>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12">
            <ul className="p-0 mt-7 d-flex flex-row justify-content-start list-unstyled">
              <li className="mr-8">
                <a
                  className="text-gray no-underline"
                  href="https://io.italia.it/carta-giovani-nazionale/informativa-operatori"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
