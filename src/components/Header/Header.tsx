import { useState } from "react";
import { href, Link, Register, useMatch } from "react-router";
import { Button } from "design-react-kit";
import Logo from "../Logo/Logo";
import { useAuthentication } from "../../authentication/AuthenticationContext";
import { SessionSwitch } from "../../authentication/SessionSwitch";
import LogoutModal from "./LogoutModal";

const Header = () => {
  const authentication = useAuthentication();
  const isLogged = authentication.currentSession.type !== "none";
  const isCreateProfile = useMatch(
    "/operator/create-profile" satisfies keyof Register["pages"]
  );
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <header className="position-relative p-2 bg-white shadow">
      <div className="container d-flex justify-content-between align-items-center">
        <div>
          <Logo />
        </div>
        <div className="d-flex align-items-center">
          {authentication.currentSession?.type !== "admin" && (
            <Link
              to={href("/help")}
              className="me-11 text-base text-blue fw-semibold text-decoration-none"
            >
              Serve aiuto?
            </Link>
          )}
          <SessionSwitch />
          {isLogged && (
            <>
              {isCreateProfile ? (
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
              ) : (
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
