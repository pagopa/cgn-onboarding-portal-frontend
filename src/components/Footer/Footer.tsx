import { Box, Typography } from "@mui/material";
import DeparmentLogo from "../Logo/DepartmentLogo";
import Logo from "../Logo/Logo";

const Footer = () => (
  <Box component="footer" sx={{ mt: 6 }}>
    <Box
      sx={{
        p: 1.5,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <DeparmentLogo />
    </Box>
    <Box sx={{ p: 4, backgroundColor: "#01254c", color: "white" }}>
      <Box sx={{ maxWidth: "lg", mx: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 9fr" },
            gap: 2,
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "center" }
            }}
          >
            <a
              href="https://www.pagopa.it/it/"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex" }}
            >
              <Logo />
            </a>
          </Box>
          <Typography
            variant="body2"
            sx={{ color: "white", textAlign: "left" }}
          >
            PagoPA S.p.A. - società per azioni con socio unico - capitale
            sociale di euro 1,000,000 interamente versato - sede legale in Roma,
            Piazza Colonna 370, CAP 00187 - n. di iscrizione a Registro Imprese
            di Roma, CF e P.IVA 15376371009
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Box>
            <ul>
              <li>
                <a
                  href="https://io.italia.it/carta-giovani-nazionale/informativa-operatori"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#C5D0DB", textDecoration: "none" }}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default Footer;
