import React, { useEffect, useState } from "react";
import { LinkList, LinkListItem, Icon } from "design-react-kit";
import { useSelector } from "react-redux";
import { tryCatch } from "fp-ts/lib/TaskEither";
import { toError } from "fp-ts/lib/Either";
import Api from "../../api";

const ProfileApiToken = () => {
  const agreement = useSelector((state: any) => state.agreement.value);
  const [tokens, setTokens] = useState<any>();

  const getToken = async (agreementId: string) =>
    await tryCatch(() => Api.ApiToken.getTokens(agreementId), toError)
      .map(response => response.data)
      .fold(
        () => void 0,
        tokens => setTokens(tokens)
      )
      .run();

  useEffect(() => {
    void getToken(agreement.id);
  }, []);

  return <>{tokens && <p>ahaha</p>}</>;
};

export default ProfileApiToken;
