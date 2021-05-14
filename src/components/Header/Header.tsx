import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "design-react-kit";
import { getCookie, logout } from "../../utils/cookie";
import { CREATE_PROFILE, HELP } from "../../navigation/routes";
import { RootState } from "../../store/store";
import Logo from "../Logo/Logo";
import LogoutModal from "./LogoutModal";

type Props = {
  hasBorder?: boolean;
};

const Header = ({ hasBorder = false }: Props) => {
  const { type } = useSelector((state: RootState) => state.user);
  const token = getCookie();
  const location = useLocation();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <header
      className={
        hasBorder
          ? "position-relative p-2 bg-white"
          : "position-relative p-2 bg-white shadow"
      }
      style={hasBorder ? { borderBottom: "1px solid #E6E9F2" } : {}}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <Logo />
        </div>
        <div className="d-flex align-items-center">
          {type !== "ADMIN" && (
            <Link
              to={HELP}
              className="mr-11 text-base text-blue font-weight-semibold no-underline"
            >
              Serve aiuto?
            </Link>
          )}
          {token && (
            <>
              {location.pathname === CREATE_PROFILE && (
                <Button
                  className="px-8"
                  color="primary"
                  size="xs"
                  icon={false}
                  tag="button"
                  onClick={toggle}
                >
                  Esci
                </Button>
              )}
              {location.pathname !== CREATE_PROFILE && (
                <Button
                  className="px-8"
                  color="primary"
                  size="xs"
                  icon={false}
                  tag="button"
                  onClick={() => logout(type)}
                >
                  Esci
                </Button>
              )}
            </>
          ) 
        </div>
        <LogoutModal
          isOpen={modal}
          toggle={toggle}
          logout={() => {
            logout(type);
          }}
        />
      </div>
    </header>
  );
};

export default Header;
