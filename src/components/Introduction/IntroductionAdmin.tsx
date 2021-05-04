import React from "react";
import { Nav, NavItem, NavLink } from "design-react-kit";

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
      <p className="dark-blue">{name}</p>
    </div>
    <Nav className="auto mt-11" tabs tag="ul" vertical={false}>
      <NavItem tag="li">
        <NavLink
          active={activeTab === 0}
          tag="a"
          onClick={() => handleClick(0)}
        >
          Richieste
        </NavLink>
        <NavLink
          active={activeTab === 1}
          tag="a"
          onClick={() => handleClick(1)}
        >
          Operatori Convenzionati
        </NavLink>
      </NavItem>
    </Nav>
  </section>
);

export default IntroductionAdmin;
