import React, { useState } from "react";
import { useAuthentication } from "./AuthenticationContext";
import { adminLogoutPopup } from "./authentication";
import { authenticationStore } from "./authenticationStore";

// this serves only for testing purposes until multiple logins are not approved

const ALLOW_MULTIPLE_LOGIN =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "portal.cgnonboardingportal-uat.pagopa.it";

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
          {
            // developer utility to be able to test from localhost
            window.location.host ===
              "portal.cgnonboardingportal-uat.pagopa.it" && (
              <button
                onClick={() => {
                  // eslint-disable-next-line functional/immutable-data
                  window.location.href = `http://localhost:3000/dev-auth?${new URLSearchParams(
                    {
                      authenticationState: JSON.stringify(
                        authenticationStore.get()
                      )
                    }
                  )}`;
                }}
              >
                authenticate on localhost
              </button>
            )
          }
          <button
            onClick={() => {
              adminLogoutPopup();
              authentication.setCurrentSession(null);
            }}
          >
            add session
          </button>
          {Object.entries(authentication.adminSessionByName).map(
            ([name, { first_name, last_name }]) => {
              return (
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
              );
            }
          )}
          {Object.entries(authentication.userSessionByFiscalCode).map(
            ([fiscal_code, { first_name, last_name }]) => {
              return (
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
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
