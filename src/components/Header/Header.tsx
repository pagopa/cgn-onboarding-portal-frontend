import { Button, Box, Container, AppBar, Toolbar } from "@mui/material";
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
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          color: "inherit",
          boxShadow: hasBorder ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
          borderBottom: hasBorder ? "1px solid #E6E9F2" : "none"
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0"
            }}
          >
            <Box>
              <Logo />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <SessionSwitch />
              {isLogged && (
                <>
                  {location.pathname === CREATE_PROFILE ? (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{ px: 2 }}
                      onClick={toggle}
                    >
                      Esci
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      sx={{ px: 2 }}
                      onClick={() => {
                        authentication.logout(authentication.currentSession);
                      }}
                    >
                      Esci
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <LogoutModal
        isOpen={modal}
        toggle={toggle}
        logout={() => {
          authentication.logout(authentication.currentSession);
        }}
      />
    </>
  );
};

export default Header;
