import React from "react";
import Logo from "../Base/Logo";

const Header = () => (
  <header className="p-2 bg-white shadow">
    <div className="container d-flex justify-content-between align-items-center">
      <div>
        <Logo />
      </div>
      <div className="d-flex align-items-center">
        <a className="no-underline mr-11" href="#">
          <span className="text-base text-blue font-weight-semibold">
            Serve aiuto?
          </span>
        </a>
        <button type="button" className="px-8 btn btn-primary btn-xs">
          Esci
        </button>
      </div>
    </div>
  </header>
);

export default Header;
