import React from "react";
import { Nav } from "design-react-kit";
import NavItem from "../NavItem";
import {
  ADMIN_PANEL_CONVENZIONATI,
  ADMIN_PANEL_RICHIESTE
} from "../../navigation/routes";
import CgnLogo from "../Logo/CgnLogo";

type Props = {
  name: string;
  activeTab: string;
  handleClick: any;
};

const IntroductionAdmin = ({ name, activeTab, handleClick }: Props) => (
  <section className="bg-white text-left">
    <div className="px-8 pt-10">
      <div className="row">
        <div className="col-9">
          <h1 className="h5">Carta Giovani Nazionale</h1>
          <h2 className="h2 text-dark-blue font-weight-bold">
            Portale Amministratori
          </h2>
          <p className="dark-blue text-capitalize">{name}</p>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <CgnLogo />
        </div>
      </div>
    </div>
    <Nav className="auto mt-11" tabs tag="ul" vertical={false}>
      <NavItem
        active={activeTab === ADMIN_PANEL_RICHIESTE}
        onClick={() => handleClick(ADMIN_PANEL_RICHIESTE)}
      >
        Richieste
      </NavItem>
      <NavItem
        active={activeTab === ADMIN_PANEL_CONVENZIONATI}
        onClick={() => handleClick(ADMIN_PANEL_CONVENZIONATI)}
      >
        Operatori Convenzionati
      </NavItem>
    </Nav>
  </section>
);

export default IntroductionAdmin;
