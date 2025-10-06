import { Fragment, useEffect, useRef, useState } from "react";
import {
  Button,
  FormGroup,
  FormText,
  Input,
  Label,
  UncontrolledTooltip
} from "design-react-kit";
import { useAuthentication } from "./AuthenticationContext";
import { adminLogoutPopup } from "./authentication";

// this serves only for testing purposes until multiple logins are not approved

// eslint-disable-next-line functional/no-let
let authenticationResynced = false;

export function SessionSwitch() {
  const authentication = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localAuthRef = useRef<any>(null);
  useEffect(() => {
    // this is needed to reflect changes made outside react
    if (!authenticationResynced) {
      authentication.setCurrentSession(authentication.currentSession);
      authenticationResynced = true;
    }
  });
  if (import.meta.env.CGN_ALLOW_MULTIPLE_LOGIN !== "true") {
    return null;
  }
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        one identity
      </button>
      <div className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        <div className="gap-3 px-4 py-2 d-flex flex-column">
          {window.location.hostname !== "localhost" && (
            <Fragment>
              <Button
                color="secondary"
                innerRef={localAuthRef}
                onClick={async () => {
                  const token = localStorage.getItem("oneidentity");
                  await navigator.clipboard.writeText(
                    `localStorage.setItem("oneidentity", ${JSON.stringify(token)}); location.reload();`
                  );
                  window.location.replace("http://localhost:3000");
                }}
              >
                authenticate on localhost:3000
              </Button>
              <UncontrolledTooltip target={localAuthRef}>
                the token will be copied to clipboard
                <br />
                you will be redirected to localhost:3000
                <br />
                then paste the token in the console and hit enter
              </UncontrolledTooltip>
              <Button
                color="primary"
                onClick={() => {
                  adminLogoutPopup();
                  authentication.setCurrentSession({ type: "none" });
                }}
              >
                add session
              </Button>
            </Fragment>
          )}
          <form className="mt-3">
            {Object.entries(authentication.adminSessionByName).map(
              ([name, { first_name, last_name }]) => {
                const isActive =
                  first_name ===
                    authentication.currentAdminSession?.first_name &&
                  last_name === authentication.currentAdminSession?.last_name;
                const onSelect = () => {
                  authentication.setCurrentSession({
                    type: "admin",
                    name
                  });
                  window.location.reload();
                };
                return (
                  <FormGroup
                    key={name}
                    check
                    className="form-check-group"
                    onClick={onSelect}
                  >
                    <Input
                      type="radio"
                      checked={isActive}
                      onChange={onSelect}
                    />
                    <Label check>
                      {first_name} {last_name}
                    </Label>
                  </FormGroup>
                );
              }
            )}
            {Object.entries(authentication.userSessionByFiscalCode).map(
              ([fiscal_code, { first_name, last_name }]) => {
                const isActive =
                  fiscal_code === authentication.currentUserFiscalCode;
                const onSelect = () => {
                  authentication.setCurrentSession({
                    type: "user",
                    userFiscalCode: fiscal_code,
                    merchantFiscalCode: undefined
                  });
                  window.location.reload();
                };
                return (
                  <FormGroup
                    key={fiscal_code}
                    check
                    className="form-check-group"
                    onClick={onSelect}
                  >
                    <Input
                      type="radio"
                      checked={isActive}
                      onChange={onSelect}
                    />
                    <Label check>
                      {first_name} {last_name}
                    </Label>
                    <FormText>
                      <div>{fiscal_code}</div>
                    </FormText>
                  </FormGroup>
                );
              }
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
