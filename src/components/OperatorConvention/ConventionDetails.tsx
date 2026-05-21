import { ReactNode, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "date-fns";
import {
  Box,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  IconButton
} from "@mui/material";
import { remoteData } from "../../api/common";
import CenteredLoading from "../CenteredLoading/CenteredLoading";
import {
  ApprovedAgreementDetail,
  ApprovedAgreement
} from "../../api/generated_backoffice";
import Documents from "./Documents";
import Profile from "./Profile";
import Referent from "./Referent";
import OperatorData from "./OperatorData";
import Discount from "./Discount";
import { BadgeStatus } from "./BadgeStatus";

const menuLink = (
  view: string,
  setView: (key: string) => void,
  viewKey: string,
  label: string,
  child?: ReactNode
) => (
  <Box>
    <ListItemButton
      selected={view.includes(viewKey)}
      onClick={() => !child && setView(viewKey)}
      sx={{ cursor: child ? "default" : "pointer" }}
    >
      <ListItemText primary={label} />
    </ListItemButton>
    {child}
  </Box>
);

const getView = (
  details: ApprovedAgreementDetail | undefined,
  view: string,
  getConventionDetails: () => void,
  agreement: ApprovedAgreement
) => {
  if (details) {
    if (view.includes("agevolazione")) {
      const discount =
        details?.discounts?.[Number(view.replace(/^\D+/g, "")) - 1];
      if (discount) {
        return (
          <Discount
            reloadDetails={getConventionDetails}
            agreementId={agreement?.agreementId ?? ""}
            discount={discount}
            profile={details.profile}
          />
        );
      } else {
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2.5, fontWeight: "bold" }}>
              Opportunità
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "#5C6F82" }}
            >
              Non è presente nessuna opportunità.
            </Typography>
          </Box>
        );
      }
    }
    switch (view) {
      case "dati_operatore":
        return <OperatorData profile={details.profile} />;
      case "profilo":
        return <Profile profile={details.profile} />;
      case "referente":
        return <Referent referent={details.profile.referent} />;
      case "documenti":
        return <Documents documents={details.documents} />;
    }
  }
};

const ConventionDetails = ({
  agreement,
  onClose
}: {
  agreement: ApprovedAgreement;
  onClose: () => void;
}) => {
  const [view, setView] = useState("dati_operatore");

  const {
    data: details,
    isPending,
    refetch
  } = remoteData.Backoffice.Agreement.getApprovedAgreement.useQuery({
    agreementId: agreement?.agreementId || ""
  });

  return isPending ? (
    <Box sx={{ mt: 1, px: 4, py: 5, backgroundColor: "white" }}>
      <CenteredLoading />
    </Box>
  ) : (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
          px: 4,
          py: 5,
          backgroundColor: "white"
        }}
      >
        <Typography variant="h6">{agreement.fullName}</Typography>
        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "#5C6F82", mb: 0.5 }}
          >
            Data convenzionamento
          </Typography>
          <Typography variant="body2">
            {format(new Date(agreement.agreementStartDate), "dd/MM/yyyy")}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "#5C6F82", mb: 0.5 }}
          >
            Data ultima modifica
          </Typography>
          <Typography variant="body2">
            {format(new Date(agreement.agreementLastUpdateDate), "dd/MM/yyyy")}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ mr: 0.5, px: 4, py: 5, backgroundColor: "white" }}>
            <List>
              {menuLink(view, setView, "dati_operatore", "Profilo")}
              {menuLink(
                view,
                setView,
                "agevolazione",
                "Opportunità",
                details?.discounts?.length ? (
                  <List dense sx={{ pl: 2 }}>
                    {details?.discounts?.map((d, i: number) => (
                      <ListItemButton
                        key={i}
                        selected={view.includes(`agevolazione${i + 1}`)}
                        onClick={() => setView(`agevolazione${i + 1}`)}
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <ListItemText
                          primary={d.name}
                          primaryTypographyProps={{
                            sx: {
                              color: "#0073E6",
                              fontWeight: view.includes(`agevolazione${i + 1}`)
                                ? "bold"
                                : "normal"
                            }
                          }}
                        />
                        <BadgeStatus discountState={d.state} />
                      </ListItemButton>
                    ))}
                  </List>
                ) : null
              )}
              {menuLink(view, setView, "profilo", "Dati dell'ente")}
              {menuLink(view, setView, "referente", "Dati del referente")}
              {menuLink(view, setView, "documenti", "Documenti")}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box sx={{ ml: 0.5, px: 4, py: 5, backgroundColor: "white" }}>
            {getView(details, view, () => refetch(), agreement)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConventionDetails;
