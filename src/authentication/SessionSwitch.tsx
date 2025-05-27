import { useState } from "react";
import { useAuthentication } from "./AuthenticationContext";
import { adminLogoutPopup } from "./authentication";

// this serves only for testing purposes until multiple logins are not approved

const ALLOW_MULTIPLE_LOGIN = [
  "localhost",
  "portal.cgnonboardingportal-uat.pagopa.it"
].includes(window.location.hostname);

export function SessionSwitch() {
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
          <button
            onClick={() => {
              adminLogoutPopup();
              authentication.setCurrentSession({ type: "none" });
            }}
          >
            add session
          </button>
          {Object.entries(authentication.adminSessionByName).map(
            ([name, { first_name, last_name }]) => (
              <div
                key={name}
                style={{
                  padding: "0px 16px"
                }}
                onClick={() => {
                  authentication.setCurrentSession({ type: "admin", name });
                }}
              >
                <div>
                  {first_name} {last_name}
                </div>
              </div>
            )
          )}
          {Object.entries(authentication.userSessionByFiscalCode).map(
            ([fiscal_code, { first_name, last_name }]) => (
              <div
                key={fiscal_code}
                style={{
                  padding: "0px 16px"
                }}
                onClick={() => {
                  authentication.setCurrentSession({
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
            )
          )}
        </div>
      )}
    </div>
  );
}
