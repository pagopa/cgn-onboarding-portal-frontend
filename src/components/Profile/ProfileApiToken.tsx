import { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Box
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { remoteData } from "../../api/common";
import { ApiTokens } from "../../api/generated";
import { selectAgreement } from "../../store/agreement/selectors";
import { useCgnSelector } from "../../store/hooks";

const ProfileApiToken = () => {
  const agreement = useCgnSelector(selectAgreement);
  const [isPrimaryTokenShown, setIsPrimaryTokenShown] = useState(false);
  const [isSecondaryTokenShown, setIsSecondaryTokenShown] = useState(false);

  const tokensQuery = remoteData.Index.ApiToken.getTokens.useQuery({
    agreementId: agreement.id
  });

  const [regeneratedTokens, setRegeneratedTokens] = useState<ApiTokens>();

  const regenerateTokenMutation =
    remoteData.Index.ApiToken.regenerateToken.useMutation({
      onSuccess(data) {
        setRegeneratedTokens(data);
      }
    });
  const regenerateToken = (
    agreementId: string,
    tokenType: "primary" | "secondary"
  ) => {
    regenerateTokenMutation.mutate({ agreementId, tokenType });
  };

  const tokens = regeneratedTokens ?? tokensQuery.data;

  const getHiddenToken = (token: string) => "X".repeat(token.length);

  return (
    <>
      {tokens && (
        <section
          style={{
            backgroundColor: "white",
            padding: "2rem",
            marginTop: "1rem"
          }}
        >
          <h2>Codici di validazione API</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Chiave primaria</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setIsPrimaryTokenShown(!isPrimaryTokenShown)
                      }
                      sx={{ p: 0 }}
                    >
                      {isPrimaryTokenShown ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <span>
                        {isPrimaryTokenShown
                          ? tokens.primaryToken
                          : getHiddenToken(tokens.primaryToken)}
                      </span>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        type="button"
                        sx={{ mt: 1, width: "6em" }}
                        onClick={() => regenerateToken(agreement.id, "primary")}
                      >
                        Rigenera
                      </Button>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Chiave secondaria</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setIsSecondaryTokenShown(!isSecondaryTokenShown)
                      }
                      sx={{ p: 0 }}
                    >
                      {isSecondaryTokenShown ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <span>
                        {isSecondaryTokenShown
                          ? tokens.secondaryToken
                          : getHiddenToken(tokens.secondaryToken)}
                      </span>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        type="button"
                        sx={{ mt: 1, width: "6em" }}
                        onClick={() =>
                          regenerateToken(agreement.id, "secondary")
                        }
                      >
                        Rigenera
                      </Button>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      )}
    </>
  );
};

export default ProfileApiToken;
