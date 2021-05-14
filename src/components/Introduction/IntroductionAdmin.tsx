import React from "react";
import { Nav } from "design-react-kit";
import NavItem from "../NavItem";
import {
  ADMIN_PANEL_RICHIESTE,
  ADMIN_PANEL_CONVENZIONATI
} from "../../navigation/routes";

type Props = {
  name: string;
  activeTab: string;
  handleClick: any;
};

const IntroductionAdmin = ({ name, activeTab, handleClick }: Props) => (
  <section className="bg-white text-left">
    <div className="pl-8 pt-10">
      <h1 className="h5">Carta Giovani Nazionale</h1>
      <h2 className="h2 text-dark-blue font-weight-bold">
        Portale Amministratori
      </h2>
      <p className="dark-blue text-capitalize">{name}</p>
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
