import {
  Button,
  Typography,
  Box,
  Stack,
  Paper,
  FormControlLabel,
  Radio
} from "@mui/material";
import { useState } from "react";
import Layout from "../components/Layout/Layout";
import Container from "../components/Container/Container";
import CgnLogo from "../components/Logo/CgnLogo";
import { useAuthentication } from "../authentication/AuthenticationContext";

const SelectCompany = () => {
  const authentication = useAuthentication();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const merchants = authentication.currentUserSession?.merchants;
  const onConfirmSelection = () => {
    if (authentication.currentSession.type === "user" && selectedCompany) {
      authentication.setCurrentSession({
        type: "user",
        userFiscalCode: authentication.currentSession.userFiscalCode,
        merchantFiscalCode: selectedCompany
      });
    }
  };
  return (
    <Layout>
      <Container>
        <Box sx={{ mt: 5, mb: 5, display: "flex", justifyContent: "center" }}>
          <Paper
            sx={{
              p: 10,
              backgroundColor: "white",
              minWidth: "60%"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 5
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#01254C", mb: 2.5 }}
                >
                  Società Operante
                </Typography>
                <Typography variant="body1">
                  Per completare l&apos;accesso, seleziona la società per la
                  quale intendi operare
                </Typography>
              </Box>
              <Box sx={{ ml: 4 }}>
                <CgnLogo />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {merchants?.map((company, i) => (
                <FormControlLabel
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                    m: 0,
                    py: 2,
                    borderBottom:
                      i < merchants.length - 1 ? "1px solid #e0e0e0" : "none"
                  }}
                  value={company.organization_fiscal_code}
                  control={
                    <Radio
                      name={`organization_fiscal_code_${i}`}
                      checked={
                        selectedCompany === company.organization_fiscal_code
                      }
                      onChange={e => setSelectedCompany(e.target.value)}
                      size="small"
                      sx={{ mt: 0.25 }}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {company.organization_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", color: "#5C6F82" }}
                      >
                        CF/PIVA {company.organization_fiscal_code}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Box>
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 5, gap: 2, flexWrap: "wrap" }}
            >
              <Button
                sx={{ px: 7 }}
                variant="outlined"
                color="primary"
                type="button"
                onClick={() => {
                  authentication.logout(authentication.currentSession);
                }}
              >
                Annulla
              </Button>
              <Button
                disabled={!selectedCompany}
                sx={{ px: 7 }}
                color="primary"
                type="button"
                onClick={onConfirmSelection}
                variant="contained"
              >
                Continua
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default SelectCompany;
