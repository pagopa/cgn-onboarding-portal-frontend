import React from "react";
import { Button } from "design-react-kit";
import Logo from "../Logo/Logo";
import { logout } from "../../utils/cookie";
import { HELP } from "../../navigation/routes";
import { Link } from "react-router-dom";

const Header = () => (
  <header className="position-relative p-2 bg-white shadow">
    <div className="container d-flex justify-content-between align-items-center">
      <div>
        <Logo />
      </div>
      <div className="d-flex align-items-center">
        <Link
          to={HELP}
          className="mr-11 text-base text-blue font-weight-semibold no-underline"
        >
          Serve aiuto?
        </Link>
        <Button
          className="px-8"
          color="primary"
          size="xs"
          icon={false}
          tag="button"
          onClick={logout}
        >
          Esci
        </Button>
      </div>
    </div>
  </header>
);

export default Header;
