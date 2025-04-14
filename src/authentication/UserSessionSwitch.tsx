import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LOGIN } from "../navigation/routes";
import { useAuthentication } from "./AuthenticationContext";

// this serves only for testing purposes until multiple logins are not approved

const ALLOW_MULTIPLE_LOGIN =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "portal.cgnonboardingportal-uat.pagopa.it";

export function UserSessionSwitch() {
  const authentication = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);
  if (!ALLOW_MULTIPLE_LOGIN) {
    return null;
  }
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        one identity
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            maxWidth: "80vw",
            border: "1px solid black",
            zIndex: 1,
            gap: 8,
            display: "flex",
            flexDirection: "column",
            padding: 8
          }}
        >
          <Link to={LOGIN}>add session</Link>
          {Object.entries(authentication.userSessionByFiscalCode).map(
            ([fiscal_code, { first_name, last_name }]) => {
              return (
                <div
                  key={fiscal_code}
                  style={{
                    padding: "0px 16px"
                  }}
                  onClick={() => {
                    authentication.changeSession({
                      type: "user",
                      userFiscalCode: fiscal_code,
                      merchantFiscalCode: undefined
                    });
                  }}
                >
                  <div>
                    {first_name} {last_name}
                  </div>
                  <div>{fiscal_code}</div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
