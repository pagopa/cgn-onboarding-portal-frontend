import React, { useEffect, useState } from "react";
import { Button, Icon } from "design-react-kit";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api";
const ProfileApiToken = () => {
  const agreement = useSelector((state: any) => state.agreement.value);
  const [tokens, setTokens] = useState<any>();
  const [isPrimaryTokenShown, setIsPrimaryTokenShown] = useState(false);
  const [isSecondaryTokenShown, setIsSecondaryTokenShown] = useState(false);

  const getToken = async (agreementId: string) =>
    await tryCatch(() => Api.ApiToken.getTokens(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        tokens => setTokens(tokens)
      )
      .run();

  const regenerateToken = async (
    agreementId: string,
    tokenType: "primary" | "secondary"
  ) =>
    await tryCatch(
      () => Api.ApiToken.regenerateToken(agreementId, tokenType),
      toError
    )
      .map(response => response.data)
      .fold(
        () => void 0,
        tokens => setTokens(tokens)
      )
      .run();

  const getHiddenToken = (token: string) => "X".repeat(token.length);

  useEffect(() => {
    void getToken(agreement.id);
  }, []);

  return (
    <>
      {tokens && (
        <section className="mt-4 px-8 py-10 bg-white">
          <h2 className="h5 font-weight-bold text-dark-blue">
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
                      className="mr-4"
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
                      className="mt-4 mr-4"
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
                      className="mr-4"
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
                      className="mt-4 mr-4"
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
