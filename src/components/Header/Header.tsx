import { Button } from "design-react-kit";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthentication } from "../../authentication/AuthenticationContext";
import { SessionSwitch } from "../../authentication/SessionSwitch";
import { CREATE_PROFILE } from "../../navigation/routes";
import Logo from "../Logo/Logo";
import LogoutModal from "./LogoutModal";

type Props = {
  hasBorder?: boolean;
};

const Header = ({ hasBorder = false }: Props) => {
  const authentication = useAuthentication();
  const isLogged = authentication.currentSession.type !== "none";
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
          <SessionSwitch />
          {isLogged && (
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
                  onClick={() => {
                    authentication.logout(authentication.currentSession);
                  }}
                >
                  Esci
                </Button>
              )}
            </>
          )}
        </div>
        <LogoutModal
          isOpen={modal}
          toggle={toggle}
          logout={() => {
            authentication.logout(authentication.currentSession);
          }}
        />
      </div>
    </header>
  );
};

export default Header;
