import { AxiosResponse } from "axios";
import { toError } from "fp-ts/lib/Either";
import * as TE from "fp-ts/TaskEither";

const chainAxios = (response: AxiosResponse) =>
  TE.fromPredicate(
    (_: AxiosResponse) => _.status === 200 || _.status === 204,
    toError
  )(response);

export default chainAxios;
