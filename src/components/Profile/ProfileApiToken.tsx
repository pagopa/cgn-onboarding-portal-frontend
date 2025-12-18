import { useState } from "react";
import { Button, Icon } from "design-react-kit";
import { useSelector } from "react-redux";
import { remoteData } from "../../api/common";
import { ApiTokens } from "../../api/generated";
import { selectAgreement } from "../../store/agreement/selectors";

const ProfileApiToken = () => {
  const agreement = useSelector(selectAgreement);
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
        <section className="mt-4 px-8 py-10 bg-white">
          <h2 className="h5 fw-bold text-dark-blue">
            Codici di validazione API
          </h2>
          <table className="table mb-4">
            <tbody>
              <tr>
                <td className="px-0 text-gray border-bottom-0">
                  Chiave primaria
                </td>
                <td className="d-flex flex-row border-bottom-0">
                  <div>
                    <Icon
                      icon={
                        isPrimaryTokenShown
                          ? "it-password-invisible"
                          : "it-password-visible"
                      }
                      color="primary"
                      size="sm"
                      className="me-4"
                      onClick={() =>
                        setIsPrimaryTokenShown(!isPrimaryTokenShown)
                      }
                    />
                  </div>
                  <div className="d-flex flex-column justify-items-start">
                    <span>
                      {isPrimaryTokenShown
                        ? tokens.primaryToken
                        : getHiddenToken(tokens.primaryToken)}
                    </span>
                    <Button
                      size="xs"
                      className="mt-4 me-4"
                      color="primary"
                      outline
                      tag="button"
                      style={{ width: "6em" }}
                      onClick={() => regenerateToken(agreement.id, "primary")}
                    >
                      Rigenera
                    </Button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-0 text-gray border-bottom-0">
                  Chiave secondaria
                </td>
                <td className="d-flex flex-row border-bottom-0">
                  <div>
                    <Icon
                      icon={
                        isSecondaryTokenShown
                          ? "it-password-invisible"
                          : "it-password-visible"
                      }
                      color="primary"
                      size="sm"
                      className="me-4"
                      onClick={() =>
                        setIsSecondaryTokenShown(!isSecondaryTokenShown)
                      }
                    />
                  </div>
                  <div className="d-flex flex-column justify-items-start">
                    <span>
                      {isSecondaryTokenShown
                        ? tokens.secondaryToken
                        : getHiddenToken(tokens.secondaryToken)}
                    </span>
                    <Button
                      size="xs"
                      className="mt-4 me-4"
                      color="primary"
                      outline
                      tag="button"
                      style={{ width: "6em" }}
                      onClick={() => regenerateToken(agreement.id, "secondary")}
                    >
                      Rigenera
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default ProfileApiToken;
