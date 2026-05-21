import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import { Fragment } from "react";
import FileIcon from "@mui/icons-material/Description";
import { remoteData } from "../../api/common";
import { formatDate } from "../../utils/dates";
import { EntityType } from "../../api/generated";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";

const ProfileDocuments = () => {
  const agreement = useCgnSelector(selectAgreement);

  const documentsQuery = remoteData.Index.Document.getDocuments.useQuery({
    agreementId: agreement.id
  });
  const agreementDocument = documentsQuery.data?.items.find(
    document =>
      document.documentType === "backoffice_agreement" ||
      document.documentType === "agreement"
  );
  const manifestationDocument = documentsQuery.data?.items.find(
    document =>
      document.documentType === "backoffice_adhesion_request" ||
      document.documentType === "adhesion_request"
  );

  const entityType = agreement.entityType;

  return (
    <>
      {agreementDocument && manifestationDocument && (
        <section
          style={{
            backgroundColor: "white",
            padding: "2rem",
            marginTop: "1rem"
          }}
        >
          <h2>Documenti</h2>
          <List>
            <ListItem>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <a
                    href={agreementDocument.documentUrl}
                    style={{ padding: 0, textDecoration: "none" }}
                    rel="noreferrer"
                  >
                    Convenzione
                  </a>
                }
                secondary={`Caricato il ${formatDate(agreementDocument.documentTimestamp)}`}
              />
            </ListItem>
            <Divider />
            {entityType === EntityType.Private && (
              <Fragment>
                <ListItem>
                  <ListItemIcon>
                    <FileIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <a
                        href={manifestationDocument.documentUrl}
                        style={{ padding: 0, textDecoration: "none" }}
                      >
                        Allegato 1 - Domanda di adesione alla CGN
                      </a>
                    }
                    secondary={`Caricato il ${formatDate(manifestationDocument.documentTimestamp)}`}
                  />
                </ListItem>
                <Divider />
              </Fragment>
            )}
            <ListItem>
              <ListItemIcon>
                <FileIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <a
                    href="https://docs.pagopa.it/carta-giovani-nazionale"
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: 0, textDecoration: "none" }}
                  >
                    Documentazione tecnica
                  </a>
                }
              />
            </ListItem>
          </List>
        </section>
      )}
    </>
  );
};

export default ProfileDocuments;
