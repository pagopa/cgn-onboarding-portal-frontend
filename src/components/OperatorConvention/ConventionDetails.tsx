import React, { useState } from "react";
import cx from "classnames";
import { Icon } from "design-react-kit";

const ConventionDetails = ({
  detailsA,
  onClose
}: {
  detailsA: any;
  onClose: () => void;
}) => {
  const details = {
    fullName: "PagoPA S.p.A.",
    conventionDate: "18/10/2020",
    lastUpdateDate: "10/11/2020",
    hasDifferentFullName: false,
    address: "Piazza Colonna 370, Roma, CAP 00187",
    website: "www.pagopa.gov.it",
    taxCodeOrVat: "1537637100912345",
    telephoneNumber: "234234",
    name: "PagoPA S.p.A.",
    pecAddress: "PagoPA@pec.it",
    legalOffice: "Roma, Piazza Colonna 370, CAP 00187",
    legalRepresentativeFullName: "Mario Rossi",
    legalRepresentativeTaxCode: "RSSFLV95C12H118C",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo.",
    referent: {
      firstName: "A",
      lastName: "B",
      role: "BOH",
      emailAddress: "mail",
      telephoneNumber: "2222"
    },
    discounts: [
      {
        name: "Sconto del 10% sul biglietto dello spettacolo “Rugantino”",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo.",
        startDate: "26/04/2021",
        endDate: "26/04/2021",
        lastUpdateDate: "25/04/2021",
        discount: "10%",
        category: "Teatro, cinema e spettacolo",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo."
      },
      {
        name: "Sconto del 10% sul biglietto dello spettacolo “Rugantino”",
        isSospended: true,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo.",
        startDate: "26/04/2021",
        endDate: "26/04/2021",
        lastUpdateDate: "25/04/2021",
        discount: "10%",
        category: "Teatro, cinema e spettacolo",
        rules:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis dictum mi. Morbi auctor nibh ante, eget interdum urna malesuada in. Suspendisse at condimentum leo."
      }
    ],
    documents: [
      {
        documentType: "Agreement",
        documentUrl: "string",
        creationDate: "2021-05-05"
      },
      {
        documentType: "ManifestationOfInterest",
        documentUrl: "string",
        creationDate: "2021-05-05"
      }
    ]
  };

  const [view, setView] = useState("dati_operatore");

  const getView = () => {
    if (view.includes("agevolazione")) {
      return <div>{view}</div>;
    }
    switch (view) {
      case "dati_operatore":
        return <div>dati_operatore</div>;
      case "profilo":
        return <div>profilo</div>;
      case "referente":
        return <div>referente</div>;
      case "documenti":
        return <div>documenti</div>;
    }
  };

  const menuLink = (viewKey: string, label: string, child?: any) => (
    <li
      className={cx("nav-item", {
        active: view.includes(viewKey)
      })}
    >
      <a
        className={cx("nav-link", {
          active: view.includes(viewKey),
          "cursor-pointer": !child
        })}
        onClick={() => !child && setView(viewKey)}
      >
        <span>{label}</span>
      </a>
      {child}
    </li>
  );

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between mt-2 px-8 py-10 bg-white">
        <h4>{details.fullName}</h4>
        <div>
          <div className="mb-3 text-gray">Data convenzionamento</div>
          <div>{details.conventionDate}</div>
        </div>
        <div>
          <div className="mb-3 text-gray">Data ultima modifica</div>
          <div>{details.lastUpdateDate}</div>
        </div>
        <div onClick={onClose} className="cursor-pointer">
          <Icon color="primary" icon="it-close" size="" />
        </div>
      </div>
      <div className="d-flex mt-2">
        <div className="col-4 p-0">
          <div className="mr-1 px-8 py-10 bg-white">
            <nav className="navbar it-navscroll-wrapper navbar-expand-lg it-bottom-navscroll it-left-side">
              <div className="menu-wrapper">
                <div className="link-list-wrapper">
                  <ul className="link-list">
                    {menuLink("dati_operatore", "Dati Operatore")}
                    {menuLink(
                      "agevolazione",
                      "Agevolazioni",
                      <ul className="link-list">
                        {details.discounts.map((d, i) => (
                          <li className="nav-link" key={i}>
                            <a
                              className={cx(
                                "nav-link primary-color cursor-pointer",
                                {
                                  "font-weight-bold": view.includes(
                                    `agevolazione${i + 1}`
                                  )
                                }
                              )}
                              onClick={() => setView(`agevolazione${i + 1}`)}
                            >
                              <span className="d-flex align-items-center">
                                Agevolazione #{i + 1}
                                {d.isSospended && (
                                  <span className="dot ml-2 bg-warning" />
                                )}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                    {menuLink("profilo", "Profilo")}
                    {menuLink("referente", "Referente")}
                    {menuLink("documenti", "Documenti")}
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="col-8 p-0">
          <div className="ml-1 px-8 py-10 bg-white">{getView()}</div>
        </div>
      </div>
    </section>
  );
};

export default ConventionDetails;
