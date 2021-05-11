import React from "react";
import { Nav } from "design-react-kit";
import NavItem from "../NavItem";

type Props = {
  name: string;
  activeTab: number;
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
      <NavItem active={activeTab === 0} onClick={() => handleClick(0)}>
        Richieste
      </NavItem>
      <NavItem active={activeTab === 1} onClick={() => handleClick(1)}>
        Operatori Convenzionati
      </NavItem>
    </Nav>
  </section>
);

export default IntroductionAdmin;
